
import { PatientProfile } from "@/types/patient";
import { Patient } from "./types";

// Convert database patient to frontend patient model
export const mapDbPatientToPatient = (dbPatient: any): PatientProfile => {
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
  
  const lastVisitDate = dbPatient.last_visit_date ? new Date(dbPatient.last_visit_date) : undefined;
  
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
  
  const defaultIcdCodes = parseJsonField(dbPatient.default_icd_codes);
  const defaultCptCodes = parseJsonField(dbPatient.default_cpt_codes);
  
  return {
    id: dbPatient.id || '',
    name: dbPatient.name || '',
    dob: dobDate,
    lastSuperbillDate: lastVisitDate,
    lastSuperbillDateRange: undefined,
    commonIcdCodes: defaultIcdCodes,
    commonCptCodes: defaultCptCodes,
    notes: dbPatient.notes || '',
  };
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
  
  // Ensure we have valid data to prevent database errors
  return {
    name: patient.name,
    dob: formatDate(patient.dob), 
    default_icd_codes: Array.isArray(patient.commonIcdCodes) ? patient.commonIcdCodes : [],
    default_cpt_codes: Array.isArray(patient.commonCptCodes) ? patient.commonCptCodes : [],
    last_visit_date: patient.lastSuperbillDate instanceof Date ? patient.lastSuperbillDate.toISOString() : null,
    notes: patient.notes || '',
  };
};
