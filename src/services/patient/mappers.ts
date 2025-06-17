import { PatientProfile } from "@/types/patient";

// Convert database patient to frontend patient model
export const mapDbPatientToPatient = (dbPatient: any): PatientProfile => {
  if (!dbPatient) {
    console.error("Received null or undefined dbPatient");
    throw new Error("Invalid patient data received from database");
  }
  
  console.log("Mapping DB patient to frontend model:", dbPatient);
  
  // Handle dates properly
  const parseDateSafely = (dateValue: any): Date | undefined => {
    if (!dateValue) return undefined;
    try {
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? undefined : date;
    } catch (e) {
      console.error("Error parsing date:", e);
      return undefined;
    }
  };

  let dobDate: Date;
  try {
    dobDate = dbPatient.dob ? new Date(dbPatient.dob) : new Date();
    if (isNaN(dobDate.getTime())) {
      console.warn("Invalid DOB date, using current date instead");
      dobDate = new Date();
    }
  } catch (e) {
    console.error("Error parsing DOB:", e);
    dobDate = new Date();
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
  
  const result: PatientProfile = {
    id: dbPatient.id || '',
    name: dbPatient.name || '',
    dob: dobDate,
    phone: dbPatient.phone || undefined,
    email: dbPatient.email || undefined,
    secondary_phone: dbPatient.secondary_phone || undefined,
    work_phone: dbPatient.work_phone || undefined,
    
    // Address Information
    address_line1: dbPatient.address_line1 || undefined,
    address_line2: dbPatient.address_line2 || undefined,
    city: dbPatient.city || undefined,
    state: dbPatient.state || undefined,
    zip_code: dbPatient.zip_code || undefined,
    country: dbPatient.country || undefined,
    
    // Demographics
    gender: dbPatient.gender || undefined,
    marital_status: dbPatient.marital_status || undefined,
    occupation: dbPatient.occupation || undefined,
    employer: dbPatient.employer || undefined,
    preferred_communication: dbPatient.preferred_communication || undefined,
    avatar_url: dbPatient.avatar_url || undefined,
    patient_status: dbPatient.patient_status || 'active',
    
    // Emergency Contact
    emergency_contact_name: dbPatient.emergency_contact_name || undefined,
    emergency_contact_phone: dbPatient.emergency_contact_phone || undefined,
    emergency_contact_relationship: dbPatient.emergency_contact_relationship || undefined,
    
    // Insurance Information
    insurance_provider: dbPatient.insurance_provider || undefined,
    insurance_policy_number: dbPatient.insurance_policy_number || undefined,
    insurance_group_number: dbPatient.insurance_group_number || undefined,
    insurance_subscriber_name: dbPatient.insurance_subscriber_name || undefined,
    insurance_subscriber_dob: parseDateSafely(dbPatient.insurance_subscriber_dob),
    
    // Medical Information
    referring_physician: dbPatient.referring_physician || undefined,
    primary_care_physician: dbPatient.primary_care_physician || undefined,
    allergies: dbPatient.allergies || undefined,
    medications: dbPatient.medications || undefined,
    medical_history: dbPatient.medical_history || undefined,
    
    // Existing fields
    lastSuperbillDate: parseDateSafely(dbPatient.last_visit_date),
    lastSuperbillDateRange: undefined,
    commonIcdCodes: parseJsonField(dbPatient.default_icd_codes),
    commonCptCodes: parseJsonField(dbPatient.default_cpt_codes),
    notes: '', // Notes are handled separately as they don't exist in DB
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
  
  const dbPatient = {
    name: patient.name || '',
    dob: formatDate(patient.dob), 
    phone: patient.phone || null,
    email: patient.email || null,
    secondary_phone: patient.secondary_phone || null,
    work_phone: patient.work_phone || null,
    
    // Address Information
    address_line1: patient.address_line1 || null,
    address_line2: patient.address_line2 || null,
    city: patient.city || null,
    state: patient.state || null,
    zip_code: patient.zip_code || null,
    country: patient.country || 'US',
    
    // Demographics
    gender: patient.gender || null,
    marital_status: patient.marital_status || null,
    occupation: patient.occupation || null,
    employer: patient.employer || null,
    preferred_communication: patient.preferred_communication || 'phone',
    avatar_url: patient.avatar_url || null,
    patient_status: patient.patient_status || 'active',
    
    // Emergency Contact
    emergency_contact_name: patient.emergency_contact_name || null,
    emergency_contact_phone: patient.emergency_contact_phone || null,
    emergency_contact_relationship: patient.emergency_contact_relationship || null,
    
    // Insurance Information
    insurance_provider: patient.insurance_provider || null,
    insurance_policy_number: patient.insurance_policy_number || null,
    insurance_group_number: patient.insurance_group_number || null,
    insurance_subscriber_name: patient.insurance_subscriber_name || null,
    insurance_subscriber_dob: formatDate(patient.insurance_subscriber_dob),
    
    // Medical Information
    referring_physician: patient.referring_physician || null,
    primary_care_physician: patient.primary_care_physician || null,
    allergies: patient.allergies || null,
    medications: patient.medications || null,
    medical_history: patient.medical_history || null,
    
    // Existing fields
    default_icd_codes: ensureArray(patient.commonIcdCodes),
    default_cpt_codes: ensureArray(patient.commonCptCodes),
    last_visit_date: patient.lastSuperbillDate instanceof Date ? 
      patient.lastSuperbillDate.toISOString() : null,
  };
  
  console.log("DB patient format:", dbPatient);
  return dbPatient;
};
