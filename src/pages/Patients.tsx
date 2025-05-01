
import { useNavigate } from "react-router-dom";
import { PatientList } from "@/components/patient/PatientList";
import { PatientHeader } from "@/components/patient/PatientHeader";
import { PatientSearch } from "@/components/patient/PatientSearch";
import { PatientEmptyState } from "@/components/patient/PatientEmptyState";
import { PatientLoading } from "@/components/patient/PatientLoading";
import { usePatientPage } from "@/hooks/usePatientPage";

export default function Patients() {
  const navigate = useNavigate();
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
    handleAddPatient,
    togglePatientSelection,
    selectAllPatients,
    clearPatientSelection
  } = usePatientPage();
  
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
        />
      )}
    </div>
  );
}
