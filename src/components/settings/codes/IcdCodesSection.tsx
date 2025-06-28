
import { Label } from "@/components/ui/label";
import { MultiTagInput } from "@/components/MultiTagInput";
import { commonIcdCodes } from "@/lib/utils/superbill-utils";

interface IcdCodesSectionProps {
  defaultIcdCodes: string[];
  onChange: (codes: string[]) => void;
}

export function IcdCodesSection({ defaultIcdCodes, onChange }: IcdCodesSectionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="defaultIcdCodes">Default ICD-10 Codes</Label>
      <MultiTagInput
        placeholder="Add ICD-10 Codes"
        tags={defaultIcdCodes}
        onChange={onChange}
        suggestions={commonIcdCodes}
        preventFormSubmission={true}
      />
      <p className="text-xs text-muted-foreground mt-1">
        These codes will be automatically added to new visits
      </p>
    </div>
  );
}
