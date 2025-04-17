
import { Superbill } from "@/types/superbill";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ClinicInfoSectionProps {
  superbill: Omit<Superbill, "id" | "createdAt" | "updatedAt">;
  updateField: <K extends keyof Omit<Superbill, "id" | "createdAt" | "updatedAt">>(
    field: K,
    value: Omit<Superbill, "id" | "createdAt" | "updatedAt">[K]
  ) => void;
}

export function ClinicInfoSection({ superbill, updateField }: ClinicInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clinic & Provider Information</CardTitle>
        <CardDescription>Verify the clinic details for this superbill</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clinicName">Clinic Name</Label>
            <Input
              id="clinicName"
              value={superbill.clinicName}
              onChange={e => updateField("clinicName", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="providerName">Provider Name</Label>
            <Input
              id="providerName"
              value={superbill.providerName}
              onChange={e => updateField("providerName", e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="clinicAddress">Clinic Address</Label>
          <Input
            id="clinicAddress"
            value={superbill.clinicAddress}
            onChange={e => updateField("clinicAddress", e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clinicPhone">Clinic Phone</Label>
            <Input
              id="clinicPhone"
              value={superbill.clinicPhone}
              onChange={e => updateField("clinicPhone", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clinicEmail">Clinic Email</Label>
            <Input
              id="clinicEmail"
              value={superbill.clinicEmail}
              onChange={e => updateField("clinicEmail", e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ein">EIN (Tax ID)</Label>
            <Input
              id="ein"
              value={superbill.ein}
              onChange={e => updateField("ein", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="npi">Provider NPI #</Label>
            <Input
              id="npi"
              value={superbill.npi}
              onChange={e => updateField("npi", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              National Provider Identifier specific to the provider
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
