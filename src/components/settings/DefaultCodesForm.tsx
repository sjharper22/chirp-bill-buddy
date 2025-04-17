
import { ClinicDefaults } from "@/types/superbill";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MultiTagInput } from "@/components/MultiTagInput";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { commonICD10Codes, commonCPTCodes } from "@/lib/utils/superbill-utils";
import { commonMainComplaints } from "@/constants/superbill-constants";

interface DefaultCodesFormProps {
  formState: ClinicDefaults;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDefaultCodesChange: (field: keyof Pick<ClinicDefaults, 'defaultIcdCodes' | 'defaultCptCodes' | 'defaultMainComplaints'>, codes: string[]) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function DefaultCodesForm({ 
  formState, 
  onInputChange, 
  onDefaultCodesChange,
  onSubmit 
}: DefaultCodesFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Default Code Settings</CardTitle>
        <CardDescription>
          These codes will be pre-filled on all new visits
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="defaultIcdCodes">Default ICD-10 Codes</Label>
          <MultiTagInput
            placeholder="Add ICD-10 Codes"
            tags={formState.defaultIcdCodes}
            onChange={codes => onDefaultCodesChange('defaultIcdCodes', codes)}
            suggestions={commonICD10Codes}
          />
          <p className="text-xs text-muted-foreground mt-1">
            These codes will be automatically added to new visits
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="defaultCptCodes">Default CPT Codes</Label>
          <MultiTagInput
            placeholder="Add CPT Codes"
            tags={formState.defaultCptCodes}
            onChange={codes => onDefaultCodesChange('defaultCptCodes', codes)}
            suggestions={commonCPTCodes}
          />
          <p className="text-xs text-muted-foreground mt-1">
            These codes will be automatically added to new visits
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="defaultMainComplaints">Default Main Complaints/Reasons for Visit</Label>
          <MultiTagInput
            placeholder="Add Common Complaints"
            tags={formState.defaultMainComplaints}
            onChange={complaints => onDefaultCodesChange('defaultMainComplaints', complaints)}
            suggestions={commonMainComplaints}
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
            value={formState.defaultFee || ""}
            onChange={onInputChange}
            className="max-w-xs"
          />
          <p className="text-xs text-muted-foreground mt-1">
            This fee will be pre-filled for all new visits
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-6">
        <Button type="submit" onClick={onSubmit}>
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  );
}
