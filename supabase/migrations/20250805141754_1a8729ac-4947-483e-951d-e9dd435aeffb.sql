-- CRITICAL SECURITY FIXES: Enable RLS and implement proper access controls

-- 1. Enable RLS on visits table (CRITICAL - currently unprotected)
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- 2. Enable RLS on superbill_visits table (CRITICAL - currently unprotected)  
ALTER TABLE public.superbill_visits ENABLE ROW LEVEL SECURITY;

-- 3. Create comprehensive RLS policies for visits table
-- Users can view visits for patients they have access to (through patient RLS)
CREATE POLICY "Users can view visits for accessible patients" 
ON public.visits 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.patients 
    WHERE patients.id = visits.patient_id
  )
);

-- Admins and editors can create visits for any patient they can access
CREATE POLICY "Admins and editors can create visits" 
ON public.visits 
FOR INSERT 
WITH CHECK (
  (has_role('admin'::app_role) OR has_role('editor'::app_role))
  AND EXISTS (
    SELECT 1 FROM public.patients 
    WHERE patients.id = visits.patient_id
  )
);

-- Admins and editors can update visits for patients they can access
CREATE POLICY "Admins and editors can update visits" 
ON public.visits 
FOR UPDATE 
USING (
  (has_role('admin'::app_role) OR has_role('editor'::app_role))
  AND EXISTS (
    SELECT 1 FROM public.patients 
    WHERE patients.id = visits.patient_id
  )
);

-- Only admins can delete visits
CREATE POLICY "Only admins can delete visits" 
ON public.visits 
FOR DELETE 
USING (has_role('admin'::app_role));

-- 4. Create RLS policies for superbill_visits table
-- Users can view superbill-visit links for visits they can access
CREATE POLICY "Users can view superbill visits for accessible visits" 
ON public.superbill_visits 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.visits 
    WHERE visits.id = superbill_visits.visit_id
  )
);

-- Admins and editors can create superbill-visit links
CREATE POLICY "Admins and editors can create superbill visits" 
ON public.superbill_visits 
FOR INSERT 
WITH CHECK (
  (has_role('admin'::app_role) OR has_role('editor'::app_role))
  AND EXISTS (
    SELECT 1 FROM public.visits 
    WHERE visits.id = superbill_visits.visit_id
  )
);

-- Only admins can delete superbill-visit links
CREATE POLICY "Only admins can delete superbill visits" 
ON public.superbill_visits 
FOR DELETE 
USING (has_role('admin'::app_role));

-- 5. Fix database function security by setting proper search_path
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid DEFAULT auth.uid())
 RETURNS TABLE(role app_role)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id;
$function$;

CREATE OR REPLACE FUNCTION public.has_role(_role app_role, _user_id uuid DEFAULT auth.uid())
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
    AND role = _role
  );
$function$;

CREATE OR REPLACE FUNCTION public.update_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
BEGIN
  -- Create a profile entry
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  -- Check if this is the first user, make them admin
  IF (SELECT COUNT(*) FROM auth.users) = 1 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    -- Check if there's an invitation
    WITH invitation AS (
      SELECT id, role FROM public.invitations 
      WHERE email = NEW.email
      AND expires_at > now()
      LIMIT 1
    ),
    inserted_role AS (
      INSERT INTO public.user_roles (user_id, role)
      SELECT NEW.id, role FROM invitation
      RETURNING 1
    )
    -- If no invitation found, give viewer role
    INSERT INTO public.user_roles (user_id, role)
    SELECT NEW.id, 'viewer'
    WHERE NOT EXISTS (SELECT 1 FROM inserted_role);
    
    -- Delete the used invitation
    DELETE FROM public.invitations WHERE email = NEW.email;
  END IF;
  
  RETURN NEW;
END;
$function$;