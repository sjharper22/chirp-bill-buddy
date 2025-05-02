
import { PatientProfile } from "@/types/patient";
import { Patient } from "./types";

// Convert database patient to frontend patient model
export const mapDbPatientToPatient = (dbPatient: any): PatientProfile => {
  console.log("Mapping DB patient to frontend model:", dbPatient);
  
  // Handle dates properly
  const dobDate = dbPatient.dob ? new Date(dbPatient.dob) : new Date();
  const lastVisitDate = dbPatient.last_visit_date ? new Date(dbPatient.last_visit_date) : undefined;
  
  // Ensure arrays are properly handled - check both array and string formats
  let defaultIcdCodes = [];
  if (dbPatient.default_icd_codes) {
    if (Array.isArray(dbPatient.default_icd_codes)) {
      defaultIcdCodes = dbPatient.default_icd_codes;
    } else if (typeof dbPatient.default_icd_codes === 'string') {
      try {
        defaultIcdCodes = JSON.parse(dbPatient.default_icd_codes);
      } catch (e) {
        console.error("Failed to parse ICD codes:", e);
      }
    }
  }
    
  let defaultCptCodes = [];
  if (dbPatient.default_cpt_codes) {
    if (Array.isArray(dbPatient.default_cpt_codes)) {
      defaultCptCodes = dbPatient.default_cpt_codes;
    } else if (typeof dbPatient.default_cpt_codes === 'string') {
      try {
        defaultCptCodes = JSON.parse(dbPatient.default_cpt_codes);
      } catch (e) {
        console.error("Failed to parse CPT codes:", e);
      }
    }
  }
  
  return {
    id: dbPatient.id,
    name: dbPatient.name,
    dob: dobDate,
    lastSuperbillDate: lastVisitDate,
    lastSuperbillDateRange: undefined, // Would need additional query to populate this
    commonIcdCodes: defaultIcdCodes,
    commonCptCodes: defaultCptCodes,
    notes: dbPatient.notes,
  };
};

// Convert frontend patient to database model
export const mapPatientToDbPatient = (patient: Omit<PatientProfile, "id">): any => {
  return {
    name: patient.name,
    dob: patient.dob.toISOString().split('T')[0], // Format as YYYY-MM-DD for PostgreSQL date
    default_icd_codes: patient.commonIcdCodes || [],
    default_cpt_codes: patient.commonCptCodes || [],
    last_visit_date: patient.lastSuperbillDate ? patient.lastSuperbillDate.toISOString() : null,
    notes: patient.notes,
  };
};
