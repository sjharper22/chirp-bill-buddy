
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

  // Convert issueDate to proper Date if it's a string
  const formattedDate = typeof issueDate === 'string' ? formatDate(new Date(issueDate)) : formatDate(issueDate);

  // Convert statusVariant to match the expected type (change "danger" to "error" if needed)
  const convertedStatusVariant = statusVariant === "danger" ? "error" : statusVariant;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 items-start justify-between">
        <div className="flex items-center gap-2">
          <GripHorizontal className="h-4 w-4 text-muted-foreground drag-handle shrink-0" />
          <h3 className="font-semibold text-lg break-words hyphens-auto">{patientName}</h3>
        </div>
        <div className="text-sm bg-primary/10 text-primary font-medium px-2 py-0.5 rounded whitespace-nowrap">
          {formattedDate}
        </div>
      </div>
      
      <div className="flex flex-wrap items-start gap-2">
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
            variant={convertedStatusVariant}
            className="w-fit"
          />
        )}
      </div>
    </div>
  );
}
