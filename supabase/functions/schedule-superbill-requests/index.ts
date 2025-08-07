import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Recurrence = 'none' | 'monthly' | 'quarterly';

interface PrefRow {
  user_id: string;
  default_delivery: string | null;
  default_notes: string | null;
  recurrence: Recurrence;
  day_of_month: number;
  auto_approve: boolean;
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  global: { headers: { Authorization: `Bearer ${SERVICE_ROLE}` } },
});

function isQuarterMonth(month: number) {
  // month is 1-12
  return [1, 4, 7, 10].includes(month);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const now = new Date();
    const today = now.getUTCDate();
    const month = now.getUTCMonth() + 1; // 1-12

    // Load all prefs that are enabled (recurrence != 'none')
    const { data: prefs, error: prefsError } = await supabase
      .from("superbill_request_prefs")
      .select("user_id, default_delivery, default_notes, recurrence, day_of_month, auto_approve");

    if (prefsError) throw prefsError;

    const toRun = (prefs || []).filter((p: PrefRow) => {
      if (p.recurrence === 'none') return false;
      if (p.recurrence === 'monthly') return p.day_of_month === today;
      if (p.recurrence === 'quarterly') return p.day_of_month === today && isQuarterMonth(month);
      return false;
    });

    const results: Array<{ user_id: string; inserted: boolean; error?: string }> = [];

    for (const p of toRun) {
      // Insert a superbill_request on behalf of the user
      const payload: any = {
        created_by: p.user_id,
        notes: p.default_notes ?? null,
        preferred_delivery: p.default_delivery ?? 'email',
        // Other fields are optional and can be filled later by staff
      };

      const { error: insertError } = await supabase
        .from("superbill_requests")
        .insert(payload);

      if (insertError) {
        results.push({ user_id: p.user_id, inserted: false, error: insertError.message });
      } else {
        results.push({ user_id: p.user_id, inserted: true });
      }
    }

    const summary = {
      attempted: toRun.length,
      inserted: results.filter(r => r.inserted).length,
      failed: results.filter(r => !r.inserted).length,
      timestamp: now.toISOString(),
    };

    console.log("schedule-superbill-requests summary", summary);

    return new Response(JSON.stringify({ success: true, summary, results }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 200,
    });
  } catch (e: any) {
    console.error("schedule-superbill-requests error", e);
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
      status: 500,
    });
  }
});
