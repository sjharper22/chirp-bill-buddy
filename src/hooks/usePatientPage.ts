
import { useState, useEffect, useCallback } from "react";
import { PatientProfile } from "@/types/patient";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { usePatient } from "@/context/patient-context";

export function usePatientPage() {
  const { isAdmin, isEditor } = useAuth();
  const { toast } = useToast();
  const { 
    patients: contextPatients,
    loading: contextLoading,
    error: contextError,
    addPatient,
    togglePatientSelection,
    selectAllPatients, 
    clearPatientSelection,
    selectedPatientIds,
    refreshPatients,
    syncPatientsWithDatabase
  } = usePatient();
  
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientProfile[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const canEdit = isAdmin || isEditor;

  // Load patients from context and apply filtering
  useEffect(() => {
    console.log("useEffect: updating patients from context", contextPatients);
    setPatients(contextPatients);
    
    // Filter patients based on search query
    if (searchQuery.trim() === "") {
      setFilteredPatients(contextPatients);
    } else {
      const filtered = contextPatients.filter(patient => 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
    
    // Update loading and error state from context
    setLoading(contextLoading);
    setError(contextError);
  }, [contextPatients, contextLoading, contextError, searchQuery]);
  
  // Initial fetch when component mounts
  useEffect(() => {
    console.log("useEffect in usePatientPage is running - initial fetch");
    handleRefreshPatients();
    
    // Set up a refresh interval (every 30 seconds)
    const intervalId = setInterval(() => {
      console.log("Auto-refreshing patients data...");
      syncPatientsWithDatabase().catch(err => {
        console.error("Error during automatic patient sync:", err);
      });
    }, 30000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Function to manually refresh patients
  const handleRefreshPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Manually refreshing patients...");
      await refreshPatients();
      
      toast({
        title: "Success",
        description: "Patient list refreshed successfully",
      });
    } catch (error: any) {
      console.error("Error refreshing patients:", error);
      setError(error.message || "Failed to refresh patients");
      
      toast({
        title: "Error",
        description: "Failed to refresh patient list",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Modified to return Promise<void> to match the expected type in PatientHeader
  const handleAddPatient = async (patientData: Omit<PatientProfile, "id">): Promise<void> => {
    try {
      const newPatient = await addPatient(patientData);
      
      setDialogOpen(false);
      toast({
        title: "Patient Added",
        description: `${patientData.name} has been added successfully.`,
      });
    } catch (error: any) {
      console.error("Error adding patient:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add patient",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  return {
    patients,
    filteredPatients,
    selectedPatientIds,
    dialogOpen,
    setDialogOpen,
    searchQuery,
    setSearchQuery,
    loading,
    error,
    canEdit,
    fetchPatients: handleRefreshPatients,
    handleAddPatient,
    togglePatientSelection,
    selectAllPatients,
    clearPatientSelection
  };
}
