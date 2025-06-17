
import { useState } from 'react';
import { PatientProfile } from "@/types/patient";

/**
 * Hook for managing patient form state
 */
export const usePatientFormState = (
  initialPatient?: Partial<PatientProfile>
) => {
  // Initialize form state with provided defaults or empty values
  const [patient, setPatient] = useState<Omit<PatientProfile, "id">>({
    name: initialPatient?.name || "",
    dob: initialPatient?.dob || new Date(),
    phone: initialPatient?.phone || "",
    email: initialPatient?.email || "",
    secondary_phone: initialPatient?.secondary_phone || "",
    work_phone: initialPatient?.work_phone || "",
    address_line1: initialPatient?.address_line1 || "",
    address_line2: initialPatient?.address_line2 || "",
    city: initialPatient?.city || "",
    state: initialPatient?.state || "",
    zip_code: initialPatient?.zip_code || "",
    country: initialPatient?.country || "US",
    gender: initialPatient?.gender || undefined,
    marital_status: initialPatient?.marital_status || undefined,
    occupation: initialPatient?.occupation || "",
    employer: initialPatient?.employer || "",
    preferred_communication: initialPatient?.preferred_communication || "phone",
    patient_status: initialPatient?.patient_status || "active",
    emergency_contact_name: initialPatient?.emergency_contact_name || "",
    emergency_contact_phone: initialPatient?.emergency_contact_phone || "",
    emergency_contact_relationship: initialPatient?.emergency_contact_relationship || "",
    insurance_provider: initialPatient?.insurance_provider || "",
    insurance_policy_number: initialPatient?.insurance_policy_number || "",
    insurance_group_number: initialPatient?.insurance_group_number || "",
    insurance_subscriber_name: initialPatient?.insurance_subscriber_name || "",
    insurance_subscriber_dob: initialPatient?.insurance_subscriber_dob || undefined,
    primary_care_physician: initialPatient?.primary_care_physician || "",
    referring_physician: initialPatient?.referring_physician || "",
    allergies: initialPatient?.allergies || "",
    medications: initialPatient?.medications || "",
    medical_history: initialPatient?.medical_history || "",
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
