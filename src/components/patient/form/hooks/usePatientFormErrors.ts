
import { useState } from 'react';
import { PatientValidationErrors } from '../validation';
import { useToast } from "@/components/ui/use-toast";
import { PatientProfile } from "@/types/patient";

/**
 * Hook for managing patient form validation errors
 */
export const usePatientFormErrors = () => {
  const { toast } = useToast();
  const [validationErrors, setValidationErrors] = useState<PatientValidationErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Clear validation errors for specific fields
  const clearValidationError = (field: keyof PatientValidationErrors) => {
    setValidationErrors(prev => ({ ...prev, [field]: undefined }));
  };

  // Clear all validation errors
  const clearAllValidationErrors = () => {
    setValidationErrors({});
  };

  // Clear submit error
  const clearSubmitError = () => {
    if (submitError) {
      setSubmitError(null);
    }
  };

  // Display toast notification for errors
  const displayErrorToast = (message: string) => {
    toast({
      title: "Form Validation Error",
      description: message,
      variant: "destructive",
    });
  };

  return {
    validationErrors,
    setValidationErrors,
    submitError,
    setSubmitError,
    clearValidationError,
    clearAllValidationErrors,
    clearSubmitError,
    displayErrorToast
  };
};
