
import { supabase } from "@/integrations/supabase/client";
import { PatientProfile } from "@/types/patient";

export interface Patient {
  id: string;
  name: string;
  dob: Date;
  phone: string | null;
  email: string | null;
  common_complaints: string[];
  default_icd_codes: string[];
  default_cpt_codes: string[];
  visit_count: number;
  total_billed: number;
  last_visit_date: Date | null;
  created_at: Date;
  updated_at: Date;
  notes?: string;
}

// Convert database patient to frontend patient model
const mapDbPatientToPatient = (dbPatient: any): PatientProfile => {
  return {
    id: dbPatient.id,
    name: dbPatient.name,
    dob: new Date(dbPatient.dob),
    lastSuperbillDate: dbPatient.last_visit_date ? new Date(dbPatient.last_visit_date) : undefined,
    lastSuperbillDateRange: undefined, // Would need additional query to populate this
    commonIcdCodes: dbPatient.default_icd_codes || [],
    commonCptCodes: dbPatient.default_cpt_codes || [],
    notes: dbPatient.notes,
    // Map other properties as needed
  };
};

// Convert frontend patient to database model
const mapPatientToDbPatient = (patient: Omit<PatientProfile, "id">): any => {
  return {
    name: patient.name,
    dob: patient.dob,
    default_icd_codes: patient.commonIcdCodes || [],
    default_cpt_codes: patient.commonCptCodes || [],
    notes: patient.notes,
    // Map other properties as needed
  };
};

export const patientService = {
  // Get all patients
  async getAll(): Promise<PatientProfile[]> {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('name');
        
      if (error) {
        console.error('Error fetching patients:', error);
        throw error;
      }
      
      console.log("Raw patients data from Supabase:", data);
      return Array.isArray(data) ? data.map(mapDbPatientToPatient) : [];
    } catch (e) {
      console.error("Error in getAll patients:", e);
      throw e;
    }
  },
  
  // Get a single patient by ID
  async getById(id: string): Promise<PatientProfile | null> {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') { // Record not found
          return null;
        }
        console.error('Error fetching patient:', error);
        throw error;
      }
      
      return mapDbPatientToPatient(data);
    } catch (e) {
      console.error("Error in getById:", e);
      throw e;
    }
  },
  
  // Create a new patient
  async create(patient: Omit<PatientProfile, "id">): Promise<PatientProfile> {
    try {
      const dbPatient = mapPatientToDbPatient(patient);
      
      console.log("Creating patient in Supabase:", dbPatient);
      
      const { data, error } = await supabase
        .from('patients')
        .insert(dbPatient)
        .select()
        .single();
        
      if (error) {
        console.error('Error creating patient:', error);
        throw error;
      }
      
      console.log("Created patient in Supabase:", data);
      return mapDbPatientToPatient(data);
    } catch (e) {
      console.error("Error in create patient:", e);
      throw e;
    }
  },
  
  // Update an existing patient
  async update(id: string, patient: PatientProfile): Promise<PatientProfile> {
    try {
      const dbPatient = mapPatientToDbPatient(patient);
      
      const { data, error } = await supabase
        .from('patients')
        .update(dbPatient)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating patient:', error);
        throw error;
      }
      
      return mapDbPatientToPatient(data);
    } catch (e) {
      console.error("Error in update patient:", e);
      throw e;
    }
  },
  
  // Delete a patient
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting patient:', error);
        throw error;
      }
    } catch (e) {
      console.error("Error in delete patient:", e);
      throw e;
    }
  },
  
  // Search patients
  async search(query: string): Promise<PatientProfile[]> {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .ilike('name', `%${query}%`)
        .order('name');
        
      if (error) {
        console.error('Error searching patients:', error);
        throw error;
      }
      
      return data.map(mapDbPatientToPatient);
    } catch (e) {
      console.error("Error in search patients:", e);
      throw e;
    }
  }
};
