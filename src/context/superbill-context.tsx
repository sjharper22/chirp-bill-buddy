import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Superbill, ClinicDefaults, SuperbillStatus } from "@/types/superbill";
import { generateId } from "@/lib/utils/superbill-utils";
import { superbillService } from "@/services/superbillService";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/auth-context";

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
  const { toast } = useToast();
  const { user } = useAuth();

  // Load data from Supabase on initial render
  useEffect(() => {
    const loadSuperbills = async () => {
      if (!user) return;
      
      try {
        console.log("Loading superbills from Supabase...");
        const loadedSuperbills = await superbillService.getAllSuperbills();
        console.log("Loaded superbills from Supabase:", loadedSuperbills);
        setSuperbills(loadedSuperbills);
      } catch (error) {
        console.error("Failed to load superbills from Supabase:", error);
        // Fallback to localStorage
        const savedSuperbills = localStorage.getItem("superbills");
        if (savedSuperbills) {
          try {
            const parsed = JSON.parse(savedSuperbills, (key, value) => {
              if (key === "patientDob" || key === "issueDate" || key === "date" || 
                  key === "createdAt" || key === "updatedAt") {
                return new Date(value);
              }
              return value;
            });
            setSuperbills(parsed);
          } catch (parseError) {
            console.error("Failed to parse localStorage superbills:", parseError);
          }
        }
      }
    };

    // Load clinic defaults from localStorage (keep this local for now)
    const savedDefaults = localStorage.getItem("clinicDefaults");
    if (savedDefaults) {
      try {
        const parsed = JSON.parse(savedDefaults);
        setClinicDefaults({ ...DEFAULT_CLINIC_INFO, ...parsed });
      } catch (error) {
        console.error("Failed to parse saved clinic defaults:", error);
      }
    }

    loadSuperbills();
  }, [user]);

  // Save clinic defaults to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("clinicDefaults", JSON.stringify(clinicDefaults));
  }, [clinicDefaults]);

  const addSuperbill = async (superbill: Superbill) => {
    try {
      const newSuperbill = {
        ...superbill,
        status: superbill.status || 'draft'
      };
      
      if (user) {
        // Save to Supabase
        const savedSuperbill = await superbillService.createSuperbill(newSuperbill);
        setSuperbills(prev => [...prev, savedSuperbill]);
        toast({
          title: "Success",
          description: "Superbill saved to database",
        });
      } else {
        // Fallback to local state
        setSuperbills(prev => [...prev, newSuperbill]);
      }
    } catch (error) {
      console.error("Error saving superbill:", error);
      // Fallback to local state
      const newSuperbill = {
        ...superbill,
        status: superbill.status || 'draft'
      };
      setSuperbills(prev => [...prev, newSuperbill]);
      toast({
        title: "Warning",
        description: "Superbill saved locally. Please check your connection.",
        variant: "destructive"
      });
    }
  };

  const updateSuperbill = async (id: string, updatedSuperbill: Superbill) => {
    try {
      if (user) {
        // Update in Supabase
        const savedSuperbill = await superbillService.updateSuperbill(id, updatedSuperbill);
        setSuperbills(prev => prev.map(bill => bill.id === id ? savedSuperbill : bill));
      } else {
        // Fallback to local state
        setSuperbills(prev => prev.map(bill => bill.id === id ? updatedSuperbill : bill));
      }
    } catch (error) {
      console.error("Error updating superbill:", error);
      // Fallback to local state
      setSuperbills(prev => prev.map(bill => bill.id === id ? updatedSuperbill : bill));
      toast({
        title: "Warning", 
        description: "Changes saved locally. Please check your connection.",
        variant: "destructive"
      });
    }
  };

  const deleteSuperbill = async (id: string) => {
    try {
      if (user) {
        // Delete from Supabase
        await superbillService.deleteSuperbill(id);
        setSuperbills(prev => prev.filter(bill => bill.id !== id));
        toast({
          title: "Success",
          description: "Superbill deleted from database",
        });
      } else {
        // Fallback to local state
        setSuperbills(prev => prev.filter(bill => bill.id !== id));
      }
    } catch (error) {
      console.error("Error deleting superbill:", error);
      toast({
        title: "Error",
        description: "Failed to delete superbill from database",
        variant: "destructive"
      });
    }
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
        status: 'draft', // Reset visit status as well
        cptCodeEntries: visit.cptCodeEntries ? [...visit.cptCodeEntries] : [] // Deep copy CPT entries
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
