
import { useState, useCallback, useEffect } from "react";
import { PatientProfile } from "@/types/patient";
import { patientStorage } from "../patient-storage";
import { useToast } from "@/components/ui/use-toast";

export function usePatientSync(
  patients: PatientProfile[],
  setPatients: React.Dispatch<React.SetStateAction<PatientProfile[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>
) {
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  // Effect to save patients to localStorage whenever they change
  const saveToLocalStorage = useCallback(() => {
    if (patients.length > 0) {
      console.log("Saving patients to localStorage:", patients.length);
      patientStorage.saveToLocalStorage(patients);
    }
  }, [patients]);

  // Sync with database - fetches patients from database and merges with local
  const syncPatientsWithDatabase = useCallback(async (): Promise<PatientProfile[]> => {
    // Avoid multiple simultaneous sync operations
    if (isSyncing) {
      console.log("Sync already in progress, skipping");
      return patients;
    }
    
    setIsSyncing(true);
    setLoading(true);
    setError(null);
    
    try {
      console.log("Starting database sync with", patients.length, "local patients");
      const mergedPatients = await patientStorage.syncWithDatabase(patients);
      
      if (mergedPatients && Array.isArray(mergedPatients)) {
        setPatients(mergedPatients);
        
        // Save to localStorage as backup
        patientStorage.saveToLocalStorage(mergedPatients);
        
        setLastSyncTime(new Date());
        console.log("Sync complete with", mergedPatients.length, "patients");
        
        // Only show toast if it's a manual refresh (not automatic background sync)
        if (lastSyncTime) {
          toast({
            title: "Sync Complete",
            description: `Successfully synced ${mergedPatients.length} patients with database.`,
          });
        }
        
        return mergedPatients;
      } else {
        console.error("Invalid patients data returned from sync:", mergedPatients);
        return patients;
      }
    } catch (error: any) {
      console.error("Error syncing patients:", error);
      setError(error.message || "Failed to sync patients");
      
      // Only show toast if it's a manual refresh (not automatic background sync)
      if (lastSyncTime) {
        toast({
          title: "Sync Error",
          description: "Failed to sync with database. Some patients may not be visible.",
          variant: "destructive",
        });
      }
      
      return patients; // Return current state on error
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  }, [patients, setError, setLoading, setPatients, toast, lastSyncTime, isSyncing]);
  
  // Refresh patients - gets latest from database and replaces local
  const refreshPatients = useCallback(async (): Promise<PatientProfile[]> => {
    // Avoid multiple simultaneous refresh operations
    if (isSyncing) {
      console.log("Refresh already in progress, skipping");
      return patients;
    }
    
    setIsSyncing(true);
    setLoading(true);
    setError(null);
    
    try {
      console.log("Refreshing patients from database...");
      const dbPatients = await patientStorage.refreshFromDatabase();
      
      if (dbPatients && Array.isArray(dbPatients)) {
        // Always update the state with the database patients
        setPatients(dbPatients);
        setLastSyncTime(new Date());
        console.log("Patients refreshed from database:", dbPatients.length);
        
        return dbPatients;
      } else {
        console.error("Invalid patients data returned from refresh");
        throw new Error("Failed to refresh patients data");
      }
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
          
          if (parsed && Array.isArray(parsed)) {
            setPatients(parsed);
            toast({
              title: "Warning",
              description: "Using cached patient data. Some information may be outdated.",
              variant: "destructive",
            });
          }
        } catch (parseError) {
          console.error("Failed to parse saved patients:", parseError);
        }
      }
      
      return patients; // Return current state on error
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  }, [patients, setError, setLoading, setPatients, toast, isSyncing]);

  // Auto-sync on first load
  useEffect(() => {
    if (!lastSyncTime && patients.length === 0 && !isSyncing) {
      console.log("Initial patient sync triggered");
      refreshPatients().catch(error => {
        console.error("Error during initial sync:", error);
      });
    }
  }, [refreshPatients, lastSyncTime, patients.length, isSyncing]);

  return { 
    lastSyncTime,
    isSyncing,
    saveToLocalStorage, 
    syncPatientsWithDatabase, 
    refreshPatients 
  };
}
