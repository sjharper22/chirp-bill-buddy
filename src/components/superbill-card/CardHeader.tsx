
import { formatDate } from "@/lib/utils/superbill-utils";
import { GripHorizontal } from "lucide-react";
import { StatusBadge } from "@/components/group-submission/table/StatusBadge";
import { CardHeaderProps } from "./types";
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
      statusColor = 'purple'; // In Review is purple
      break;
    case 'in_progress':
      statusColor = 'amber'; // In Progress is amber/yellow
      break;
    case 'completed':
      statusColor = 'green'; // Completed is green
      break;
    case 'draft':
    default:
      statusColor = 'blue'; // Draft is blue
  }

  // Convert display status back to SuperbillStatus format
  const getSuperbillStatus = (displayStatus: string): SuperbillStatus => {
    const normalizedStatus = displayStatus.toLowerCase();
    
    if (normalizedStatus.includes('progress')) return 'in_progress';
    if (normalizedStatus.includes('review')) return 'in_review';
    if (normalizedStatus.includes('complet')) return 'completed';
    return 'draft';
  };

  const currentStatus = getSuperbillStatus(status);
  
  const handleStatusChange = (newStatus: SuperbillStatus) => {
    if (onStatusChange) {
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
        {onStatusChange ? (
          <div onClick={(e) => e.stopPropagation()}>
            <StatusSelector 
              currentStatus={currentStatus}
              onStatusChange={handleStatusChange}
            />
          </div>
        ) : (
          <StatusBadge 
            status={status} 
            variant={statusVariant}
            className={statusColor ? `bg-${statusColor}-100 text-${statusColor}-800 border-${statusColor}-200` : ''}
          />
        )}
      </div>
    </>
  );
}
