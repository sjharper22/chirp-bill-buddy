
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { KanbanCardProps } from "./types";
import { SuperbillCard } from "@/components/superbill-card/SuperbillCard";
import { useState } from "react";

export function KanbanCard({ 
  superbill, 
  onDelete, 
  onDragStart, 
  onStatusChange, 
  availableStatuses, 
  currentStatus,
  onSelectPatient,
  isPatientSelected
}: KanbanCardProps) {
  const navigate = useNavigate();
  
  const handleSelectChange = (checked: boolean) => {
    if (onSelectPatient) {
      onSelectPatient(superbill.id, superbill.patientName, superbill.patientDob, checked);
    }
  };
  
  return (
    <div 
      className="relative"
      draggable
      onDragStart={(e) => onDragStart(e, superbill.id)}
    >
      {onSelectPatient && (
        <div className="absolute top-2 left-2 z-10">
          <Checkbox 
            checked={isPatientSelected}
            onCheckedChange={handleSelectChange}
            onClick={(e) => e.stopPropagation()}
            className="bg-white"
          />
        </div>
      )}
      
      <div className="cursor-grab active:cursor-grabbing">
        <SuperbillCard
          superbill={superbill}
          onDelete={onDelete}
          onClick={() => navigate(`/view/${superbill.id}`)}
          onSelectPatient={onSelectPatient}
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
