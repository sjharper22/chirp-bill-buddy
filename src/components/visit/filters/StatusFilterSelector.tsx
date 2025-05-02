
import { SuperbillStatus } from "@/types/superbill";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface StatusFilterSelectorProps {
  selectedStatus: SuperbillStatus | "all";
  onStatusChange: (status: SuperbillStatus | "all") => void;
}

export function StatusFilterSelector({ selectedStatus, onStatusChange }: StatusFilterSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Status Filter</label>
      <RadioGroup 
        value={selectedStatus} 
        onValueChange={(value) => onStatusChange(value as SuperbillStatus | "all")}
        className="gap-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="all" />
          <Label htmlFor="all">All</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="draft" id="draft" />
          <Label htmlFor="draft">Draft</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="in_progress" id="in_progress" />
          <Label htmlFor="in_progress">In Progress</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="in_review" id="in_review" />
          <Label htmlFor="in_review">In Review</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="completed" id="completed" />
          <Label htmlFor="completed">Completed</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
