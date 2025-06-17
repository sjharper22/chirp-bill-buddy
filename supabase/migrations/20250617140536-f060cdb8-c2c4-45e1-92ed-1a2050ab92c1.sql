
-- Add new columns to the patients table for enhanced demographics and contact management
ALTER TABLE public.patients 
ADD COLUMN address_line1 TEXT,
ADD COLUMN address_line2 TEXT,
ADD COLUMN city TEXT,
ADD COLUMN state TEXT,
ADD COLUMN zip_code TEXT,
ADD COLUMN country TEXT DEFAULT 'US',
ADD COLUMN preferred_communication TEXT DEFAULT 'phone' CHECK (preferred_communication IN ('phone', 'email', 'text', 'portal')),
ADD COLUMN emergency_contact_name TEXT,
ADD COLUMN emergency_contact_phone TEXT,
ADD COLUMN emergency_contact_relationship TEXT,
ADD COLUMN insurance_provider TEXT,
ADD COLUMN insurance_policy_number TEXT,
ADD COLUMN insurance_group_number TEXT,
ADD COLUMN insurance_subscriber_name TEXT,
ADD COLUMN insurance_subscriber_dob DATE,
ADD COLUMN secondary_phone TEXT,
ADD COLUMN work_phone TEXT,
ADD COLUMN occupation TEXT,
ADD COLUMN employer TEXT,
ADD COLUMN marital_status TEXT CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed', 'separated', 'other')),
ADD COLUMN gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
ADD COLUMN avatar_url TEXT,
ADD COLUMN patient_status TEXT DEFAULT 'active' CHECK (patient_status IN ('active', 'inactive', 'discharged', 'deceased')),
ADD COLUMN referring_physician TEXT,
ADD COLUMN primary_care_physician TEXT,
ADD COLUMN allergies TEXT,
ADD COLUMN medications TEXT,
ADD COLUMN medical_history TEXT;

-- Create a separate table for family/relationship tracking
CREATE TABLE public.patient_relationships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  related_patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN ('spouse', 'parent', 'child', 'sibling', 'guardian', 'emergency_contact', 'other')),
  related_person_name TEXT,
  related_person_phone TEXT,
  related_person_email TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add trigger for updated_at timestamp on patient_relationships
CREATE TRIGGER update_patient_relationships_timestamp
  BEFORE UPDATE ON public.patient_relationships
  FOR EACH ROW
  EXECUTE FUNCTION public.update_timestamp();

-- Enable RLS on patient_relationships table
ALTER TABLE public.patient_relationships ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for patient_relationships (assuming patients are linked to users through created_by)
CREATE POLICY "Users can view patient relationships they created" 
  ON public.patient_relationships 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.patients 
      WHERE patients.id = patient_relationships.patient_id 
      AND patients.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create patient relationships for their patients" 
  ON public.patient_relationships 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.patients 
      WHERE patients.id = patient_relationships.patient_id 
      AND patients.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update patient relationships for their patients" 
  ON public.patient_relationships 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.patients 
      WHERE patients.id = patient_relationships.patient_id 
      AND patients.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete patient relationships for their patients" 
  ON public.patient_relationships 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.patients 
      WHERE patients.id = patient_relationships.patient_id 
      AND patients.created_by = auth.uid()
    )
  );
