
import { PatientProfile } from "@/types/patient";

export type PatientValidationErrors = {
  name?: string;
  dob?: string;
};

export const validatePatientForm = (
  patient: Omit<PatientProfile, "id">
): PatientValidationErrors => {
  const errors: PatientValidationErrors = {};
  
  if (!patient.name || patient.name.trim() === '') {
    errors.name = 'Patient name is required';
  }
  
  if (!patient.dob) {
    errors.dob = 'Date of birth is required';
  } else if (!(patient.dob instanceof Date) || isNaN(patient.dob.getTime())) {
    errors.dob = 'Valid date of birth is required';
  }
  
  return errors;
};
