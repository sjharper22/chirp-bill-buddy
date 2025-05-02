
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { KanbanCardProps } from "./types";
import { SuperbillCard } from "@/components/superbill-card/SuperbillCard";

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
  
  // Fix the handleSelectChange function to correctly call onSelectPatient with all required parameters
  const handleSelectChange = (checked: boolean) => {
    if (onSelectPatient) {
      onSelectPatient(superbill.id, superbill.patientName, superbill.patientDob, checked);
    }
  };
  
  return (
    <div 
      className="relative"
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, superbill.id)}
    >
      <div className="cursor-grab active:cursor-grabbing">
        <SuperbillCard
          superbill={superbill}
          onDelete={onDelete}
          onClick={!onSelectPatient ? () => navigate(`/view/${superbill.id}`) : undefined}
          onSelectPatient={handleSelectChange}
          isPatientSelected={isPatientSelected}
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
