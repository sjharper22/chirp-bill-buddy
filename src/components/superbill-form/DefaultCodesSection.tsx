
import { Superbill } from "@/types/superbill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MultiTagInput } from "@/components/MultiTagInput";
import { commonICD10Codes, commonCPTCodes } from "@/lib/utils/superbill-utils";

interface DefaultCodesSectionProps {
  superbill: Omit<Superbill, "id" | "createdAt" | "updatedAt">;
  updateField: <K extends keyof Omit<Superbill, "id" | "createdAt" | "updatedAt">>(
    field: K,
    value: Omit<Superbill, "id" | "createdAt" | "updatedAt">[K]
  ) => void;
  commonMainComplaints: { value: string; label: string }[];
  updateVisitsWithDefaults: () => void;
}

export function DefaultCodesSection({ 
  superbill, 
  updateField, 
  commonMainComplaints,
  updateVisitsWithDefaults 
}: DefaultCodesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Default Code Settings</CardTitle>
        <CardDescription>
          Set default codes and fees for new visits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="defaultIcdCodes">Default ICD-10 Codes</Label>
          <MultiTagInput
            placeholder="Add ICD-10 Codes"
            tags={superbill.defaultIcdCodes}
            onChange={codes => updateField("defaultIcdCodes", codes)}
            suggestions={commonICD10Codes}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="defaultCptCodes">Default CPT Codes</Label>
          <MultiTagInput
            placeholder="Add CPT Codes"
            tags={superbill.defaultCptCodes}
            onChange={codes => updateField("defaultCptCodes", codes)}
            suggestions={commonCPTCodes}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="defaultMainComplaints">Default Main Complaints</Label>
          <MultiTagInput
            placeholder="Add Main Complaints"
            tags={superbill.defaultMainComplaints || []}
            onChange={complaints => updateField("defaultMainComplaints", complaints)}
            suggestions={commonMainComplaints}
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
              value={superbill.defaultFee || ""}
              onChange={e => updateField("defaultFee", parseFloat(e.target.value) || 0)}
              className="max-w-xs"
            />
            
            {superbill.visits.length > 0 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={updateVisitsWithDefaults}
              >
                Apply to All Visits
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
