
import { useState } from "react";
import { Superbill, SuperbillStatus } from "@/types/superbill";
import { toast } from "@/components/ui/use-toast";

export function useDragAndDrop(
  superbills: Superbill[], 
  onStatusChange: (id: string, newStatus: SuperbillStatus) => void
) {
  const [draggedBillId, setDraggedBillId] = useState<string | null>(null);

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

  return {
    draggedBillId,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
}
