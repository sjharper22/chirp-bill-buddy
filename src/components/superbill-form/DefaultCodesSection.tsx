
import { Superbill } from "@/types/superbill";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IcdCodesSection } from "./default-codes/IcdCodesSection";
import { CptCodesSection } from "./default-codes/CptCodesSection";
import { GeneralSettingsSection } from "./default-codes/GeneralSettingsSection";

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
      <CardContent className="space-y-6">
        <IcdCodesSection 
          defaultIcdCodes={superbill.defaultIcdCodes}
          onCodesChange={codes => updateField("defaultIcdCodes", codes)}
        />
        
        <CptCodesSection 
          defaultCptCodes={superbill.defaultCptCodes}
          onCodesChange={codes => updateField("defaultCptCodes", codes)}
        />
        
        <GeneralSettingsSection 
          defaultMainComplaints={superbill.defaultMainComplaints}
          defaultFee={superbill.defaultFee}
          onMainComplaintsChange={complaints => updateField("defaultMainComplaints", complaints)}
          onFeeChange={fee => updateField("defaultFee", fee)}
          onApplyToAllVisits={updateVisitsWithDefaults}
          commonMainComplaints={commonMainComplaints}
          hasVisits={superbill.visits.length > 0}
        />
      </CardContent>
    </Card>
  );
}
