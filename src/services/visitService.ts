
import { supabase } from "@/integrations/supabase/client";
import { CptCodeEntry } from "@/types/cpt-entry";

export interface Visit {
  id: string;
  patient_id: string;
  visit_date: string;
  icd_codes: unknown;
  cpt_codes: unknown;
  cpt_code_entries?: CptCodeEntry[]; // New field
  main_complaints: unknown;
  fee: number;
  notes?: string;
  status: string;
  superbill_id?: string;
  created_at: string;
  updated_at: string;
}

export type VisitInsert = Visit;
export type VisitUpdate = Visit;

export const visitService = {
  // Get all visits for a patient
  async getVisitsByPatient(patientId: string): Promise<Visit[]> {
    const { data, error } = await supabase
      .from("visits")
      .select("*")
      .eq("patient_id", patientId)
      .order("visit_date", { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get unbilled visits for a patient
  async getUnbilledVisitsByPatient(patientId: string): Promise<Visit[]> {
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .eq('patient_id', patientId)
      .eq('status', 'unbilled')
      .order('visit_date', { ascending: false });

    if (error) {
      console.error('Error fetching unbilled visits:', error);
      throw error;
    }

    return data || [];
  },

  // Create a new visit
  async createVisit(visit: VisitInsert): Promise<Visit> {
    const { data, error } = await supabase
      .from("visits")
      .insert(visit)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a visit
  async updateVisit(id: string, updates: VisitUpdate): Promise<Visit> {
    const { data, error } = await supabase
      .from("visits")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a visit
  async deleteVisit(id: string): Promise<void> {
    const { error } = await supabase
      .from("visits")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  // Link visits to a superbill
  async linkVisitsToSuperbill(superbillId: string, visitIds: string[]): Promise<void> {
    // First, update visit statuses
    const { error: updateError } = await supabase
      .from("visits")
      .update({ 
        status: "included_in_superbill",
        superbill_id: superbillId 
      })
      .in("id", visitIds);

    if (updateError) throw updateError;

    // Then, create junction table entries
    const junctionData = visitIds.map(visitId => ({
      superbill_id: superbillId,
      visit_id: visitId
    }));

    const { error: junctionError } = await supabase
      .from("superbill_visits")
      .insert(junctionData);

    if (junctionError) throw junctionError;
  },

  // Get visits linked to a superbill
  async getSuperbillVisits(superbillId: string): Promise<Visit[]> {
    const { data, error } = await supabase
      .from("superbill_visits")
      .select(`
        visit_id,
        visits (*)
      `)
      .eq("superbill_id", superbillId);

    if (error) throw error;
    return data?.map(item => item.visits).filter(Boolean) as Visit[] || [];
  }
};
