import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotifyPayload {
  email: string;
  name?: string;
  delivery?: string;
  from_date?: string | null;
  to_date?: string | null;
  notes?: string;
  submitted_at?: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const body: NotifyPayload = await req.json();
    if (!body?.email) {
      return new Response(JSON.stringify({ error: "Missing email" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const name = body.name || "Patient";
    const subject = `We received your superbill request`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; color:#1f2937; line-height:1.6;">
        <h2 style="margin:0 0 12px;">Thank you, ${name}!</h2>
        <p>We've received your superbill request and will start processing it shortly.</p>
        <table style="margin:16px 0; border-collapse:collapse; width:100%; max-width:560px;">
          <tbody>
            ${body.delivery ? `<tr><td style="padding:6px 8px; color:#6b7280;">Preferred delivery</td><td style="padding:6px 8px; font-weight:600;">${body.delivery}</td></tr>` : ""}
            ${body.from_date ? `<tr><td style=\"padding:6px 8px; color:#6b7280;\">From date</td><td style=\"padding:6px 8px; font-weight:600;\">${body.from_date}</td></tr>` : ""}
            ${body.to_date ? `<tr><td style=\"padding:6px 8px; color:#6b7280;\">To date</td><td style=\"padding:6px 8px; font-weight:600;\">${body.to_date}</td></tr>` : ""}
          </tbody>
        </table>
        ${body.notes ? `<p style="margin:0 0 8px;"><strong>Your notes:</strong><br/>${body.notes.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>` : ""}
        <p style="margin-top:16px; color:#6b7280; font-size:14px;">Submitted ${body.submitted_at ? new Date(body.submitted_at).toLocaleString('en-US', { timeZone: 'UTC' }) + ' UTC' : 'just now'}.</p>
        <p style="margin-top:16px; color:#6b7280; font-size:12px;">If you didn’t submit this request, please ignore this email.</p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: "Superbill Portal <onboarding@resend.dev>",
      to: [body.email],
      subject,
      html,
    });

    if (error) throw error;

    console.log("notify-superbill-request email sent", { to: body.email, id: (data as any)?.id });

    return new Response(JSON.stringify({ ok: true, id: (data as any)?.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err: any) {
    console.error("notify-superbill-request error", err);
    return new Response(JSON.stringify({ error: err?.message || "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
