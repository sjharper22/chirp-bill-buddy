
import { useState, useEffect } from "react";
import { PatientProfile } from "@/types/patient";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { patientService } from "@/services/patientService";

export function usePatientPage() {
  const { isAdmin, isEditor } = useAuth();
  const { toast } = useToast();
  
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<PatientProfile[]>([]);
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  
  const canEdit = isAdmin || isEditor;
  
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await patientService.getAll();
      setPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      toast({
        title: "Error",
        description: "Failed to load patients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPatients();
    
    // Set up a refresh interval (every 30 seconds)
    const intervalId = setInterval(fetchPatients, 30000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
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
      await patientService.create(patientData);
      setDialogOpen(false);
      toast({
        title: "Patient Added",
        description: `${patientData.name} has been added successfully.`,
      });
      fetchPatients(); // Refresh the patient list immediately
    } catch (error: any) {
      console.error("Error adding patient:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add patient",
        variant: "destructive",
      });
    }
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
    setSelectedPatientIds(filteredPatients.map(patient => patient.id));
  };
  
  const clearPatientSelection = () => {
    setSelectedPatientIds([]);
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
