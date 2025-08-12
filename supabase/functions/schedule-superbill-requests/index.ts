import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@4.0.0";

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
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  global: { headers: { Authorization: `Bearer ${SERVICE_ROLE}` } },
});
const resend = new Resend(RESEND_API_KEY);

function isQuarterBoundaryMonth(month: number) {
  // month is 1-12
  return [1, 4, 7, 10].includes(month);
}

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

function lastDayOfMonth(year: number, month1to12: number) {
  return new Date(Date.UTC(year, month1to12, 0)).getUTCDate();
}

function getPrevMonthRange(now: Date) {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1; // 1-12 current
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const from = `${prevYear}-${pad(prevMonth)}-01`;
  const to = `${prevYear}-${pad(prevMonth)}-${pad(lastDayOfMonth(prevYear, prevMonth))}`;
  return { from, to };
}

function getPrevQuarterRange(now: Date) {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1; // 1-12
  const currentQuarter = Math.ceil(month / 3);
  const prevQuarter = currentQuarter === 1 ? 4 : currentQuarter - 1;
  const prevYear = currentQuarter === 1 ? year - 1 : year;
  const startMonth = (prevQuarter - 1) * 3 + 1;
  const endMonth = startMonth + 2;
  const from = `${prevYear}-${pad(startMonth)}-01`;
  const to = `${prevYear}-${pad(endMonth)}-${pad(lastDayOfMonth(prevYear, endMonth))}`;
  return { from, to };
}

function generateToken(bytes = 24) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('');
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
      .select("user_id, default_delivery, default_notes, recurrence, day_of_month");

    if (prefsError) throw prefsError;

    const toRun = (prefs || []).filter((p: PrefRow) => {
      if (p.recurrence === 'none') return false;
      if (p.recurrence === 'monthly') return p.day_of_month === today;
      if (p.recurrence === 'quarterly') return p.day_of_month === today && isQuarterBoundaryMonth(month);
      return false;
    });

    const results: Array<{ user_id: string; emailed: boolean; error?: string }> = [];

    for (const p of toRun) {
      try {
        // Determine suggested date range
        const range = p.recurrence === 'monthly' ? getPrevMonthRange(now) : getPrevQuarterRange(now);

        // Create magic token
        const token = generateToken();
        const expires = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7).toISOString(); // 7 days

        const payload = {
          preferred_delivery: p.default_delivery ?? 'email',
          notes: p.default_notes ?? null,
          from_date: range.from,
          to_date: range.to,
        };

        const { error: insertTokenErr } = await supabase
          .from('magic_link_tokens')
          .insert({
            token,
            user_id: p.user_id,
            action: 'confirm_superbill_request',
            payload,
            expires_at: expires,
          });
        if (insertTokenErr) throw insertTokenErr;

        // Lookup user email via Admin API
        const { data: userResp, error: userErr } = await supabase.auth.admin.getUserById(p.user_id);
        if (userErr) throw userErr;
        const email = userResp?.user?.email;
        if (!email) throw new Error('User email not found');

        const confirmUrl = `${SUPABASE_URL}/functions/v1/confirm-superbill?token=${token}`;

        const subject = p.recurrence === 'monthly'
          ? `Confirm last month's superbill request`
          : `Confirm last quarter's superbill request`;

        const html = `
          <div style="font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,sans-serif; color:#111827; line-height:1.6;">
            <h2 style="margin:0 0 12px;">Review and confirm your superbill request</h2>
            <p>Click the button below to confirm we should generate a superbill for the following period:</p>
            <ul style="margin:12px 0; padding-left:18px;">
              <li><strong>From:</strong> ${payload.from_date}</li>
              <li><strong>To:</strong> ${payload.to_date}</li>
              <li><strong>Delivery:</strong> ${payload.preferred_delivery}</li>
            </ul>
            ${payload.notes ? `<p><strong>Your notes:</strong><br/>${String(payload.notes).replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p>` : ''}
            <p style="margin:20px 0;">
              <a href="${confirmUrl}"
                 style="display:inline-block; background:#111827; color:#fff; text-decoration:none; padding:10px 16px; border-radius:8px;">
                 Confirm request
              </a>
            </p>
            <p style="font-size:12px; color:#6b7280;">If the button doesn't work, copy and paste this URL:<br/>
              <span style="word-break:break-all;">${confirmUrl}</span>
            </p>
            <p style="font-size:12px; color:#6b7280;">This link expires in 7 days.</p>
          </div>
        `;

        const { error: emailErr } = await resend.emails.send({
          from: "Superbill Portal <onboarding@resend.dev>",
          to: [email],
          subject,
          html,
        });
        if (emailErr) throw emailErr as Error;

        results.push({ user_id: p.user_id, emailed: true });
      } catch (err: any) {
        console.error('Failed to process preference', { user_id: p.user_id, error: err?.message });
        results.push({ user_id: p.user_id, emailed: false, error: err?.message || 'Unknown error' });
      }
    }

    const summary = {
      attempted: toRun.length,
      emailed: results.filter(r => r.emailed).length,
      failed: results.filter(r => !r.emailed).length,
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
