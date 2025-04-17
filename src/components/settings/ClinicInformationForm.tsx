
import { ClinicDefaults } from "@/types/superbill";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ClinicInformationFormProps {
  formState: ClinicDefaults;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ClinicInformationForm({ formState, onInputChange }: ClinicInformationFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clinic Information</CardTitle>
        <CardDescription>
          These details will be pre-filled on all new superbills
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clinicName">Clinic Name</Label>
            <Input
              id="clinicName"
              value={formState.clinicName}
              onChange={onInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="providerName">Provider Name</Label>
            <Input
              id="providerName"
              value={formState.providerName}
              onChange={onInputChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="clinicAddress">Clinic Address</Label>
          <Input
            id="clinicAddress"
            value={formState.clinicAddress}
            onChange={onInputChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clinicPhone">Clinic Phone</Label>
            <Input
              id="clinicPhone"
              value={formState.clinicPhone}
              onChange={onInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clinicEmail">Clinic Email</Label>
            <Input
              id="clinicEmail"
              value={formState.clinicEmail}
              onChange={onInputChange}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ein">EIN (Tax ID)</Label>
            <Input
              id="ein"
              value={formState.ein}
              onChange={onInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="npi">Provider NPI #</Label>
            <Input
              id="npi"
              value={formState.npi}
              onChange={onInputChange}
            />
            <p className="text-xs text-muted-foreground">
              National Provider Identifier specific to the provider (e.g., Dr. Smith - NPI# 1234567890)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
