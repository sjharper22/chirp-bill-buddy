
import { SuperbillCard } from "@/components/superbill-card/SuperbillCard";
import { Superbill, SuperbillStatus } from "@/types/superbill";
import { EmptyState } from "./EmptyState";
import { useNavigate } from "react-router-dom";

interface SuperbillsGridProps {
  displaySuperbills: Superbill[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: SuperbillStatus) => void;
  selectionMode: boolean;
  handleSelectPatient?: (id: string) => void;
  selectedPatientIds: string[];
  expandedCardIds: string[];
  handleToggleCardExpand: (id: string) => void;
  statusFilter: SuperbillStatus | "all";
}

export function SuperbillsGrid({
  displaySuperbills,
  onDelete,
  onStatusChange,
  selectionMode,
  handleSelectPatient,
  selectedPatientIds,
  expandedCardIds,
  handleToggleCardExpand,
  statusFilter
}: SuperbillsGridProps) {
  const navigate = useNavigate();

  if (displaySuperbills.length === 0) {
    return (
      <EmptyState 
        statusFilter={statusFilter} 
        navigateToNew={() => navigate("/new")} 
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displaySuperbills.map(superbill => (
        <SuperbillCard
          key={superbill.id}
          superbill={superbill}
          onDelete={onDelete}
          onClick={!selectionMode ? () => navigate(`/view/${superbill.id}`) : undefined}
          onSelectPatient={selectionMode ? handleSelectPatient : undefined}
          isPatientSelected={selectedPatientIds.includes(superbill.id)}
          onStatusChange={onStatusChange}
          isExpanded={expandedCardIds.includes(superbill.id)}
          onToggleExpand={handleToggleCardExpand}
        />
      ))}
    </div>
  );
}
