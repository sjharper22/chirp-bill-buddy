
import { useState, useEffect, useCallback } from "react";
import { PatientProfile } from "@/types/patient";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { patientService } from "@/services/patientService";
import { usePatient } from "@/context/patient-context";

export function usePatientPage() {
  const { isAdmin, isEditor } = useAuth();
  const { toast } = useToast();
  const { patients: localPatients, addPatient, togglePatientSelection, selectAllPatients, clearPatientSelection, selectedPatientIds } = usePatient();
  
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientProfile[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  const canEdit = isAdmin || isEditor;

  // Use the fetchPatients function from useCallback to prevent unnecessary recreations
  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Fetching patients from Supabase...");
      const data = await patientService.getAll();
      console.log("Patients fetched:", data);
      
      if (data && data.length > 0) {
        setPatients(data);
        setFilteredPatients(data);
      } else {
        // If no data from database, use local context data
        console.log("No patients found in database, using local context:", localPatients);
        setPatients(localPatients);
        setFilteredPatients(localPatients);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      // Fall back to local context if database fetch fails
      setPatients(localPatients);
      setFilteredPatients(localPatients);
      
      toast({
        title: "Error",
        description: "Failed to load patients from database, using locally stored patients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, localPatients]);
  
  // Initial fetch
  useEffect(() => {
    fetchPatients();
    
    // Set up a refresh interval (every 15 seconds)
    const intervalId = setInterval(fetchPatients, 15000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchPatients]);
  
  // Filter patients based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(patient => 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchQuery, patients]);
  
  const handleAddPatient = async (patientData: Omit<PatientProfile, "id">) => {
    try {
      // First add to local state
      const newPatient = addPatient(patientData);
      
      // Then save to database
      const savedPatient = await patientService.create(patientData);
      
      setDialogOpen(false);
      toast({
        title: "Patient Added",
        description: `${patientData.name} has been added successfully.`,
      });
      
      // Refresh the patient list immediately
      fetchPatients();
    } catch (error: any) {
      console.error("Error adding patient:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add patient",
        variant: "destructive",
      });
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
    canEdit,
    fetchPatients,
    handleAddPatient,
    togglePatientSelection,
    selectAllPatients,
    clearPatientSelection
  };
}
