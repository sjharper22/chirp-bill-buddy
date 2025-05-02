
import { useState } from 'react';
import { PatientProfile } from "@/types/patient";

/**
 * Hook for managing patient form state
 */
export const usePatientFormState = (
  initialPatient?: Partial<Omit<PatientProfile, "id">>
) => {
  // Initialize form state with provided defaults or empty values
  const [patient, setPatient] = useState<Omit<PatientProfile, "id">>({
    name: initialPatient?.name || "",
    dob: initialPatient?.dob || new Date(),
    commonIcdCodes: initialPatient?.commonIcdCodes || [],
    commonCptCodes: initialPatient?.commonCptCodes || [],
    notes: initialPatient?.notes || "",
  });

  const [isSubmittingLocal, setIsSubmittingLocal] = useState(false);
  
  // Generic change handler for updating any field in the patient state
  const handleChange = <K extends keyof Omit<PatientProfile, "id">>(
    field: K, 
    value: Omit<PatientProfile, "id">[K]
  ) => {
    setPatient(prev => ({ ...prev, [field]: value }));
  };

  return {
    patient,
    setPatient,
    isSubmittingLocal,
    setIsSubmittingLocal,
    handleChange
  };
};
