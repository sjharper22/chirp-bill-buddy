-- Create the update timestamp function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create superbills table to store superbill data
CREATE TABLE public.superbills (
  id text NOT NULL PRIMARY KEY,
  patient_name text NOT NULL,
  patient_dob date NOT NULL,
  patient_id uuid REFERENCES public.patients(id),
  issue_date date NOT NULL,
  clinic_name text NOT NULL,
  clinic_address text NOT NULL,
  clinic_phone text NOT NULL,
  clinic_email text NOT NULL,
  ein text NOT NULL,
  npi text NOT NULL,
  provider_name text NOT NULL,
  default_icd_codes jsonb DEFAULT '[]'::jsonb,
  default_cpt_codes jsonb DEFAULT '[]'::jsonb,
  default_main_complaints jsonb DEFAULT '[]'::jsonb,
  default_fee numeric DEFAULT 0,
  visits jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'draft',
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.superbills ENABLE ROW LEVEL SECURITY;

-- Create policies for superbills
CREATE POLICY "Users can view superbills they created"
ON public.superbills
FOR SELECT
USING (auth.uid() = created_by);

CREATE POLICY "Users can create superbills"
ON public.superbills
FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own superbills"
ON public.superbills
FOR UPDATE
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own superbills"
ON public.superbills
FOR DELETE
USING (auth.uid() = created_by);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_superbills_updated_at
BEFORE UPDATE ON public.superbills
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();