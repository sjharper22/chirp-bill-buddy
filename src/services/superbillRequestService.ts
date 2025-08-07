import { supabase } from "@/integrations/supabase/client";

export type RequestStatus = "pending" | "in_progress" | "completed" | "rejected";

export interface SuperbillRequest {
  id: string;
  created_by: string;
  patient_id?: string | null;
  patient_name?: string | null;
  patient_dob?: string | null; // ISO date string
  contact_email?: string | null;
  contact_phone?: string | null;
  from_date?: string | null; // ISO date string
  to_date?: string | null;   // ISO date string
  notes?: string | null;
  preferred_delivery?: string | null;
  fulfillment_superbill_id?: string | null;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateSuperbillRequestInput {
  patient_name?: string;
  patient_dob?: Date | null;
  contact_email: string;
  contact_phone?: string;
  from_date?: Date | null;
  to_date?: Date | null;
  notes: string;
  preferred_delivery?: "email" | "portal" | "print";
}

export const createSuperbillRequest = async (
  userId: string,
  input: CreateSuperbillRequestInput
) => {
  const payload = {
    created_by: userId,
    patient_name: input.patient_name ?? null,
    patient_dob: input.patient_dob ? input.patient_dob.toISOString().slice(0, 10) : null,
    contact_email: input.contact_email,
    contact_phone: input.contact_phone ?? null,
    from_date: input.from_date ? input.from_date.toISOString().slice(0, 10) : null,
    to_date: input.to_date ? input.to_date.toISOString().slice(0, 10) : null,
    notes: input.notes,
    preferred_delivery: input.preferred_delivery ?? "email",
  };

  const { data, error } = await supabase
    .from("superbill_requests")
    .insert(payload)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  return data as SuperbillRequest;
};

export const getMySuperbillRequests = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("superbill_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as SuperbillRequest[];
};

export const adminGetAllSuperbillRequests = async () => {
  const { data, error } = await supabase
    .from("superbill_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as SuperbillRequest[];
};

export const updateSuperbillRequestStatus = async (id: string, status: RequestStatus) => {
  const { data, error } = await supabase
    .from("superbill_requests")
    .update({ status })
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw error;
  return data as SuperbillRequest;
};
