
import { PatientProfile } from "@/types/patient";
import { usePatientFormState } from './usePatientFormState';
import { usePatientFormErrors } from './usePatientFormErrors';
import { usePatientFormSubmit } from './usePatientFormSubmit';
import { usePatientFormReset } from './usePatientFormReset';

/**
 * Main hook for managing patient form functionality
 */
export const usePatientForm = (
  onSubmit: (patient: Omit<PatientProfile, "id">) => Promise<void>,
  initialPatient?: Partial<Omit<PatientProfile, "id">>
) => {
  // Initialize state management
  const {
    patient,
    setPatient,
    isSubmittingLocal,
    setIsSubmittingLocal,
    handleChange
  } = usePatientFormState(initialPatient);
  
  // Initialize error handling
  const {
    validationErrors,
    setValidationErrors,
    submitError,
    setSubmitError,
    clearValidationError,
    clearAllValidationErrors,
    clearSubmitError
  } = usePatientFormErrors();
  
  // Initialize form reset functionality
  const { resetFormValues } = usePatientFormReset({
    setPatient,
    clearAllValidationErrors,
    clearSubmitError
  });
  
  // Initialize form submission
  const { handleSubmit } = usePatientFormSubmit({
    patient,
    setValidationErrors,
    setSubmitError,
    setIsSubmittingLocal,
    onSubmit,
    resetFormValues
  });
  
  // Modified handleChange to also clear validation errors
  const handleFormChange = <K extends keyof Omit<PatientProfile, "id">>(
    field: K, 
    value: Omit<PatientProfile, "id">[K]
  ) => {
    handleChange(field, value);
    
    // Clear validation errors when field is updated
    if (field === 'name' || field === 'dob') {
      clearValidationError(field);
    }
    
    // Clear submit error when any field changes
    if (submitError) {
      clearSubmitError();
    }
  };
  
  return {
    patient,
    handleChange: handleFormChange,
    handleSubmit,
    validationErrors,
    submitError,
    isSubmittingLocal
  };
};
