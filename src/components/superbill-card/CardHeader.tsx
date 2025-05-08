
import { formatDate } from "@/lib/utils/superbill-utils";
import { GripHorizontal } from "lucide-react";
import { StatusBadge } from "@/components/group-submission/table/StatusBadge";
import { CardHeaderProps } from "./types";
import { SuperbillStatus } from "@/types/superbill";

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

  const handleStatusClick = (e: React.MouseEvent) => {
    // Stop the event from propagating up to the card's onClick handler
    e.stopPropagation();
    
    if (typeof onStatusChange === 'function') {
      // Cycle through statuses: draft -> in_progress -> in_review -> completed -> draft
      const currentStatus = status.toLowerCase();
      let newStatus: SuperbillStatus;
      
      switch (currentStatus) {
        case 'draft':
          newStatus = 'in_progress';
          break;
        case 'in_progress':
          newStatus = 'in_review';
          break;
        case 'in_review':
          newStatus = 'completed';
          break;
        case 'completed':
        default:
          newStatus = 'draft';
          break;
      }
      
      onStatusChange(newStatus);
    }
  };

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
      
      <div className="mb-2 flex items-center">
        <div 
          onClick={onStatusChange ? handleStatusClick : undefined}
          className={onStatusChange ? "cursor-pointer" : ""}
          title={onStatusChange ? "Click to change status" : undefined}
        >
          <StatusBadge 
            status={status} 
            variant={statusVariant}
            className={`${statusColor ? `bg-${statusColor}-100 text-${statusColor}-800 border-${statusColor}-200` : ''} ${onStatusChange ? 'hover:bg-opacity-80 transition-colors' : ''}`}
          />
        </div>
      </div>
    </>
  );
}
