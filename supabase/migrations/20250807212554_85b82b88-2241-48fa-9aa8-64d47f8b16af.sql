-- Create recurrence enum for request preferences
DO $$ BEGIN
  CREATE TYPE public.request_recurrence AS ENUM ('none', 'monthly', 'quarterly');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Create table for superbill request preferences
CREATE TABLE IF NOT EXISTS public.superbill_request_prefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  default_delivery TEXT NOT NULL DEFAULT 'email',
  default_notes TEXT,
  recurrence request_recurrence NOT NULL DEFAULT 'monthly',
  day_of_month INTEGER NOT NULL DEFAULT 1 CHECK (day_of_month BETWEEN 1 AND 28),
  auto_approve BOOLEAN NOT NULL DEFAULT true,
  notify_via_email BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.superbill_request_prefs ENABLE ROW LEVEL SECURITY;

-- Policies: owner can select/insert/update their prefs; only admins can delete
DO $$ BEGIN
  CREATE POLICY "Users can view their own request prefs"
  ON public.superbill_request_prefs
  FOR SELECT
  USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert their own request prefs"
  ON public.superbill_request_prefs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update their own request prefs"
  ON public.superbill_request_prefs
  FOR UPDATE
  USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Only admins can delete request prefs"
  ON public.superbill_request_prefs
  FOR DELETE
  USING (has_role('admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Timestamp trigger
DO $$ BEGIN
  CREATE TRIGGER update_superbill_request_prefs_updated_at
  BEFORE UPDATE ON public.superbill_request_prefs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Attempt to schedule daily runner for automated superbill requests via pg_cron (ignore if extension not available)
DO $$ BEGIN
  PERFORM cron.unschedule('daily-schedule-superbill-requests');
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DO $$ BEGIN
  PERFORM cron.schedule(
    'daily-schedule-superbill-requests',
    '0 8 * * *',
    $cron$
    select net.http_post(
      url := 'https://bjtspvoeiwyiqvtyuyin.supabase.co/functions/v1/schedule-superbill-requests',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqdHNwdm9laXd5aXF2dHl1eWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NjI3MjYsImV4cCI6MjA2MDQzODcyNn0.tUt4A9N62cpNoPwuXxxQXDmJjUPZyzfhuTwjixcYCFI"}'::jsonb,
      body := jsonb_build_object('invoked_by', 'cron', 'run_at', now())
    ) as request_id;
    $cron$
  );
EXCEPTION WHEN OTHERS THEN NULL; END $$;