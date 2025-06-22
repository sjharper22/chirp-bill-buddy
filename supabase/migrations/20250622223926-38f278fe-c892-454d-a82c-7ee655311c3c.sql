
-- Create visits table to store individual patient visits
CREATE TABLE public.visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  visit_date DATE NOT NULL,
  icd_codes JSONB DEFAULT '[]'::jsonb,
  cpt_codes JSONB DEFAULT '[]'::jsonb,
  main_complaints JSONB DEFAULT '[]'::jsonb,
  fee DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  status TEXT DEFAULT 'unbilled' CHECK (status IN ('unbilled', 'billed', 'included_in_superbill')),
  superbill_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_visits_patient_id ON public.visits(patient_id);
CREATE INDEX idx_visits_status ON public.visits(status);
CREATE INDEX idx_visits_visit_date ON public.visits(visit_date);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_visits_updated_at
  BEFORE UPDATE ON public.visits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_timestamp();

-- Create a junction table for superbill-visit relationships
CREATE TABLE public.superbill_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  superbill_id TEXT NOT NULL,
  visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(superbill_id, visit_id)
);

-- Add index for the junction table
CREATE INDEX idx_superbill_visits_superbill_id ON public.superbill_visits(superbill_id);
CREATE INDEX idx_superbill_visits_visit_id ON public.superbill_visits(visit_id);
