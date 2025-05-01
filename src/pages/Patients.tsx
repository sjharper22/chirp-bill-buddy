
import { useNavigate } from "react-router-dom";
import { PatientList } from "@/components/patient/PatientList";
import { PatientHeader } from "@/components/patient/PatientHeader";
import { PatientSearch } from "@/components/patient/PatientSearch";
import { PatientEmptyState } from "@/components/patient/PatientEmptyState";
import { PatientLoading } from "@/components/patient/PatientLoading";
import { ImportPatientsButton } from "@/components/patient/ImportPatientsButton";
import { usePatientPage } from "@/hooks/usePatientPage";
import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PatientProfile } from "@/types/patient";

export default function Patients() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isManuallyRefreshing, setIsManuallyRefreshing] = useState(false);
  
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
  
  // We're only calling fetchPatients once at mount now
  // This prevents multiple refreshes causing UI flickers
  useEffect(() => {
    console.log("Patients component mounted");
    // Initial fetch is now handled in usePatientPage
    // We don't need to call fetchPatients() again here
  }, []);
  
  const handleManualRefresh = useCallback(async () => {
    // Prevent duplicate refreshes
    if (isManuallyRefreshing || loading) return;
    
    setIsManuallyRefreshing(true);
    try {
      await fetchPatients();
      toast({
        title: "Success",
        description: "Patient list refreshed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh patient list",
        variant: "destructive",
      });
    } finally {
      setIsManuallyRefreshing(false);
    }
  }, [fetchPatients, isManuallyRefreshing, loading, toast]);

  // Wrapper function to handle the type mismatch
  const handleAddPatientWrapper = async (patientData: Omit<PatientProfile, "id">) => {
    await handleAddPatient(patientData);
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
      />
      
      <div className="flex justify-between items-center mb-6">
        <PatientSearch 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
        />
        
        <div className="flex gap-2">
          <ImportPatientsButton />
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isManuallyRefreshing || loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isManuallyRefreshing ? 'animate-spin' : ''}`} />
            {isManuallyRefreshing ? 'Refreshing...' : 'Refresh Patients'}
          </Button>
        </div>
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
