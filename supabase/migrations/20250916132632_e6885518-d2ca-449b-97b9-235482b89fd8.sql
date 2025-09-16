-- Fix security issue: Restrict appointment access to authenticated users only
-- Remove the overly permissive policy that allows anyone to view appointments
DROP POLICY IF EXISTS "Users can view all appointments" ON public.appointments;

-- Create a secure policy that only allows authenticated users to view appointments
-- This ensures patient appointment data is protected from unauthorized access
CREATE POLICY "Authenticated users can view appointments" 
ON public.appointments 
FOR SELECT 
USING (auth.role() = 'authenticated'::text);