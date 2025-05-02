
import { useState } from 'react';
import { PatientProfile } from "@/types/patient";
import { validatePatientForm, PatientValidationErrors } from './validation';
import { useToast } from "@/components/ui/use-toast";

export const usePatientForm = (
  onSubmit: (patient: Omit<PatientProfile, "id">) => Promise<void>,
  initialPatient?: Partial<Omit<PatientProfile, "id">>
) => {
  const { toast } = useToast();
  const [patient, setPatient] = useState<Omit<PatientProfile, "id">>({
    name: initialPatient?.name || "",
    dob: initialPatient?.dob || new Date(),
    commonIcdCodes: initialPatient?.commonIcdCodes || [],
    commonCptCodes: initialPatient?.commonCptCodes || [],
    notes: initialPatient?.notes || "",
  });

  const [validationErrors, setValidationErrors] = useState<PatientValidationErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmittingLocal, setIsSubmittingLocal] = useState(false);
  
  const handleChange = <K extends keyof Omit<PatientProfile, "id">>(
    field: K, 
    value: Omit<PatientProfile, "id">[K]
  ) => {
    setPatient(prev => ({ ...prev, [field]: value }));
    
    // Clear validation errors when field is updated
    if (field === 'name' || field === 'dob') {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear submit error when any field changes
    if (submitError) {
      setSubmitError(null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validatePatientForm(patient);
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast({
        title: "Form Validation Error",
        description: "Please correct the errors in the form before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setSubmitError(null);
      setIsSubmittingLocal(true);
      
      console.log("Submitting patient form with data:", patient);
      await onSubmit({
        ...patient,
        commonIcdCodes: patient.commonIcdCodes || [],
        commonCptCodes: patient.commonCptCodes || []
      });
      
      // Reset form after successful submission
      setPatient({
        name: "",
        dob: new Date(),
        commonIcdCodes: [],
        commonCptCodes: [],
        notes: "",
      });
      
    } catch (error: any) {
      console.error("Error submitting patient form:", error);
      setSubmitError(error.message || "Failed to save patient");
      
      toast({
        title: "Error",
        description: error.message || "Failed to save patient",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingLocal(false);
    }
  };
  
  return {
    patient,
    handleChange,
    handleSubmit,
    validationErrors,
    submitError,
    setSubmitError,
    isSubmittingLocal
  };
};
