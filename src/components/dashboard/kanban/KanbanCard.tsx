
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { KanbanCardProps } from "./types";
import { SuperbillCard } from "@/components/superbill-card/SuperbillCard";
import { SuperbillStatus } from "@/types/superbill";

export function KanbanCard({ 
  superbill, 
  onDelete, 
  onStatusChange, 
  onSelectPatient,
  isPatientSelected,
  onDragStart,
  availableStatuses = [],
  currentStatus,
  isCollapsed
}: KanbanCardProps) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Convert string to SuperbillStatus when needed
  const convertToSuperbillStatus = (status: string): SuperbillStatus => {
    if (status === 'draft' || status === 'in_progress' || status === 'in_review' || status === 'completed') {
      return status as SuperbillStatus;
    }
    return 'draft'; // Default fallback
  };
  
  return (
    <div 
      className="relative w-full mb-3"
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, superbill.id)}
    >
      <div className="cursor-grab active:cursor-grabbing">
        <SuperbillCard
          superbill={superbill}
          onDelete={onDelete}
          onClick={!onSelectPatient ? () => navigate(`/view/${superbill.id}`) : undefined}
          onSelectPatient={onSelectPatient ? (id, name, dob, selected) => {
            if (onSelectPatient) onSelectPatient(id, name, dob, selected);
          } : undefined}
          isPatientSelected={isPatientSelected}
          onStatusChange={onStatusChange}
          isCollapsed={isCollapsed}
        />
      </div>
      
      {/* Move actions - positioned below the card with spacing */}
      {availableStatuses && availableStatuses.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1 justify-end">
          {availableStatuses
            .filter(targetColumn => targetColumn.id !== currentStatus)
            .map(targetColumn => (
              <Button 
                key={targetColumn.id}
                variant="ghost" 
                size="sm"
                onClick={() => onStatusChange(superbill.id, convertToSuperbillStatus(targetColumn.id))}
                className={`text-xs py-0 h-7 hover:bg-muted ${isCollapsed ? "w-full" : "w-full sm:w-auto"}`}
              >
                <targetColumn.icon className="h-3 w-3 mr-1 shrink-0" />
                <span className="whitespace-normal text-left">Move to {targetColumn.title}</span>
              </Button>
            ))
          }
        </div>
      )}
    </div>
  );
}
