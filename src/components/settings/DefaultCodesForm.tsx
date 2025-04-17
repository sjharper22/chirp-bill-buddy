
import { ClinicDefaults } from "@/types/superbill";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { IcdCodesSection } from "./codes/IcdCodesSection";
import { CptCodesSection } from "./codes/CptCodesSection";
import { ComplaintsSection } from "./codes/ComplaintsSection";

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
        <IcdCodesSection
          defaultIcdCodes={formState.defaultIcdCodes}
          onChange={codes => onDefaultCodesChange('defaultIcdCodes', codes)}
        />
        
        <CptCodesSection
          defaultCptCodes={formState.defaultCptCodes}
          onChange={codes => onDefaultCodesChange('defaultCptCodes', codes)}
        />
        
        <ComplaintsSection
          defaultMainComplaints={formState.defaultMainComplaints}
          defaultFee={formState.defaultFee}
          onComplaintsChange={complaints => onDefaultCodesChange('defaultMainComplaints', complaints)}
          onFeeChange={onInputChange}
        />
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
