
import { PatientProfile } from "@/types/patient";
import { VisitManagementHeader } from "./components/VisitManagementHeader";
import { VisitEmptyState } from "./components/VisitEmptyState";
import { VisitList } from "./components/VisitList";
import { VisitDialogs } from "./components/VisitDialogs";
import { useVisitManagement } from "./hooks/useVisitManagement";

interface VisitManagementProps {
  patient: PatientProfile;
}

export function VisitManagement({ patient }: VisitManagementProps) {
  const {
    visits,
    loading,
    isCreateDialogOpen,
    isEditDialogOpen,
    selectedVisit,
    setIsCreateDialogOpen,
    handleCreateVisit,
    handleEditVisit,
    handleUpdateVisit,
    handleDeleteVisit,
    handleCreateDialogClose,
    handleEditDialogClose,
  } = useVisitManagement(patient);

  if (loading) {
    return <div className="text-center py-8">Loading visits...</div>;
  }

  return (
    <div className="space-y-6">
      <VisitManagementHeader 
        patient={patient} 
        onAddVisit={() => setIsCreateDialogOpen(true)} 
      />

      {visits.length === 0 ? (
        <VisitEmptyState 
          patient={patient} 
          onAddVisit={() => setIsCreateDialogOpen(true)} 
        />
      ) : (
        <VisitList
          visits={visits}
          onEditVisit={handleEditVisit}
          onDeleteVisit={handleDeleteVisit}
        />
      )}

      <VisitDialogs
        patient={patient}
        isCreateDialogOpen={isCreateDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        selectedVisit={selectedVisit}
        onCreateDialogClose={handleCreateDialogClose}
        onEditDialogClose={handleEditDialogClose}
        onCreateVisit={handleCreateVisit}
        onUpdateVisit={handleUpdateVisit}
      />
    </div>
  );
}
