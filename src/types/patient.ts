import { Visit } from "./superbill";

export interface PatientProfile {
  id: string;
  name: string;
  dob: Date;
  phone?: string;
  email?: string;
  secondary_phone?: string;
  work_phone?: string;
  
  // Address Information
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  
  // Demographics
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  marital_status?: 'single' | 'married' | 'divorced' | 'widowed' | 'separated' | 'other';
  occupation?: string;
  employer?: string;
  preferred_communication?: 'phone' | 'email' | 'text' | 'portal';
  avatar_url?: string;
  patient_status?: 'active' | 'inactive' | 'discharged' | 'deceased';
  
  // Emergency Contact
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  
  // Insurance Information
  insurance_provider?: string;
  insurance_policy_number?: string;
  insurance_group_number?: string;
  insurance_subscriber_name?: string;
  insurance_subscriber_dob?: Date;
  
  // Medical Information
  referring_physician?: string;
  primary_care_physician?: string;
  allergies?: string;
  medications?: string;
  medical_history?: string;
  
  // Existing fields
  lastSuperbillDate?: Date;
  lastSuperbillDateRange?: {
    start: Date;
    end: Date;
  };
  commonIcdCodes: string[];
  commonCptCodes: string[];
  visits?: Visit[];
  notes?: string;
}

export interface PatientRelationship {
  id: string;
  patient_id: string;
  related_patient_id?: string;
  relationship_type: 'spouse' | 'parent' | 'child' | 'sibling' | 'guardian' | 'emergency_contact' | 'other';
  related_person_name?: string;
  related_person_phone?: string;
  related_person_email?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export type PatientProfileFormData = Omit<PatientProfile, "id">;
