
import { useState } from "react";
import { Superbill, SuperbillStatus } from "@/types/superbill";
import { toast } from "@/components/ui/use-toast";
import { KanbanHeader } from "./kanban/KanbanHeader";
import { KanbanColumn } from "./kanban/KanbanColumn";
import { kanbanColumns } from "./kanban/kanbanConstants";
import { KanbanBoardProps } from "./kanban/types";
import { useSidebar } from "@/components/ui/sidebar";
import { useDragAndDrop } from "./kanban/hooks/useDragAndDrop";
import { useKanbanFiltering } from "./kanban/hooks/useKanbanFiltering";
import { useCardExpansion } from "./kanban/hooks/useCardExpansion";

export function KanbanBoard({
  superbills,
  searchTerm,
  onSearchChange,
  onDelete,
  onStatusChange,
  onSelectPatient,
  selectedPatientIds,
  selectionMode
}: KanbanBoardProps) {
  const { state: sidebarState } = useSidebar();
  const [isCompactView, setIsCompactView] = useState(true);
  
  // Custom hooks for kanban functionality
  const { 
    draggedBillId, 
    handleDragStart, 
    handleDragOver, 
    handleDragLeave, 
    handleDrop 
  } = useDragAndDrop(superbills, onStatusChange);
  
  const {
    statusFilter,
    sortOrder,
    filteredSuperbills,
    handleFilterChange,
    handleSortChange
  } = useKanbanFiltering(superbills, searchTerm);
  
  const {
    expandedCardIds,
    handleToggleCardExpand,
    handleViewModeToggle
  } = useCardExpansion(filteredSuperbills, isCompactView, setIsCompactView);

  return (
    <div className="space-y-6 w-full">
      <KanbanHeader 
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        selectionMode={selectionMode}
        selectedCount={selectedPatientIds?.length}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        currentFilter={statusFilter}
        currentSort={sortOrder}
        isCompactView={isCompactView}
        onViewModeToggle={handleViewModeToggle}
      />

      <div className={`overflow-x-auto pb-4 snap-x snap-mandatory ${sidebarState === "collapsed" ? "pr-0" : "pr-2"}`}>
        <div className="grid grid-flow-col auto-cols-min md:auto-cols-fr gap-3 md:gap-4 min-w-full">
          {kanbanColumns.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              superbills={filteredSuperbills.filter(bill => bill.status === column.id)}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              allColumns={kanbanColumns}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              handleDragStart={handleDragStart}
              onSelectPatient={onSelectPatient}
              selectedPatientIds={selectedPatientIds}
              sidebarState={sidebarState}
              expandedCardIds={expandedCardIds}
              onToggleCardExpand={handleToggleCardExpand}
              isCompactView={isCompactView}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
