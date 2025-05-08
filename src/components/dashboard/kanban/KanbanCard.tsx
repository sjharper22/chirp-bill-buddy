
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { KanbanCardProps } from "./types";
import { SuperbillCard } from "@/components/superbill-card/SuperbillCard";
import { calculateTotalFee } from "@/lib/utils/superbill-utils";

export function KanbanCard({ 
  superbill, 
  onDelete, 
  onStatusChange, 
  onSelectPatient,
  isPatientSelected,
  onDragStart,
  availableStatuses = [],
  currentStatus
}: KanbanCardProps) {
  const navigate = useNavigate();
  const totalFee = calculateTotalFee(superbill.visits);
  
  return (
    <div 
      className="relative mb-3 w-full"
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, superbill.id)}
    >
      <div className="cursor-grab active:cursor-grabbing">
        <SuperbillCard
          superbill={superbill}
          onDelete={onDelete}
          onClick={!onSelectPatient ? () => navigate(`/view/${superbill.id}`) : undefined}
          onSelectPatient={onSelectPatient}
          isPatientSelected={isPatientSelected}
          onStatusChange={onStatusChange}
        />
      </div>
      
      {/* Move actions - positioned below the card with spacing */}
      {availableStatuses.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1 justify-end">
          {availableStatuses
            .filter(targetColumn => targetColumn.id !== currentStatus)
            .map(targetColumn => (
              <Button 
                key={targetColumn.id}
                variant="ghost" 
                size="sm"
                onClick={() => onStatusChange(superbill.id, targetColumn.id)}
                className="text-xs py-0 h-6 hover:bg-muted"
              >
                <targetColumn.icon className="h-3 w-3 mr-1 shrink-0" />
                <span className="truncate max-w-[80px]">Move to {targetColumn.title}</span>
              </Button>
            ))
          }
        </div>
      )}
    </div>
  );
}
