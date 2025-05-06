
import { formatDate } from "@/lib/utils/superbill-utils";
import { GripHorizontal } from "lucide-react";
import { StatusBadge } from "@/components/group-submission/table/StatusBadge";
import { CardHeaderProps } from "./types";
import { ReactNode, useState } from "react";
import { SuperbillStatus } from "@/types/superbill";
import { StatusSelector } from "./StatusSelector";

export function CardHeader({ 
  patientName, 
  issueDate, 
  status, 
  statusVariant, 
  onStatusChange 
}: CardHeaderProps) {
  // Enhanced color handling for status badges
  let statusColor;
  switch(status.toLowerCase()) {
    case 'in_review':
      statusColor = 'purple'; // Changed: Make In Review purple
      break;
    case 'in_progress':
      statusColor = 'amber'; // Changed: Keep In Progress amber/yellow
      break;
    default:
      statusColor = '';
  }

  return (
    <>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <GripHorizontal className="h-4 w-4 mr-2 text-muted-foreground drag-handle" />
          <h3 className="font-semibold text-lg truncate max-w-[180px]">{patientName}</h3>
        </div>
        <div className="text-sm bg-primary/10 text-primary font-medium px-2 py-0.5 rounded">
          {formatDate(issueDate)}
        </div>
      </div>
      
      <div className="mb-2 flex items-center justify-between">
        <StatusBadge 
          status={status} 
          variant={statusVariant}
          className={statusColor ? `bg-${statusColor}-100 text-${statusColor}-800 border-${statusColor}-200` : ''}
        />
        {onStatusChange && (
          <StatusSelector
            currentStatus={status as SuperbillStatus}
            onStatusChange={(newStatus) => {
              if (typeof onStatusChange === 'function') {
                onStatusChange(newStatus);
              }
            }}
          />
        )}
      </div>
    </>
  );
}
