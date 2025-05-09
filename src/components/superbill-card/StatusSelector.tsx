
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
  
  // Get background color class based on status
  const getStatusBackgroundClass = (status: SuperbillStatus): string => {
    switch(status) {
      case 'completed': 
        return 'bg-green-100';
      case 'in_review': 
        return 'bg-purple-100';
      case 'in_progress': 
        return 'bg-amber-100';
      case 'draft':
      default:
        return 'bg-blue-100';
    }
  };
  
  // Get text color class based on status
  const getStatusTextClass = (status: SuperbillStatus): string => {
    switch(status) {
      case 'completed': 
        return 'text-green-800';
      case 'in_review': 
        return 'text-purple-800';
      case 'in_progress': 
        return 'text-amber-800';
      case 'draft':
      default:
        return 'text-blue-800';
    }
  };
  
  // Get border color class based on status
  const getStatusBorderClass = (status: SuperbillStatus): string => {
    switch(status) {
      case 'completed': 
        return 'border-green-200';
      case 'in_review': 
        return 'border-purple-200';
      case 'in_progress': 
        return 'border-amber-200';
      case 'draft':
      default:
        return 'border-blue-200';
    }
  };
  
  const statusBackgroundClass = getStatusBackgroundClass(currentStatus);
  const statusTextClass = getStatusTextClass(currentStatus);
  const statusBorderClass = getStatusBorderClass(currentStatus);
  
  return (
    <Select
      value={currentStatus}
      onValueChange={(value) => onStatusChange(value as SuperbillStatus)}
    >
      <SelectTrigger 
        className={`h-8 w-[140px] ${statusBackgroundClass} ${statusTextClass} ${statusBorderClass} ${className}`}
      >
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
