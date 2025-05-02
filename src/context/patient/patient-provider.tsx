
import { useEffect, ReactNode, useState } from "react";
import { PatientContext } from "./patient-context";
import { usePatientInitialization } from "./hooks/usePatientInitialization";
import { usePatientSync } from "./hooks/usePatientSync";
import { usePatientSelection } from "./hooks/usePatientSelection";
import { usePatientOperations } from "./hooks/usePatientOperations";

export function PatientProvider({ children }: { children: ReactNode }) {
  // Initialize state and fetch initial data
  const { 
    patients, setPatients, 
    loading, setLoading, 
    error, setError 
  } = usePatientInitialization();

  // Sync status
  const [isInitialized, setIsInitialized] = useState(false);

  // Set up database sync functionality
  const { 
    saveToLocalStorage, 
    syncPatientsWithDatabase, 
    refreshPatients,
    isSyncing
  } = usePatientSync(patients, setPatients, setLoading, setError);

  // Set up patient selection functionality
  const { 
    selectedPatientIds, 
    togglePatientSelection, 
    selectAllPatients, 
    clearPatientSelection 
  } = usePatientSelection(patients);

  // Set up patient CRUD operations
  const { 
    addPatient, 
    updatePatient, 
    deletePatient, 
    getPatient,
    isProcessing
  } = usePatientOperations(
    patients, 
    setPatients, 
    clearPatientSelection,
    refreshPatients // Pass the refresh function to ensure database sync
  );

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (patients.length > 0 && !isProcessing && !isSyncing) {
      saveToLocalStorage();
    }
  }, [patients, saveToLocalStorage, isProcessing, isSyncing]);

  // Set up initial database sync
  useEffect(() => {
    if (isInitialized) return;

    console.log("Initial patient sync is running");
    setIsInitialized(true);
    
    // Initial refresh to get latest data from database
    refreshPatients().catch(err => {
      console.error("Error during initial patient refresh:", err);
    });
    
    const refreshTimerRef = setInterval(() => {
      console.log("Auto-refreshing patients data...");
      syncPatientsWithDatabase().catch(err => {
        console.error("Error during automatic patient sync:", err);
      });
    }, 60000); // Sync every minute
    
    return () => {
      clearInterval(refreshTimerRef);
    };
  }, [isInitialized, refreshPatients, syncPatientsWithDatabase]);

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
