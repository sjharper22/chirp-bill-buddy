import { supabase } from "@/integrations/supabase/client";

export type RequestRecurrence = 'none' | 'monthly' | 'quarterly';

export interface SuperbillRequestPrefs {
  id: string;
  user_id: string;
  default_delivery: 'email' | 'portal' | 'print';
  default_notes: string | null;
  recurrence: RequestRecurrence;
  day_of_month: number; // 1-28
  auto_approve: boolean;
  notify_via_email: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpsertPrefsInput {
  default_delivery?: 'email' | 'portal' | 'print';
  default_notes?: string | null;
  recurrence?: RequestRecurrence;
  day_of_month?: number;
  auto_approve?: boolean;
  notify_via_email?: boolean;
}

export const getMySuperbillRequestPrefs = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await supabase
    .from('superbill_request_prefs')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();
  if (error) throw error;
  return data as SuperbillRequestPrefs | null;
};

export const upsertMySuperbillRequestPrefs = async (input: UpsertPrefsInput) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const payload = {
    user_id: user.id,
    ...input,
  };

  const { data, error } = await supabase
    .from('superbill_request_prefs')
    .upsert(payload, { onConflict: 'user_id' })
    .select('*')
    .maybeSingle();

  if (error) throw error;
  return data as SuperbillRequestPrefs;
};
