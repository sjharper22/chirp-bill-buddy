
import { PatientProfile } from "@/types/patient";
import { validatePatientForm } from '../validation';
import { useToast } from "@/components/ui/use-toast";

interface UsePatientFormSubmitProps {
  patient: Omit<PatientProfile, "id">;
  setValidationErrors: (errors: any) => void;
  setSubmitError: (error: string | null) => void;
  setIsSubmittingLocal: (isSubmitting: boolean) => void;
  onSubmit: (patient: Omit<PatientProfile, "id">) => Promise<void>;
  resetFormValues: () => void;
}

/**
 * Hook for handling patient form submission
 */
export const usePatientFormSubmit = ({
  patient,
  setValidationErrors,
  setSubmitError,
  setIsSubmittingLocal,
  onSubmit,
  resetFormValues
}: UsePatientFormSubmitProps) => {
  const { toast } = useToast();
  
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
      resetFormValues();
      
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
    handleSubmit
  };
};
