
import { PatientProfile } from "@/types/patient";
import { Patient } from "./types";

// Convert database patient to frontend patient model
export const mapDbPatientToPatient = (dbPatient: any): PatientProfile => {
  if (!dbPatient) {
    console.error("Received null or undefined dbPatient");
    throw new Error("Invalid patient data received from database");
  }
  
  console.log("Mapping DB patient to frontend model:", dbPatient);
  
  // Handle dates properly
  let dobDate: Date;
  try {
    dobDate = dbPatient.dob ? new Date(dbPatient.dob) : new Date();
    // Ensure it's a valid date
    if (isNaN(dobDate.getTime())) {
      console.warn("Invalid DOB date, using current date instead");
      dobDate = new Date();
    }
  } catch (e) {
    console.error("Error parsing DOB:", e);
    dobDate = new Date();
  }
  
  // Handle last visit date
  let lastVisitDate: Date | undefined;
  try {
    lastVisitDate = dbPatient.last_visit_date ? new Date(dbPatient.last_visit_date) : undefined;
    if (lastVisitDate && isNaN(lastVisitDate.getTime())) {
      console.warn("Invalid last visit date, setting to undefined");
      lastVisitDate = undefined;
    }
  } catch (e) {
    console.error("Error parsing last visit date:", e);
    lastVisitDate = undefined;
  }
  
  // Parse JSON fields safely
  const parseJsonField = (field: any): any[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch (e) {
        console.error(`Failed to parse field:`, e);
        return [];
      }
    }
    return [];
  };
  
  // Ensure ICD and CPT codes are arrays
  const icdCodes = parseJsonField(dbPatient.default_icd_codes);
  const cptCodes = parseJsonField(dbPatient.default_cpt_codes);
  
  const result: PatientProfile = {
    id: dbPatient.id || '',
    name: dbPatient.name || '',
    dob: dobDate,
    lastSuperbillDate: lastVisitDate,
    lastSuperbillDateRange: undefined,
    commonIcdCodes: icdCodes,
    commonCptCodes: cptCodes,
    notes: dbPatient.notes || '',
  };
  
  console.log("Mapped patient:", result);
  return result;
};

// Convert frontend patient to database model
export const mapPatientToDbPatient = (patient: Omit<PatientProfile, "id">): any => {
  console.log("Converting patient to DB format:", patient);
  
  // Format date as YYYY-MM-DD string for PostgreSQL
  const formatDate = (date: Date | undefined): string | null => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return null;
    }
    return date.toISOString().split('T')[0];
  };
  
  // Ensure arrays are actually arrays before sending to DB
  const ensureArray = (value: any): any[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return [];
  };
  
  // Create the DB patient object
  const dbPatient = {
    name: patient.name || '',
    dob: formatDate(patient.dob), 
    default_icd_codes: ensureArray(patient.commonIcdCodes),
    default_cpt_codes: ensureArray(patient.commonCptCodes),
    last_visit_date: patient.lastSuperbillDate instanceof Date ? 
      patient.lastSuperbillDate.toISOString() : null,
    notes: patient.notes || '',
  };
  
  console.log("DB patient format:", dbPatient);
  return dbPatient;
};
