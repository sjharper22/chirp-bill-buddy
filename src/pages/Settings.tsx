
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSuperbill } from "@/context/superbill-context";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ClinicDefaults } from "@/types/superbill";
import { ClinicInformationForm } from "@/components/settings/ClinicInformationForm";
import { DefaultCodesForm } from "@/components/settings/DefaultCodesForm";

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clinicDefaults, updateClinicDefaults } = useSuperbill();
  
  const [formState, setFormState] = useState<ClinicDefaults>({
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

  const handleDefaultCodesChange = (
    field: keyof Pick<ClinicDefaults, 'defaultIcdCodes' | 'defaultCptCodes' | 'defaultMainComplaints'>,
    codes: string[]
  ) => {
    setFormState(prev => ({
      ...prev,
      [field]: codes
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
        <ClinicInformationForm 
          formState={formState}
          onInputChange={handleInputChange}
        />
        
        <DefaultCodesForm 
          formState={formState}
          onInputChange={handleInputChange}
          onDefaultCodesChange={handleDefaultCodesChange}
          onSubmit={handleSubmit}
        />
      </form>
    </div>
  );
}
