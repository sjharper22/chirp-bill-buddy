
import { useNavigate } from "react-router-dom";
import { PatientList } from "@/components/patient/PatientList";
import { PatientHeader } from "@/components/patient/PatientHeader";
import { PatientSearch } from "@/components/patient/PatientSearch";
import { PatientEmptyState } from "@/components/patient/PatientEmptyState";
import { PatientLoading } from "@/components/patient/PatientLoading";
import { ImportPatientsButton } from "@/components/patient/ImportPatientsButton";
import { usePatientPage } from "@/hooks/usePatientPage";
import { useEffect, useState, useCallback, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { PatientProfile } from "@/types/patient";
import { usePatient } from "@/context/patient/patient-context";

export default function Patients() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isManuallyRefreshing, setIsManuallyRefreshing] = useState(false);
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const mountedRef = useRef(false);
  const { refreshPatients: contextRefreshPatients } = usePatient();
  
  const {
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
    fetchPatients,
    handleAddPatient,
    togglePatientSelection,
    selectAllPatients,
    clearPatientSelection
  } = usePatientPage();
  
  useEffect(() => {
    console.log("Patients component mounted with", patients.length, "patients");
    mountedRef.current = true;
    
    // Force a refresh when the component mounts
    handleManualRefresh();
    
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  const handleManualRefresh = useCallback(async () => {
    // Prevent duplicate refreshes
    if (isManuallyRefreshing || loading) return;
    
    setIsManuallyRefreshing(true);
    try {
      console.log("Manual refresh started");
      const refreshedPatients = await contextRefreshPatients();
      console.log("Manual refresh complete, patients:", refreshedPatients?.length);
      
      if (mountedRef.current) {
        toast({
          title: "Success",
          description: "Patient list refreshed successfully",
        });
      }
    } catch (error: any) {
      console.error("Error during manual refresh:", error);
      
      if (mountedRef.current) {
        toast({
          title: "Error",
          description: `Failed to refresh patient list: ${error.message || "Unknown error"}`,
          variant: "destructive",
        });
      }
    } finally {
      if (mountedRef.current) {
        setIsManuallyRefreshing(false);
      }
    }
  }, [contextRefreshPatients, isManuallyRefreshing, loading, toast]);

  const handleAddPatientWrapper = async (patientData: Omit<PatientProfile, "id">) => {
    setIsAddingPatient(true);
    
    try {
      console.log("Adding new patient:", patientData);
      await handleAddPatient(patientData);
      setDialogOpen(false);
      
      // Force refresh after adding patient
      console.log("Patient added, refreshing list...");
      await handleManualRefresh();
      
      toast({
        title: "Success",
        description: `Patient "${patientData.name}" has been added successfully.`,
      });
    } catch (error: any) {
      console.error("Error adding patient:", error);
      
      toast({
        title: "Error",
        description: `Failed to add patient: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsAddingPatient(false);
    }
  };
  
  console.log("Rendering Patients page with:", { 
    patientsCount: patients.length, 
    filteredPatientsCount: filteredPatients.length,
    loading,
    error
  });
  
  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      <PatientHeader 
        canEdit={canEdit}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        onAddPatient={handleAddPatientWrapper}
        selectedPatientIds={selectedPatientIds}
        isAddingPatient={isAddingPatient}
      />
      
      <div className="flex justify-between items-center mb-6">
        <PatientSearch 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
        />
        
        <ImportPatientsButton onRefresh={handleManualRefresh} isRefreshing={isManuallyRefreshing} />
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {loading ? (
        <PatientLoading />
      ) : patients.length === 0 ? (
        <PatientEmptyState 
          canEdit={canEdit} 
          isSearching={false} 
          onAddClick={() => setDialogOpen(true)} 
          onClearSearch={() => setSearchQuery("")} 
        />
      ) : filteredPatients.length === 0 ? (
        <PatientEmptyState 
          canEdit={canEdit} 
          isSearching={true} 
          onAddClick={() => setDialogOpen(true)} 
          onClearSearch={() => setSearchQuery("")} 
        />
      ) : (
        <PatientList
          patients={filteredPatients}
          selectedPatientIds={selectedPatientIds}
          togglePatientSelection={togglePatientSelection}
          onSelectAll={selectAllPatients}
          onClearSelection={clearPatientSelection}
          canEdit={canEdit}
          onRefresh={handleManualRefresh}
        />
      )}
    </div>
  );
}
