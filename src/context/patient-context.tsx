
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PatientProfile } from "@/types/patient";
import { generateId } from "@/lib/utils/superbill-utils";
import { patientService } from "@/services/patientService";
import { useToast } from "@/components/ui/use-toast";

interface PatientContextType {
  patients: PatientProfile[];
  loading: boolean;
  error: string | null;
  addPatient: (patient: Omit<PatientProfile, "id">) => Promise<PatientProfile>;
  updatePatient: (id: string, patient: PatientProfile) => Promise<void>;
  deletePatient: (id: string) => Promise<void>;
  getPatient: (idOrName: string) => PatientProfile | undefined;
  selectedPatientIds: string[];
  togglePatientSelection: (id: string) => void;
  selectAllPatients: () => void;
  clearPatientSelection: () => void;
  refreshPatients: () => Promise<PatientProfile[]>;
  syncPatientsWithDatabase: () => Promise<PatientProfile[]>;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedPatients = localStorage.getItem("patients");

    if (savedPatients) {
      try {
        // Convert string dates back to Date objects
        const parsed = JSON.parse(savedPatients, (key, value) => {
          if (key === "dob" || key === "lastSuperbillDate" || key === "start" || key === "end") {
            return value ? new Date(value) : value;
          }
          return value;
        });
        setPatients(parsed);
        
        // Fetch from database after loading local storage
        syncPatientsWithDatabase().catch(err => {
          console.error("Error syncing patients with database on init:", err);
        });
      } catch (error) {
        console.error("Failed to parse saved patients:", error);
      }
    } else {
      // If no local storage data, try to fetch from database
      syncPatientsWithDatabase().catch(err => {
        console.error("Error syncing patients with database on init:", err);
      });
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));
  }, [patients]);

  // Sync with database - fetches patients from database and merges with local
  const syncPatientsWithDatabase = async (): Promise<PatientProfile[]> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Syncing patients with database...");
      const dbPatients = await patientService.getAll();
      console.log("Database patients:", dbPatients);
      
      // Create a map of existing patients by ID for quick lookup
      const patientsMap = new Map<string, PatientProfile>();
      patients.forEach(patient => {
        patientsMap.set(patient.id, patient);
      });
      
      // Add database patients that don't exist locally
      dbPatients.forEach(dbPatient => {
        if (!patientsMap.has(dbPatient.id)) {
          patientsMap.set(dbPatient.id, dbPatient);
        }
      });
      
      // Convert back to array and update state
      const mergedPatients = Array.from(patientsMap.values());
      
      console.log("Merged patients:", mergedPatients);
      setPatients(mergedPatients);
      return mergedPatients;
    } catch (error: any) {
      console.error("Error syncing patients:", error);
      setError(error.message || "Failed to sync patients");
      return patients; // Return current state on error
    } finally {
      setLoading(false);
    }
  };
  
  // Refresh patients - gets latest from database and replaces local
  const refreshPatients = async (): Promise<PatientProfile[]> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Refreshing patients from database...");
      const dbPatients = await patientService.getAll();
      console.log("Database patients:", dbPatients);
      
      // Replace local patients with database patients
      setPatients(dbPatients);
      return dbPatients;
    } catch (error: any) {
      console.error("Error refreshing patients:", error);
      setError(error.message || "Failed to refresh patients");
      return patients; // Return current state on error
    } finally {
      setLoading(false);
    }
  };

  const addPatient = async (patient: Omit<PatientProfile, "id">): Promise<PatientProfile> => {
    try {
      console.log("Adding patient:", patient);
      
      // First check if patient with same name exists in database
      const existingPatient = await patientService.getByName(patient.name);
      
      if (existingPatient) {
        console.log("Patient already exists in database:", existingPatient);
        
        // Check if it exists in local state
        const localIndex = patients.findIndex(p => p.id === existingPatient.id);
        
        if (localIndex === -1) {
          // Add to local state if not found
          setPatients(prev => [...prev, existingPatient]);
        }
        
        return existingPatient;
      }
      
      // Create in database first to get the ID
      let newPatient: PatientProfile;
      try {
        newPatient = await patientService.create(patient);
        console.log("Patient created in database:", newPatient);
      } catch (dbError: any) {
        console.error("Database error creating patient:", dbError);
        // Fall back to local creation if database fails
        newPatient = { ...patient, id: generateId() };
        toast({
          title: "Warning",
          description: "Patient saved locally but couldn't be saved to database. Some features may not work correctly.",
          variant: "destructive",
        });
      }
      
      // Add to local state
      setPatients(prev => [...prev, newPatient]);
      return newPatient;
    } catch (error: any) {
      console.error("Error in addPatient:", error);
      toast({
        title: "Error",
        description: `Failed to add patient: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePatient = async (id: string, updatedPatient: PatientProfile): Promise<void> => {
    try {
      // Update in database first
      try {
        await patientService.update(id, updatedPatient);
        console.log("Patient updated in database:", updatedPatient);
      } catch (dbError: any) {
        console.error("Database error updating patient:", dbError);
        toast({
          title: "Warning",
          description: "Patient updated locally but couldn't be updated in database.",
          variant: "destructive",
        });
      }
      
      // Update local state
      setPatients(prev => prev.map(patient => patient.id === id ? updatedPatient : patient));
    } catch (error: any) {
      console.error("Error in updatePatient:", error);
      toast({
        title: "Error",
        description: `Failed to update patient: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deletePatient = async (id: string): Promise<void> => {
    try {
      // Delete from database first
      try {
        await patientService.delete(id);
        console.log("Patient deleted from database");
      } catch (dbError: any) {
        console.error("Database error deleting patient:", dbError);
        toast({
          title: "Warning",
          description: "Patient removed locally but couldn't be deleted from database.",
          variant: "destructive",
        });
      }
      
      // Delete from local state
      setPatients(prev => prev.filter(patient => patient.id !== id));
      setSelectedPatientIds(prev => prev.filter(patientId => patientId !== id));
    } catch (error: any) {
      console.error("Error in deletePatient:", error);
      toast({
        title: "Error",
        description: `Failed to delete patient: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  const getPatient = (idOrName: string) => {
    // First try to find patient by ID
    let patient = patients.find(patient => patient.id === idOrName);
    
    // If not found by ID, try to find by name (exact match)
    if (!patient) {
      patient = patients.find(patient => patient.name === idOrName);
    }
    
    return patient;
  };

  const togglePatientSelection = (id: string) => {
    setSelectedPatientIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(patientId => patientId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const selectAllPatients = () => {
    setSelectedPatientIds(patients.map(patient => patient.id));
  };

  const clearPatientSelection = () => {
    setSelectedPatientIds([]);
  };

  return (
    <PatientContext.Provider 
      value={{ 
        patients, 
        loading,
        error,
        addPatient, 
        updatePatient, 
        deletePatient, 
        getPatient,
        selectedPatientIds,
        togglePatientSelection,
        selectAllPatients,
        clearPatientSelection,
        refreshPatients,
        syncPatientsWithDatabase
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatient() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error("usePatient must be used within a PatientProvider");
  }
  return context;
}
