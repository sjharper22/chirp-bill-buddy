import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  global: { headers: { Authorization: `Bearer ${SERVICE_ROLE}` } },
});

function htmlPage(title: string, body: string) {
  return `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      :root { color-scheme: light dark; }
      body { font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,sans-serif; margin: 24px; }
      .card { max-width: 640px; margin: 0 auto; padding: 20px; border-radius: 12px; border: 1px solid rgba(0,0,0,.1); }
      .btn { display:inline-block; padding:10px 16px; border-radius:8px; text-decoration:none; background:#111827; color:#fff; }
      .muted { color: #6b7280; font-size: 12px; }
      code { word-break: break-all; }
    </style>
  </head>
  <body>
    <div class="card">
      ${body}
    </div>
  </body>
  </html>`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");
    if (!token) {
      return new Response(
        htmlPage("Invalid link", `<h2>Invalid or missing token</h2><p>Please use the latest confirmation email we sent you.</p>`),
        { status: 400, headers: { "Content-Type": "text/html", ...corsHeaders } }
      );
    }

    // Find token
    const nowIso = new Date().toISOString();
    const { data: tokenRow, error: tokenErr } = await supabase
      .from('magic_link_tokens')
      .select('id, user_id, action, payload, expires_at, used_at')
      .eq('token', token)
      .gt('expires_at', nowIso)
      .is('used_at', null)
      .maybeSingle();

    if (tokenErr) throw tokenErr;
    if (!tokenRow || tokenRow.action !== 'confirm_superbill_request') {
      return new Response(
        htmlPage("Link expired", `<h2>This link is invalid or has expired</h2><p>Please request a new confirmation email.</p>`),
        { status: 400, headers: { "Content-Type": "text/html", ...corsHeaders } }
      );
    }

    const payload = (tokenRow as any).payload || {};

    // Create the superbill request
    const insertPayload: any = {
      created_by: tokenRow.user_id,
      notes: payload.notes ?? null,
      preferred_delivery: payload.preferred_delivery ?? 'email',
      from_date: payload.from_date ?? null,
      to_date: payload.to_date ?? null,
    };

    const { error: insertErr } = await supabase
      .from('superbill_requests')
      .insert(insertPayload);
    if (insertErr) throw insertErr;

    // Mark token as used
    const { error: updateErr } = await supabase
      .from('magic_link_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('id', (tokenRow as any).id);
    if (updateErr) throw updateErr;

    const body = `
      <h2>Request confirmed</h2>
      <p>Thanks! We've recorded your superbill request and will start processing it.</p>
      <p class="muted">You can close this window now.</p>
    `;

    return new Response(htmlPage('Request confirmed', body), {
      status: 200,
      headers: { "Content-Type": "text/html", ...corsHeaders },
    });
  } catch (error: any) {
    console.error('confirm-superbill error', error);
    return new Response(
      htmlPage('Something went wrong', `<h2>Something went wrong</h2><p>${(error?.message || 'Unknown error')}</p>`),
      { status: 500, headers: { "Content-Type": "text/html", ...corsHeaders } }
    );
  }
});
