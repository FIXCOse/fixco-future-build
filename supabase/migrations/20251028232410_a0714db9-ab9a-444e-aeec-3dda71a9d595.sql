-- Fix type mismatch in has_role function by explicitly casting enum to text
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = _user_id 
    AND role::text = _role
  )
$$;