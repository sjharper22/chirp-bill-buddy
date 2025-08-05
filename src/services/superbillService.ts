import { supabase } from "@/integrations/supabase/client";
import { Superbill } from "@/types/superbill";
import type { Database } from "@/integrations/supabase/types";

type SupabaseSuperbill = Database['public']['Tables']['superbills']['Row'];
type SupabaseSuperbillInsert = Database['public']['Tables']['superbills']['Insert'];
type PatientSuperbillLink = Database['public']['Tables']['patient_superbills']['Row'];

function transformSupabaseToSuperbill(data: SupabaseSuperbill): Superbill {
  return {
    id: data.id,
    patientName: data.patient_name,
    patientDob: new Date(data.patient_dob),
    issueDate: new Date(data.issue_date),
    clinicName: data.clinic_name,
    clinicAddress: data.clinic_address,
    clinicPhone: data.clinic_phone,
    clinicEmail: data.clinic_email,
    ein: data.ein,
    npi: data.npi,
    providerName: data.provider_name,
    defaultIcdCodes: Array.isArray(data.default_icd_codes) ? data.default_icd_codes as string[] : [],
    defaultCptCodes: Array.isArray(data.default_cpt_codes) ? data.default_cpt_codes as string[] : [],
    defaultMainComplaints: Array.isArray(data.default_main_complaints) ? data.default_main_complaints as string[] : [],
    defaultFee: data.default_fee,
    visits: Array.isArray(data.visits) ? (data.visits as any[]).map(visit => ({
      ...visit,
      date: new Date(visit.date)
    })) : [],
    status: data.status as any,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at)
  };
}

function transformSuperbillToSupabase(superbill: Superbill): SupabaseSuperbillInsert {
  return {
    id: superbill.id,
    patient_name: superbill.patientName,
    patient_dob: superbill.patientDob.toISOString().split('T')[0],
    patient_id: null, // This will be set when linking to patients
    issue_date: superbill.issueDate.toISOString().split('T')[0],
    clinic_name: superbill.clinicName,
    clinic_address: superbill.clinicAddress,
    clinic_phone: superbill.clinicPhone,
    clinic_email: superbill.clinicEmail,
    ein: superbill.ein,
    npi: superbill.npi,
    provider_name: superbill.providerName,
    default_icd_codes: superbill.defaultIcdCodes as any,
    default_cpt_codes: superbill.defaultCptCodes as any,
    default_main_complaints: superbill.defaultMainComplaints as any,
    default_fee: superbill.defaultFee,
    visits: superbill.visits.map(visit => ({
      ...visit,
      date: visit.date.toISOString()
    })) as any,
    status: superbill.status
  };
}

export const superbillService = {
  async getAllSuperbills(): Promise<Superbill[]> {
    console.log("Fetching all superbills from database");
    
    const { data, error } = await supabase
      .from('superbills')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching superbills:", error);
      throw error;
    }

    return (data || []).map(transformSupabaseToSuperbill);
  },

  async getSuperbill(id: string): Promise<Superbill | null> {
    console.log("Fetching superbill:", id);
    
    const { data, error } = await supabase
      .from('superbills')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching superbill:", error);
      throw error;
    }

    return data ? transformSupabaseToSuperbill(data) : null;
  },

  async createSuperbill(superbill: Superbill): Promise<Superbill> {
    console.log("Creating superbill:", superbill.id);
    
    const supabaseData = transformSuperbillToSupabase(superbill);
    
    const { data, error } = await supabase
      .from('superbills')
      .insert(supabaseData)
      .select()
      .single();

    if (error) {
      console.error("Error creating superbill:", error);
      throw error;
    }

    return transformSupabaseToSuperbill(data);
  },

  async updateSuperbill(id: string, superbill: Superbill): Promise<Superbill> {
    console.log("Updating superbill:", id);
    
    const supabaseData = transformSuperbillToSupabase(superbill);
    
    const { data, error } = await supabase
      .from('superbills')
      .update(supabaseData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error("Error updating superbill:", error);
      throw error;
    }

    return transformSupabaseToSuperbill(data);
  },

  async deleteSuperbill(id: string): Promise<void> {
    console.log("Deleting superbill:", id);
    
    const { error } = await supabase
      .from('superbills')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting superbill:", error);
      throw error;
    }
  },

  async getSuperbillsByPatient(patientId: string): Promise<PatientSuperbillLink[]> {
    console.log("Fetching superbill links for patient:", patientId);
    
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

  async createSuperbillLink(patientId: string, superbillId: string): Promise<PatientSuperbillLink> {
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

  async getAllSuperbillLinks(): Promise<PatientSuperbillLink[]> {
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