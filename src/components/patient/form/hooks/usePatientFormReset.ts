
import { PatientProfile } from "@/types/patient";

interface UsePatientFormResetProps {
  setPatient: (patient: Omit<PatientProfile, "id">) => void;
  clearAllValidationErrors: () => void;
  clearSubmitError: () => void;
}

/**
 * Hook for resetting patient form values
 */
export const usePatientFormReset = ({
  setPatient,
  clearAllValidationErrors,
  clearSubmitError,
}: UsePatientFormResetProps) => {
  
  const resetFormValues = () => {
    // Reset patient data to initial empty state
    setPatient({
      name: "",
      dob: new Date(),
      commonIcdCodes: [],
      commonCptCodes: [],
      notes: "",
    });
    
    // Clear all errors
    clearAllValidationErrors();
    clearSubmitError();
  };
  
  return {
    resetFormValues
  };
};
