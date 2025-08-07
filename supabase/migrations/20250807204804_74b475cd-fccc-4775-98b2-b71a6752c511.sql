-- 1) Add 'patient' role to app_role enum if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'app_role' AND e.enumlabel = 'patient') THEN
    ALTER TYPE public.app_role ADD VALUE 'patient';
  END IF;
END $$;

-- 2) Create request_status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_status') THEN
    CREATE TYPE public.request_status AS ENUM ('pending','in_progress','completed','rejected');
  END IF;
END $$;

-- 3) Create superbill_requests table
CREATE TABLE IF NOT EXISTS public.superbill_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL,
  patient_id UUID NULL,
  patient_name TEXT,
  patient_dob DATE,
  contact_email TEXT,
  contact_phone TEXT,
  from_date DATE,
  to_date DATE,
  notes TEXT,
  preferred_delivery TEXT DEFAULT 'email',
  fulfillment_superbill_id TEXT,
  status request_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4) Enable RLS
ALTER TABLE public.superbill_requests ENABLE ROW LEVEL SECURITY;

-- 5) Policies
-- Patients (any authenticated user) can create their own requests
DROP POLICY IF EXISTS "Users can create their own superbill requests" ON public.superbill_requests;
CREATE POLICY "Users can create their own superbill requests"
ON public.superbill_requests
FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Users can view their own requests
DROP POLICY IF EXISTS "Users can view their own superbill requests" ON public.superbill_requests;
CREATE POLICY "Users can view their own superbill requests"
ON public.superbill_requests
FOR SELECT
USING (auth.uid() = created_by);

-- Admins and editors can view all requests
DROP POLICY IF EXISTS "Admins and editors can view all superbill requests" ON public.superbill_requests;
CREATE POLICY "Admins and editors can view all superbill requests"
ON public.superbill_requests
FOR SELECT
USING (has_role('admin') OR has_role('editor'));

-- Admins and editors can update requests
DROP POLICY IF EXISTS "Admins and editors can update superbill requests" ON public.superbill_requests;
CREATE POLICY "Admins and editors can update superbill requests"
ON public.superbill_requests
FOR UPDATE
USING (has_role('admin') OR has_role('editor'));

-- Only admins can delete requests
DROP POLICY IF EXISTS "Only admins can delete superbill requests" ON public.superbill_requests;
CREATE POLICY "Only admins can delete superbill requests"
ON public.superbill_requests
FOR DELETE
USING (has_role('admin'));

-- 6) Update trigger for updated_at
DROP TRIGGER IF EXISTS update_superbill_requests_updated_at ON public.superbill_requests;
CREATE TRIGGER update_superbill_requests_updated_at
BEFORE UPDATE ON public.superbill_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();