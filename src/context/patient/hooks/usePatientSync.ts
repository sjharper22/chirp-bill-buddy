
import { useState } from "react";
import { PatientProfile } from "@/types/patient";
import { patientStorage } from "../patient-storage";
import { useToast } from "@/components/ui/use-toast";

export function usePatientSync(
  patients: PatientProfile[],
  setPatients: React.Dispatch<React.SetStateAction<PatientProfile[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) {
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

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
      toast({
        title: "Sync Complete",
        description: `Successfully synced ${mergedPatients.length} patients with database.`,
      });
      return mergedPatients;
    } catch (error: any) {
      console.error("Error syncing patients:", error);
      setError(error.message || "Failed to sync patients");
      toast({
        title: "Sync Error",
        description: "Failed to sync with database. Some patients may not be visible.",
        variant: "destructive",
      });
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
      console.log("Patients refreshed from database:", dbPatients.length);
      return dbPatients;
    } catch (error: any) {
      console.error("Error refreshing patients:", error);
      setError(error.message || "Failed to refresh patients");
      
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
