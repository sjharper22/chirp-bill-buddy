
import { PatientProfile } from "@/types/patient";
import { Patient } from "./types";

// Convert database patient to frontend patient model
export const mapDbPatientToPatient = (dbPatient: any): PatientProfile => {
  console.log("Mapping DB patient to frontend model:", dbPatient);
  
  // Handle dates properly
  const dobDate = dbPatient.dob ? new Date(dbPatient.dob) : new Date();
  const lastVisitDate = dbPatient.last_visit_date ? new Date(dbPatient.last_visit_date) : undefined;
  
  // Ensure arrays are properly handled
  const defaultIcdCodes = Array.isArray(dbPatient.default_icd_codes) 
    ? dbPatient.default_icd_codes 
    : [];
    
  const defaultCptCodes = Array.isArray(dbPatient.default_cpt_codes) 
    ? dbPatient.default_cpt_codes 
    : [];
  
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
