
import { useState, useEffect, ReactNode } from "react";
import { PatientProfile } from "@/types/patient";
import { useToast } from "@/components/ui/use-toast";
import { PatientContext } from "./patient-context";
import { patientActions } from "./patient-actions";
import { patientStorage } from "./patient-storage";

export function PatientProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Initial data fetch from database
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        // First attempt to fetch from database
        const dbPatients = await patientStorage.refreshFromDatabase();
        setPatients(dbPatients);
        
        // Then save to localStorage as backup
        localStorage.setItem("patients", JSON.stringify(dbPatients));
      } catch (error: any) {
        console.error("Error initializing patients data:", error);
        setError(error.message || "Failed to load patients");
        
        // Try to load from localStorage as fallback
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
            toast({
              title: "Warning",
              description: "Using cached patient data. Some information may be outdated.",
              variant: "destructive",
            });
          } catch (parseError) {
            console.error("Failed to parse saved patients:", parseError);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    initializeData();
  }, [toast]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (patients.length > 0) {
      console.log("Saving patients to localStorage:", patients.length);
      localStorage.setItem("patients", JSON.stringify(patients));
    }
  }, [patients]);

  // Sync with database - fetches patients from database and merges with local
  const syncPatientsWithDatabase = async (): Promise<PatientProfile[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const mergedPatients = await patientStorage.syncWithDatabase(patients);
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
      const dbPatients = await patientStorage.refreshFromDatabase();
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
      const newPatient = await patientActions.addPatient(patient, patients, toast);
      
      // Add to local state - ensure we don't cause a duplicate
      setPatients(prev => {
        // Check if patient with this ID already exists
        const exists = prev.some(p => p.id === newPatient.id);
        if (exists) {
          return prev;
        }
        return [...prev, newPatient];
      });
      
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
      await patientActions.updatePatient(id, updatedPatient, toast);
      
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
      await patientActions.deletePatient(id, toast);
      
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
