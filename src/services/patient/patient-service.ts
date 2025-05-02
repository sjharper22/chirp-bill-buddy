
import { supabase } from "@/integrations/supabase/client";
import { PatientProfile } from "@/types/patient";
import { mapDbPatientToPatient, mapPatientToDbPatient } from "./mappers";

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
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching patient:', error);
        throw new Error(`Failed to fetch patient: ${error.message}`);
      }
      
      if (!data) {
        console.log(`Patient with ID ${id} not found`);
        return null;
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
      if (!name || name.trim() === '') {
        console.log("Cannot search for patient with empty name");
        return null;
      }
      
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
      if (!patient.name || patient.name.trim() === '') {
        throw new Error("Patient name cannot be empty");
      }
      
      const dbPatient = mapPatientToDbPatient(patient);
      
      // Add a created_by field if not present
      if (!dbPatient.created_by) {
        // Use authenticated user ID if available or null
        const { data: { session } } = await supabase.auth.getSession();
        dbPatient.created_by = session?.user?.id || null;
      }
      
      console.log("Creating patient in Supabase:", dbPatient);
      
      const { data, error } = await supabase
        .from('patients')
        .insert([dbPatient]) // Explicitly wrap in array to match Supabase API expectation
        .select()
        .single();
        
      if (error) {
        console.error('Error creating patient:', error);
        throw new Error(`Failed to create patient: ${error.message}`);
      }
      
      if (!data) {
        throw new Error("No data returned after creating patient");
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
      if (!id) {
        throw new Error("Patient ID is required for updates");
      }
      
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
  }
};
