
import { useState } from "react";
import { PatientProfile } from "@/types/patient";
import { patientStorage } from "../patient-storage";

export function usePatientSync(
  patients: PatientProfile[],
  setPatients: React.Dispatch<React.SetStateAction<PatientProfile[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) {
  const [isInitialized, setIsInitialized] = useState(false);

  // Effect to save patients to localStorage whenever they change
  const saveToLocalStorage = () => {
    if (patients.length > 0) {
      console.log("Saving patients to localStorage:", patients.length);
      localStorage.setItem("patients", JSON.stringify(patients));
    }
  };

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

  return { 
    isInitialized, 
    setIsInitialized, 
    saveToLocalStorage, 
    syncPatientsWithDatabase, 
    refreshPatients 
  };
}
