
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SuperbillStatus } from "@/types/superbill";
import { getStatusVariant, statusToDisplay } from "@/lib/utils/visit-utils";

interface StatusSelectorProps {
  currentStatus: SuperbillStatus;
  onStatusChange: (status: SuperbillStatus) => void;
}

export function StatusSelector({ currentStatus, onStatusChange }: StatusSelectorProps) {
  const statuses: SuperbillStatus[] = ['draft', 'in_progress', 'in_review', 'completed'];
  
  return (
    <Select
      value={currentStatus}
      onValueChange={(value) => onStatusChange(value as SuperbillStatus)}
    >
      <SelectTrigger className="h-7 w-[130px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => (
          <SelectItem key={status} value={status}>
            <div className="flex items-center gap-2">
              <div 
                className={`w-2 h-2 rounded-full bg-${getStatusVariant(status)}`}
                style={{ 
                  backgroundColor: status === 'in_review' ? '#8b5cf6' : // Purple for In Review
                                   status === 'in_progress' ? '#f59e0b' : // Amber for In Progress
                                   status === 'completed' ? '#10b981' : // Green for Completed
                                   '#6b7280' // Gray for Draft
                }}
              />
              <span>{statusToDisplay(status)}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
