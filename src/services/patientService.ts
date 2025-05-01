
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
const mapPatientToDbPatient = (patient: Omit<PatientProfile, "id">): any => {
  return {
    name: patient.name,
    dob: patient.dob,
    default_icd_codes: patient.commonIcdCodes || [],
    default_cpt_codes: patient.commonCptCodes || [],
    last_visit_date: patient.lastSuperbillDate,
    notes: patient.notes,
  };
};

export const patientService = {
  // Get all patients
  async getAll(): Promise<PatientProfile[]> {
    try {
      console.log("patientService.getAll: Fetching all patients from Supabase");
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('name');
        
      if (error) {
        console.error('Error fetching patients:', error);
        throw new Error(`Failed to fetch patients: ${error.message}`);
      }
      
      console.log("Raw patients data from Supabase:", data);
      const mappedData = Array.isArray(data) ? data.map(mapDbPatientToPatient) : [];
      console.log("Mapped patient data:", mappedData);
      return mappedData;
    } catch (e: any) {
      console.error("Error in getAll patients:", e);
      throw new Error(`Failed to fetch patients: ${e.message}`);
    }
  },
  
  // Get a single patient by ID
  async getById(id: string): Promise<PatientProfile | null> {
    try {
      console.log(`patientService.getById: Fetching patient with ID ${id}`);
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') { // Record not found
          console.log(`Patient with ID ${id} not found`);
          return null;
        }
        console.error('Error fetching patient:', error);
        throw new Error(`Failed to fetch patient: ${error.message}`);
      }
      
      return mapDbPatientToPatient(data);
    } catch (e: any) {
      console.error("Error in getById:", e);
      throw new Error(`Failed to fetch patient: ${e.message}`);
    }
  },

  // Check if a patient exists by name
  async getByName(name: string): Promise<PatientProfile | null> {
    try {
      console.log(`patientService.getByName: Looking for patient with name ${name}`);
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('name', name)
        .maybeSingle();
        
      if (error) {
        console.error('Error searching for patient by name:', error);
        throw new Error(`Failed to search for patient: ${error.message}`);
      }
      
      if (!data) {
        console.log(`No patient found with name ${name}`);
        return null;
      }
      
      return mapDbPatientToPatient(data);
    } catch (e: any) {
      console.error("Error in getByName:", e);
      throw new Error(`Failed to search for patient: ${e.message}`);
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
        throw new Error(`Failed to create patient: ${error.message}`);
      }
      
      console.log("Created patient in Supabase:", data);
      return mapDbPatientToPatient(data);
    } catch (e: any) {
      console.error("Error in create patient:", e);
      throw new Error(`Failed to create patient: ${e.message}`);
    }
  },
  
  // Update an existing patient
  async update(id: string, patient: PatientProfile): Promise<PatientProfile> {
    try {
      const dbPatient = mapPatientToDbPatient(patient);
      
      console.log(`Updating patient with ID ${id}:`, dbPatient);
      
      const { data, error } = await supabase
        .from('patients')
        .update(dbPatient)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating patient:', error);
        throw new Error(`Failed to update patient: ${error.message}`);
      }
      
      console.log("Updated patient in Supabase:", data);
      return mapDbPatientToPatient(data);
    } catch (e: any) {
      console.error("Error in update patient:", e);
      throw new Error(`Failed to update patient: ${e.message}`);
    }
  },
  
  // Delete a patient
  async delete(id: string): Promise<void> {
    try {
      console.log(`Deleting patient with ID ${id}`);
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting patient:', error);
        throw new Error(`Failed to delete patient: ${error.message}`);
      }
      
      console.log(`Patient with ID ${id} deleted successfully`);
    } catch (e: any) {
      console.error("Error in delete patient:", e);
      throw new Error(`Failed to delete patient: ${e.message}`);
    }
  },
  
  // Search patients
  async search(query: string): Promise<PatientProfile[]> {
    try {
      console.log(`Searching patients with query: ${query}`);
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .ilike('name', `%${query}%`)
        .order('name');
        
      if (error) {
        console.error('Error searching patients:', error);
        throw new Error(`Failed to search patients: ${error.message}`);
      }
      
      return data.map(mapDbPatientToPatient);
    } catch (e: any) {
      console.error("Error in search patients:", e);
      throw new Error(`Failed to search patients: ${e.message}`);
    }
  }
};
