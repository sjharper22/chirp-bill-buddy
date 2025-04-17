
import { Label } from "@/components/ui/label";
import { MultiTagInput } from "@/components/MultiTagInput";
import { commonMainComplaints } from "@/constants/superbill-constants";
import { Input } from "@/components/ui/input";

interface ComplaintsSectionProps {
  defaultMainComplaints: string[];
  defaultFee: number;
  onComplaintsChange: (complaints: string[]) => void;
  onFeeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ComplaintsSection({ 
  defaultMainComplaints, 
  defaultFee,
  onComplaintsChange,
  onFeeChange
}: ComplaintsSectionProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="defaultMainComplaints">Default Main Complaints/Reasons for Visit</Label>
        <MultiTagInput
          placeholder="Add Common Complaints"
          tags={defaultMainComplaints}
          onChange={onComplaintsChange}
          suggestions={commonMainComplaints}
          preventFormSubmission={true}
        />
        <p className="text-xs text-muted-foreground mt-1">
          These complaints will be available to select for each visit
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="defaultFee">Default Fee per Visit ($)</Label>
        <Input
          id="defaultFee"
          type="number"
          min="0"
          step="0.01"
          value={defaultFee || ""}
          onChange={onFeeChange}
          className="max-w-xs"
        />
        <p className="text-xs text-muted-foreground mt-1">
          This fee will be pre-filled for all new visits
        </p>
      </div>
    </>
  );
}
