import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Superbill, ClinicDefaults, SuperbillStatus } from "@/types/superbill";
import { generateId } from "@/lib/utils/superbill-utils";

// Default clinic information from the provided image
const DEFAULT_CLINIC_INFO: ClinicDefaults = {
  clinicName: "Collective Family Chiropractic",
  clinicAddress: "700 Churchill Court, Suite 130, Woodstock, GA 30188",
  clinicPhone: "(678) 540-8850",
  clinicEmail: "info@collectivefamilychiro.com",
  ein: "92-0772385",
  npi: "", // No NPI was provided in the image
  providerName: "", // No provider name was provided
  defaultIcdCodes: [],
  defaultCptCodes: [],
  defaultMainComplaints: [], // Added default main complaints array
  defaultFee: 0
};

interface SuperbillContextType {
  superbills: Superbill[];
  clinicDefaults: ClinicDefaults;
  addSuperbill: (superbill: Superbill) => void;
  updateSuperbill: (id: string, superbill: Superbill) => void;
  deleteSuperbill: (id: string) => void;
  duplicateSuperbill: (id: string) => string;
  getSuperbill: (id: string) => Superbill | undefined;
  updateClinicDefaults: (defaults: Partial<ClinicDefaults>) => void;
  updateSuperbillStatus: (id: string, status: SuperbillStatus) => void;
}

const SuperbillContext = createContext<SuperbillContextType | undefined>(undefined);

export function SuperbillProvider({ children }: { children: ReactNode }) {
  const [superbills, setSuperbills] = useState<Superbill[]>([]);
  const [clinicDefaults, setClinicDefaults] = useState<ClinicDefaults>(DEFAULT_CLINIC_INFO);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedSuperbills = localStorage.getItem("superbills");
    const savedDefaults = localStorage.getItem("clinicDefaults");

    if (savedSuperbills) {
      try {
        // Convert string dates back to Date objects
        const parsed = JSON.parse(savedSuperbills, (key, value) => {
          if (key === "patientDob" || key === "issueDate" || key === "date" || 
              key === "createdAt" || key === "updatedAt") {
            return new Date(value);
          }
          return value;
        });
        
        // Ensure all superbills have a status
        const parsedWithStatus = parsed.map((bill: any) => ({
          ...bill,
          status: bill.status || 'draft',
        }));
        
        setSuperbills(parsedWithStatus);
      } catch (error) {
        console.error("Failed to parse saved superbills:", error);
      }
    }

    if (savedDefaults) {
      try {
        const parsed = JSON.parse(savedDefaults);
        setClinicDefaults({ ...DEFAULT_CLINIC_INFO, ...parsed });
      } catch (error) {
        console.error("Failed to parse saved clinic defaults:", error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("superbills", JSON.stringify(superbills));
  }, [superbills]);

  useEffect(() => {
    localStorage.setItem("clinicDefaults", JSON.stringify(clinicDefaults));
  }, [clinicDefaults]);

  const addSuperbill = (superbill: Superbill) => {
    // Ensure new superbills have a status
    const newSuperbill = {
      ...superbill,
      status: superbill.status || 'draft'
    };
    setSuperbills(prev => [...prev, newSuperbill]);
  };

  const updateSuperbill = (id: string, updatedSuperbill: Superbill) => {
    setSuperbills(prev => prev.map(bill => bill.id === id ? updatedSuperbill : bill));
  };

  const deleteSuperbill = (id: string) => {
    setSuperbills(prev => prev.filter(bill => bill.id !== id));
  };

  const duplicateSuperbill = (id: string): string => {
    const originalSuperbill = superbills.find(bill => bill.id === id);
    if (!originalSuperbill) {
      throw new Error("Superbill not found");
    }

    const now = new Date();
    const newId = generateId();
    const duplicatedSuperbill: Superbill = {
      ...originalSuperbill,
      id: newId,
      status: 'draft', // Reset status to draft
      createdAt: now,
      updatedAt: now,
      // Generate new IDs for visits to avoid conflicts
      visits: originalSuperbill.visits.map(visit => ({
        ...visit,
        id: generateId(),
        status: 'draft' // Reset visit status as well
      }))
    };

    setSuperbills(prev => [...prev, duplicatedSuperbill]);
    return newId; // Return the new ID so we can navigate to it
  };

  const getSuperbill = (id: string) => {
    return superbills.find(bill => bill.id === id);
  };

  const updateClinicDefaults = (defaults: Partial<ClinicDefaults>) => {
    setClinicDefaults(prev => ({ ...prev, ...defaults }));
  };

  const updateSuperbillStatus = (id: string, status: SuperbillStatus) => {
    setSuperbills(prev => 
      prev.map(bill => 
        bill.id === id ? { ...bill, status } : bill
      )
    );
  };

  return (
    <SuperbillContext.Provider 
      value={{ 
        superbills, 
        clinicDefaults, 
        addSuperbill, 
        updateSuperbill, 
        deleteSuperbill, 
        duplicateSuperbill,
        getSuperbill,
        updateClinicDefaults,
        updateSuperbillStatus 
      }}
    >
      {children}
    </SuperbillContext.Provider>
  );
}

export function useSuperbill() {
  const context = useContext(SuperbillContext);
  if (context === undefined) {
    throw new Error("useSuperbill must be used within a SuperbillProvider");
  }
  return context;
}
