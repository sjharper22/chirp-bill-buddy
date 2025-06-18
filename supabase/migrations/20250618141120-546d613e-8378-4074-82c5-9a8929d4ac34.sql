
-- Create enum for appointment status
CREATE TYPE public.appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');

-- Create enum for appointment types
CREATE TYPE public.appointment_type AS ENUM ('consultation', 'follow_up', 'procedure', 'lab_work', 'imaging', 'therapy', 'emergency');

-- Create enum for recurrence patterns
CREATE TYPE public.recurrence_pattern AS ENUM ('none', 'daily', 'weekly', 'monthly', 'yearly');

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  appointment_type appointment_type NOT NULL DEFAULT 'consultation',
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  status appointment_status NOT NULL DEFAULT 'scheduled',
  provider_name TEXT,
  location TEXT,
  notes TEXT,
  
  -- Recurring appointment fields
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  recurrence_pattern recurrence_pattern NOT NULL DEFAULT 'none',
  recurrence_interval INTEGER DEFAULT 1, -- every X days/weeks/months
  recurrence_end_date DATE,
  parent_appointment_id UUID REFERENCES public.appointments(id),
  
  -- Reminder settings
  send_reminder BOOLEAN NOT NULL DEFAULT true,
  reminder_minutes_before INTEGER DEFAULT 60,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add constraint to ensure end_time is after start_time
ALTER TABLE public.appointments 
ADD CONSTRAINT appointments_end_time_after_start_time 
CHECK (end_time > start_time);

-- Add constraint to ensure duration matches time difference
ALTER TABLE public.appointments 
ADD CONSTRAINT appointments_duration_matches_time_diff 
CHECK (duration_minutes = EXTRACT(EPOCH FROM (end_time - start_time))/60);

-- Enable Row Level Security
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for appointments
CREATE POLICY "Users can view all appointments" 
  ON public.appointments 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create appointments" 
  ON public.appointments 
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update appointments they created" 
  ON public.appointments 
  FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete appointments they created" 
  ON public.appointments 
  FOR DELETE 
  USING (auth.uid() = created_by);

-- Create indexes for better performance
CREATE INDEX idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX idx_appointments_start_time ON public.appointments(start_time);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_appointments_created_by ON public.appointments(created_by);
CREATE INDEX idx_appointments_parent_appointment ON public.appointments(parent_appointment_id);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_timestamp();
