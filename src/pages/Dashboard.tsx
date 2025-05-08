
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { useDashboard } from "@/hooks/useDashboard";

export default function Dashboard() {
  const {
    superbills,
    patients,
    searchTerm,
    setSearchTerm,
    selectionMode,
    selectedPatientIds,
    totalVisits,
    totalBilled,
    averageFee,
    handleDeleteSuperbill,
    handleStatusChange,
    handleToggleSelectionMode,
    handleSelectPatient,
    handleAddSelectedToPatients
  } = useDashboard();
  
  return (
    <div className="space-y-6 w-full">
      <DashboardHeader
        selectionMode={selectionMode}
        selectedPatientIds={selectedPatientIds}
        handleToggleSelectionMode={handleToggleSelectionMode}
        handleAddSelectedToPatients={handleAddSelectedToPatients}
      />
      
      <DashboardStats 
        totalPatients={patients.length}
        totalVisits={totalVisits}
        totalBilled={totalBilled}
        averageFee={averageFee}
      />
      
      <DashboardTabs
        superbills={superbills}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onDelete={handleDeleteSuperbill}
        onStatusChange={handleStatusChange}
        selectionMode={selectionMode}
        selectedPatientIds={selectedPatientIds}
        handleToggleSelectionMode={handleToggleSelectionMode}
        handleSelectPatient={handleSelectPatient}
        handleAddSelectedToPatients={handleAddSelectedToPatients}
      />
    </div>
  );
}
