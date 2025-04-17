
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MultiTagInput } from "@/components/MultiTagInput";

interface GeneralSettingsSectionProps {
  defaultMainComplaints: string[];
  defaultFee: number;
  onMainComplaintsChange: (complaints: string[]) => void;
  onFeeChange: (fee: number) => void;
  onApplyToAllVisits: () => void;
  commonMainComplaints: { value: string; label: string }[];
  hasVisits: boolean;
}

export function GeneralSettingsSection({
  defaultMainComplaints,
  defaultFee,
  onMainComplaintsChange,
  onFeeChange,
  onApplyToAllVisits,
  commonMainComplaints,
  hasVisits
}: GeneralSettingsSectionProps) {
  // Prevent form submission when interacting with main complaints
  const preventFormSubmission = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <div className="space-y-6" onClick={preventFormSubmission}>
      <div className="space-y-2">
        <Label htmlFor="defaultMainComplaints">Default Main Complaints</Label>
        <MultiTagInput
          placeholder="Add Main Complaints"
          tags={defaultMainComplaints || []}
          onChange={onMainComplaintsChange}
          suggestions={commonMainComplaints}
          preventFormSubmission={true}
        />
        <p className="text-xs text-muted-foreground">
          Common complaints/reasons that will be available for selection in visits
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="defaultFee">Default Fee per Visit ($)</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="defaultFee"
            type="number"
            min="0"
            step="0.01"
            value={defaultFee || ""}
            onChange={e => onFeeChange(parseFloat(e.target.value) || 0)}
            className="max-w-xs"
          />
          
          {hasVisits && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={(e) => {
                e.preventDefault();
                onApplyToAllVisits();
              }}
            >
              Apply to All Visits
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
