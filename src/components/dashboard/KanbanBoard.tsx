
import { useState } from "react";
import { Superbill, SuperbillStatus } from "@/types/superbill";
import { toast } from "@/components/ui/use-toast";
import { KanbanHeader } from "./kanban/KanbanHeader";
import { KanbanColumn } from "./kanban/KanbanColumn";
import { kanbanColumns } from "./kanban/kanbanConstants";
import { KanbanBoardProps } from "./kanban/types";

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

  // Filter superbills based on search term
  const filteredSuperbills = superbills.filter(bill => 
    bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="space-y-6">
      <KanbanHeader 
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        selectionMode={selectionMode}
        selectedCount={selectedPatientIds?.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {kanbanColumns.map(column => {
          const columnSuperbills = filteredSuperbills.filter(bill => bill.status === column.id);
          
          return (
            <KanbanColumn
              key={column.id}
              column={column}
              superbills={columnSuperbills}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              allColumns={kanbanColumns}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              handleDragStart={handleDragStart}
              onSelectPatient={onSelectPatient}
              selectedPatientIds={selectedPatientIds}
            />
          );
        })}
      </div>
    </div>
  );
}
