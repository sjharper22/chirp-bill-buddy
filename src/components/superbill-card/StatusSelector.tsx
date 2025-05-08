
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SuperbillStatus } from "@/types/superbill";
import { getStatusVariant, statusToDisplay } from "@/lib/utils/visit-utils";

interface StatusSelectorProps {
  currentStatus: SuperbillStatus;
  onStatusChange: (status: SuperbillStatus) => void;
  className?: string;
}

export function StatusSelector({ currentStatus, onStatusChange, className = "" }: StatusSelectorProps) {
  const statuses: SuperbillStatus[] = ['draft', 'in_progress', 'in_review', 'completed'];
  
  return (
    <Select
      value={currentStatus}
      onValueChange={(value) => onStatusChange(value as SuperbillStatus)}
    >
      <SelectTrigger className={`h-8 w-[140px] ${className}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => {
          // Define color variables for status indicators
          const statusColor = 
            status === 'completed' ? '#10b981' : // Green for Completed
            status === 'in_review' ? '#8b5cf6' : // Purple for In Review
            status === 'in_progress' ? '#f59e0b' : // Amber for In Progress
            '#3b82f6'; // Blue for Draft
          
          return (
            <SelectItem key={status} value={status}>
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: statusColor }}
                />
                <span>
                  {status === 'draft' ? 'Draft' : 
                   status === 'in_progress' ? 'In Progress' : 
                   status === 'in_review' ? 'In Review' : 
                   'Completed'}
                </span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
