
import { Label } from "@/components/ui/label";
import { MultiTagInput } from "@/components/MultiTagInput";
import { commonCPTCodes } from "@/lib/utils/superbill-utils";

interface CptCodesSectionProps {
  defaultCptCodes: string[];
  onChange: (codes: string[]) => void;
}

export function CptCodesSection({ defaultCptCodes, onChange }: CptCodesSectionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="defaultCptCodes">Default CPT Codes</Label>
      <MultiTagInput
        placeholder="Add CPT Codes"
        tags={defaultCptCodes}
        onChange={onChange}
        suggestions={commonCPTCodes}
        preventFormSubmission={true}
      />
      <p className="text-xs text-muted-foreground mt-1">
        These codes will be automatically added to new visits
      </p>
    </div>
  );
}
