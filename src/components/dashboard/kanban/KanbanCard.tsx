
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { KanbanCardProps } from "./types";
import { SuperbillCard } from "@/components/superbill-card/SuperbillCard";

export function KanbanCard({ 
  superbill, 
  onDelete, 
  onDragStart, 
  onStatusChange, 
  availableStatuses, 
  currentStatus 
}: KanbanCardProps) {
  const navigate = useNavigate();
  
  return (
    <div 
      className="relative"
      draggable
      onDragStart={(e) => onDragStart(e, superbill.id)}
    >
      <div className="cursor-grab active:cursor-grabbing">
        <SuperbillCard
          superbill={superbill}
          onDelete={onDelete}
          onClick={() => navigate(`/view/${superbill.id}`)}
        />
      </div>
      
      {/* Move actions - positioned below the card with spacing */}
      <div className="mt-2 flex flex-wrap gap-1 justify-end">
        {availableStatuses
          .filter(targetColumn => targetColumn.id !== currentStatus)
          .map(targetColumn => (
            <Button 
              key={targetColumn.id}
              variant="ghost" 
              size="sm"
              onClick={() => onStatusChange(superbill.id, targetColumn.id)}
              className="text-xs py-0 h-7 hover:bg-muted"
            >
              <targetColumn.icon className="h-3 w-3 mr-1" />
              Move to {targetColumn.title}
            </Button>
          ))
        }
      </div>
    </div>
  );
}
