-- Fix security warnings for newly created functions

-- Update is_owner function with proper search path
CREATE OR REPLACE FUNCTION public.is_owner(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.profiles 
    WHERE id = user_uuid AND role = 'owner'
  )
$$;

-- Update is_admin_or_owner function with proper search path
CREATE OR REPLACE FUNCTION public.is_admin_or_owner(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.profiles 
    WHERE id = user_uuid AND role IN ('owner','admin')
  )
$$;