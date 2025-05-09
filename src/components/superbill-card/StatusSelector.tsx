
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SuperbillStatus } from "@/types/superbill";
import { StatusSelectorProps } from "./types";
import { statusToDisplay } from "@/lib/utils/visit-utils";

export function StatusSelector({ currentStatus, onStatusChange }: StatusSelectorProps) {
  const statuses: SuperbillStatus[] = ['draft', 'in_progress', 'in_review', 'completed'];

  return (
    <Select 
      value={currentStatus} 
      onValueChange={(value) => onStatusChange(value as SuperbillStatus)}
      // Stop propagation to prevent card onClick from triggering
      onOpenChange={(open) => {
        if (open) {
          // Prevent the event from bubbling up when opening the select
          document.addEventListener('click', (e) => e.stopPropagation(), { once: true });
        }
      }}
    >
      <SelectTrigger 
        className="h-7 w-[110px] text-xs bg-muted/30 hover:bg-muted"
        onClick={(e) => e.stopPropagation()}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statuses.map(status => (
          <SelectItem key={status} value={status}>
            {statusToDisplay(status)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
