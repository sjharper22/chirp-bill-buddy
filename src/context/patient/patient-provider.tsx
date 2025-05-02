
import { useEffect, ReactNode } from "react";
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

  // Set up database sync functionality
  const { 
    isInitialized, setIsInitialized,
    saveToLocalStorage, 
    syncPatientsWithDatabase, 
    refreshPatients 
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
    getPatient 
  } = usePatientOperations(patients, setPatients, clearPatientSelection);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    saveToLocalStorage();
  }, [patients]);

  // Set up automatic refresh/sync
  useEffect(() => {
    if (isInitialized) return;

    console.log("Initial patient sync is running");
    setIsInitialized(true);
    
    const refreshTimerRef = setInterval(() => {
      console.log("Auto-refreshing patients data...");
      syncPatientsWithDatabase().catch(err => {
        console.error("Error during automatic patient sync:", err);
      });
    }, 60000);
    
    return () => {
      clearInterval(refreshTimerRef);
    };
  }, [isInitialized]);

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
