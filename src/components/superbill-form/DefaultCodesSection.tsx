
import { Superbill } from "@/types/superbill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  const handleIcdCodeToggle = (code: string) => {
    const currentCodes = superbill.defaultIcdCodes;
    const newCodes = currentCodes.includes(code)
      ? currentCodes.filter(c => c !== code)
      : [...currentCodes, code];
    updateField("defaultIcdCodes", newCodes);
  };

  const handleCptCodeToggle = (code: string) => {
    const currentCodes = superbill.defaultCptCodes;
    const newCodes = currentCodes.includes(code)
      ? currentCodes.filter(c => c !== code)
      : [...currentCodes, code];
    updateField("defaultCptCodes", newCodes);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Default Code Settings</CardTitle>
        <CardDescription>
          Set default codes and fees for new visits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Default ICD-10 Codes</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {commonICD10Codes.map((code) => (
              <div key={code.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`icd-${code.value}`}
                  checked={superbill.defaultIcdCodes.includes(code.value)}
                  onCheckedChange={() => handleIcdCodeToggle(code.value)}
                />
                <label
                  htmlFor={`icd-${code.value}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {code.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <Label>Default CPT Codes</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {commonCPTCodes.map((code) => (
              <div key={code.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`cpt-${code.value}`}
                  checked={superbill.defaultCptCodes.includes(code.value)}
                  onCheckedChange={() => handleCptCodeToggle(code.value)}
                />
                <label
                  htmlFor={`cpt-${code.value}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {code.label}
                </label>
              </div>
            ))}
          </div>
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
