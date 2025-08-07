import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { createSuperbillRequest } from "@/services/superbillRequestService";
import { getMySuperbillRequestPrefs, upsertMySuperbillRequestPrefs } from "@/services/superbillRequestPrefsService";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export default function RequestSuperbill() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [patientName, setPatientName] = useState("");
  const [patientDob, setPatientDob] = useState<string>("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [delivery, setDelivery] = useState("email");
  const [rememberDefaults, setRememberDefaults] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // SEO meta
  useEffect(() => {
    document.title = "Request Superbill – Patient Portal";
    const desc = "Patient superbill request form: request a new or updated superbill quickly.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.href);
  }, []);

  useEffect(() => {
    const load = async () => {
      if (user) {
        setEmail(user.email ?? "");
        try {
          const prefs = await getMySuperbillRequestPrefs();
          if (prefs) {
            setDelivery((prefs as any).default_delivery || "email");
            if (prefs.default_notes) setNotes(prefs.default_notes);
          }
        } catch (e) {
          console.warn('Failed to load request prefs', e);
        }
      }
    };
    load();
  }, [user]);

  const canSubmit = useMemo(() => {
    return !!email && !!notes && !submitting;
  }, [email, notes, submitting]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to submit a superbill request.",
        variant: "destructive",
      });
      return;
    }
    try {
      setSubmitting(true);
      await createSuperbillRequest(user.id, {
        patient_name: patientName || undefined,
        patient_dob: patientDob ? new Date(patientDob) : null,
        contact_email: email,
        contact_phone: phone || undefined,
        from_date: fromDate ? new Date(fromDate) : null,
        to_date: toDate ? new Date(toDate) : null,
        notes,
        preferred_delivery: delivery as any,
      });
      // Send confirmation email (non-blocking)
      try {
        await supabase.functions.invoke('notify-superbill-request', {
          body: {
            email,
            name: patientName || (user.email ?? 'Patient'),
            delivery,
            from_date: fromDate || null,
            to_date: toDate || null,
            notes,
            submitted_at: new Date().toISOString(),
          },
        });
      } catch (emailErr) {
        console.warn('Email notification failed', emailErr);
      }

      if (rememberDefaults) {
        try {
          await upsertMySuperbillRequestPrefs({
            default_delivery: delivery as any,
            default_notes: notes,
          });
          toast({ title: "Preferences saved", description: "We'll prefill your next request." });
        } catch (prefErr: any) {
          console.warn('Failed to save prefs', prefErr);
        }
      }
      toast({ title: "Request submitted", description: "We will notify you when it's ready." });
      setPatientName("");
      setPatientDob("");
      setPhone("");
      setFromDate("");
      setToDate("");
      setNotes("");
      setDelivery("email");
      setRememberDefaults(false);
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto max-w-3xl p-4 sm:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Request a Superbill</h1>
        <p className="text-sm text-muted-foreground mt-1">Secure patient form to request a new or updated superbill.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="patientName">Full name</Label>
                <Input id="patientName" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Jane Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of birth</Label>
                <Input id="dob" type="date" value={patientDob} onChange={(e) => setPatientDob(e.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Contact email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="from">From date (optional)</Label>
                <Input id="from" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to">To date (optional)</Label>
                <Input id="to" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">What do you need on the superbill?</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., visits from March, include ICD/CPT updates, etc." rows={5} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery">Preferred delivery</Label>
              <select id="delivery" className="border-input bg-background text-foreground rounded-md px-3 py-2" value={delivery} onChange={(e) => setDelivery(e.target.value)}>
                <option value="email">Email</option>
                <option value="portal">Portal</option>
                <option value="print">Printed copy</option>
              </select>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Checkbox id="rememberDefaults" checked={rememberDefaults} onCheckedChange={(v) => setRememberDefaults(!!v)} />
                <Label htmlFor="rememberDefaults" className="text-sm text-muted-foreground">Save these as my defaults</Label>
              </div>
              <Button type="submit" disabled={!canSubmit}>
                {submitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
          {!user && (
            <p className="text-xs text-muted-foreground mt-4">You must sign in to submit. Use the Sign In link in the top-right.</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
