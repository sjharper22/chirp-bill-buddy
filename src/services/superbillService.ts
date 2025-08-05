import { supabase } from "@/integrations/supabase/client";
import { Superbill } from "@/types/superbill";

export interface SuperbillRow {
  id: string;
  patient_id: string;
  superbill_id: string;
  created_at: string;
}

export interface SuperbillInsert {
  patient_id: string;
  superbill_id: string;
}

export const superbillService = {
  async getSuperbillsByPatient(patientId: string): Promise<SuperbillRow[]> {
    console.log("Fetching superbills for patient:", patientId);
    
    const { data, error } = await supabase
      .from('patient_superbills')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching patient superbills:", error);
      throw error;
    }

    return data || [];
  },

  async createSuperbillLink(patientId: string, superbillId: string): Promise<SuperbillRow> {
    console.log("Creating superbill link:", { patientId, superbillId });
    
    const { data, error } = await supabase
      .from('patient_superbills')
      .insert({
        patient_id: patientId,
        superbill_id: superbillId
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating superbill link:", error);
      throw error;
    }

    return data;
  },

  async deleteSuperbillLink(superbillId: string): Promise<void> {
    console.log("Deleting superbill link for:", superbillId);
    
    const { error } = await supabase
      .from('patient_superbills')
      .delete()
      .eq('superbill_id', superbillId);

    if (error) {
      console.error("Error deleting superbill link:", error);
      throw error;
    }
  },

  async getAllSuperbillLinks(): Promise<SuperbillRow[]> {
    console.log("Fetching all superbill links");
    
    const { data, error } = await supabase
      .from('patient_superbills')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching all superbill links:", error);
      throw error;
    }

    return data || [];
  }
};