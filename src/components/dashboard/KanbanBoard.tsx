import { useState } from "react";
import { Superbill, SuperbillStatus } from "@/types/superbill";
import { toast } from "@/components/ui/use-toast";
import { KanbanHeader } from "./kanban/KanbanHeader";
import { KanbanColumn } from "./kanban/KanbanColumn";
import { kanbanColumns } from "./kanban/kanbanConstants";
import { KanbanBoardProps } from "./kanban/types";
import { useSidebar } from "@/components/ui/sidebar";

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
  const [draggedBillId, setDraggedBillId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<SuperbillStatus | "all">("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expandedCardIds, setExpandedCardIds] = useState<string[]>([]);
  const [isCompactView, setIsCompactView] = useState(true);
  const { state: sidebarState } = useSidebar();

  // Filter superbills based on search term and status filter
  const filteredSuperbills = superbills
    .filter(bill => 
      bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(bill => statusFilter === "all" ? true : bill.status === statusFilter)
    .sort((a, b) => {
      const dateA = a.issueDate ? new Date(a.issueDate).getTime() : 0;
      const dateB = b.issueDate ? new Date(b.issueDate).getTime() : 0;
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  // Start dragging a superbill
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedBillId(id);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  // Handle drag over column to allow drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget) {
      e.currentTarget.classList.add('bg-muted/50');
    }
  };

  // Handle drag leave to remove highlighting
  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget) {
      e.currentTarget.classList.remove('bg-muted/50');
    }
  };

  // Handle drop of superbill in a column
  const handleDrop = (e: React.DragEvent, newStatus: SuperbillStatus) => {
    e.preventDefault();
    
    if (e.currentTarget) {
      e.currentTarget.classList.remove('bg-muted/50');
    }
    
    if (draggedBillId) {
      const bill = superbills.find(b => b.id === draggedBillId);
      if (bill && bill.status !== newStatus) {
        onStatusChange(draggedBillId, newStatus);
        toast({
          title: "Status updated",
          description: `Superbill for ${bill.patientName} moved to ${newStatus.replace('_', ' ')}.`,
        });
      }
      setDraggedBillId(null);
    }
  };

  const handleFilterChange = (status: SuperbillStatus | "all") => {
    setStatusFilter(status);
  };

  const handleSortChange = (order: "asc" | "desc") => {
    setSortOrder(order);
  };

  // Toggle individual card expansion
  const handleToggleCardExpand = (id: string) => {
    setExpandedCardIds(prevIds => {
      if (prevIds.includes(id)) {
        return prevIds.filter(cardId => cardId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  // Toggle global compact view
  const handleViewModeToggle = () => {
    const allIds = filteredSuperbills.map(bill => bill.id);
    
    if (isCompactView) {
      // Expand all cards
      setExpandedCardIds(allIds);
    } else {
      // Collapse all cards
      setExpandedCardIds([]);
    }
    
    setIsCompactView(!isCompactView);
    
    toast({
      description: isCompactView ? "Expanded all cards" : "Collapsed all cards",
      duration: 2000,
    });
  };

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
