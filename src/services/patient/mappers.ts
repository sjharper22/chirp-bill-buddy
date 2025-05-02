
import { PatientProfile } from "@/types/patient";
import { Patient } from "./types";

// Convert database patient to frontend patient model
export const mapDbPatientToPatient = (dbPatient: any): PatientProfile => {
  console.log("Mapping DB patient to frontend model:", dbPatient);
  return {
    id: dbPatient.id,
    name: dbPatient.name,
    dob: new Date(dbPatient.dob),
    lastSuperbillDate: dbPatient.last_visit_date ? new Date(dbPatient.last_visit_date) : undefined,
    lastSuperbillDateRange: undefined, // Would need additional query to populate this
    commonIcdCodes: dbPatient.default_icd_codes || [],
    commonCptCodes: dbPatient.default_cpt_codes || [],
    notes: dbPatient.notes,
  };
};

// Convert frontend patient to database model
export const mapPatientToDbPatient = (patient: Omit<PatientProfile, "id">): any => {
  return {
    name: patient.name,
    dob: patient.dob,
    default_icd_codes: patient.commonIcdCodes || [],
    default_cpt_codes: patient.commonCptCodes || [],
    last_visit_date: patient.lastSuperbillDate,
    notes: patient.notes,
  };
};
