
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSuperbill } from "@/context/superbill-context";
import { MultiTagInput } from "@/components/MultiTagInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { commonICD10Codes, commonCPTCodes } from "@/lib/utils/superbill-utils";
import { useToast } from "@/hooks/use-toast";

// Common main complaints for chiropractic practice
const commonMainComplaints = [
  { value: "Back Pain", label: "Back Pain" },
  { value: "Neck Pain", label: "Neck Pain" },
  { value: "Headache", label: "Headache" },
  { value: "Shoulder Pain", label: "Shoulder Pain" },
  { value: "Knee Pain", label: "Knee Pain" },
  { value: "Hip Pain", label: "Hip Pain" },
  { value: "Sciatica", label: "Sciatica" },
  { value: "Muscle Spasm", label: "Muscle Spasm" },
  { value: "Joint Pain", label: "Joint Pain" },
  { value: "Numbness/Tingling", label: "Numbness/Tingling" },
  { value: "Maintenance/Wellness", label: "Maintenance/Wellness" }
];

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clinicDefaults, updateClinicDefaults } = useSuperbill();
  
  const [formState, setFormState] = useState({
    clinicName: clinicDefaults.clinicName,
    clinicAddress: clinicDefaults.clinicAddress,
    clinicPhone: clinicDefaults.clinicPhone,
    clinicEmail: clinicDefaults.clinicEmail,
    ein: clinicDefaults.ein,
    npi: clinicDefaults.npi,
    providerName: clinicDefaults.providerName,
    defaultIcdCodes: [...clinicDefaults.defaultIcdCodes],
    defaultCptCodes: [...clinicDefaults.defaultCptCodes],
    defaultMainComplaints: [...(clinicDefaults.defaultMainComplaints || [])],
    defaultFee: clinicDefaults.defaultFee
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateClinicDefaults(formState);
    
    toast({
      title: "Settings Saved",
      description: "Your default settings have been updated.",
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [id]: id === "defaultFee" ? parseFloat(value) || 0 : value
    }));
  };
  
  return (
    <div className="container max-w-screen-xl mx-auto py-8 px-4">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
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
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="providerName">Provider Name</Label>
                <Input
                  id="providerName"
                  value={formState.providerName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clinicAddress">Clinic Address</Label>
              <Input
                id="clinicAddress"
                value={formState.clinicAddress}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clinicPhone">Clinic Phone</Label>
                <Input
                  id="clinicPhone"
                  value={formState.clinicPhone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clinicEmail">Clinic Email</Label>
                <Input
                  id="clinicEmail"
                  value={formState.clinicEmail}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ein">EIN (Tax ID)</Label>
                <Input
                  id="ein"
                  value={formState.ein}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="npi">Provider NPI #</Label>
                <Input
                  id="npi"
                  value={formState.npi}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">
                  National Provider Identifier specific to the provider (e.g., Dr. Smith - NPI# 1234567890)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
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
                onChange={codes => setFormState(prev => ({ ...prev, defaultIcdCodes: codes }))}
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
                onChange={codes => setFormState(prev => ({ ...prev, defaultCptCodes: codes }))}
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
                onChange={complaints => setFormState(prev => ({ ...prev, defaultMainComplaints: complaints }))}
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
                onChange={handleInputChange}
                className="max-w-xs"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This fee will be pre-filled for all new visits
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="border-t pt-6">
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
