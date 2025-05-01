
import { useNavigate } from "react-router-dom";
import { PatientList } from "@/components/patient/PatientList";
import { PatientHeader } from "@/components/patient/PatientHeader";
import { PatientSearch } from "@/components/patient/PatientSearch";
import { PatientEmptyState } from "@/components/patient/PatientEmptyState";
import { PatientLoading } from "@/components/patient/PatientLoading";
import { usePatientPage } from "@/hooks/usePatientPage";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function Patients() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
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
  } = usePatientPage();
  
  // Force a refresh when the component mounts
  useEffect(() => {
    const loadPatients = async () => {
      try {
        await fetchPatients();
        console.log("Patients loaded successfully");
      } catch (error) {
        console.error("Failed to load patients:", error);
        toast({
          title: "Error",
          description: "Failed to load patients. Please refresh the page.",
          variant: "destructive",
        });
      }
    };
    
    loadPatients();
  }, [fetchPatients, toast]);
  
  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      <PatientHeader 
        canEdit={canEdit}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        onAddPatient={handleAddPatient}
        selectedPatientIds={selectedPatientIds}
      />
      
      <PatientSearch 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />
      
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
          onRefresh={fetchPatients}
        />
      )}
    </div>
  );
}
