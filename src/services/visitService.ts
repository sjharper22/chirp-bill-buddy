
import { supabase } from "@/integrations/supabase/client";
import { CptCodeEntry } from "@/types/cpt-entry";
import { Tables } from "@/integrations/supabase/types";

// Database row type from Supabase
type VisitRow = Tables<'visits'>;

export interface Visit {
  id: string;
  patient_id: string;
  visit_date: string;
  icd_codes: unknown;
  cpt_codes: unknown;
  cpt_code_entries: CptCodeEntry[]; // Required field
  main_complaints: unknown;
  fee: number;
  notes?: string;
  status: string;
  superbill_id?: string;
  created_at: string;
  updated_at: string;
}

// Transform database row to Visit
function mapRowToVisit(row: VisitRow): Visit {
  return {
    ...row,
    cpt_code_entries: Array.isArray(row.cpt_code_entries) ? (row.cpt_code_entries as unknown as CptCodeEntry[]) : []
  };
}

// Transform Visit to database insert/update format
function mapVisitToRow(visit: Partial<Visit>): any {
  return {
    ...visit,
    cpt_code_entries: visit.cpt_code_entries || []
  };
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
    return (data || []).map(mapRowToVisit);
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

    return (data || []).map(mapRowToVisit);
  },

  // Create a new visit
  async createVisit(visit: VisitInsert): Promise<Visit> {
    const visitData = mapVisitToRow(visit);
    const { data, error } = await supabase
      .from("visits")
      .insert(visitData)
      .select()
      .single();

    if (error) throw error;
    return mapRowToVisit(data);
  },

  // Update a visit
  async updateVisit(id: string, updates: VisitUpdate): Promise<Visit> {
    const updateData = mapVisitToRow(updates);
    const { data, error } = await supabase
      .from("visits")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return mapRowToVisit(data);
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
    return (data?.map(item => item.visits).filter(Boolean) || []).map(mapRowToVisit);
  }
};
