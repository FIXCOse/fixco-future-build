-- Fix RLS policies for services table to ensure proper admin access

-- First, drop existing policies
DROP POLICY IF EXISTS "Admin can manage services" ON public.services;
DROP POLICY IF EXISTS "Services are publicly readable" ON public.services;

-- Create more specific and reliable policies
-- Public can read active services
CREATE POLICY "services_select_public" 
ON public.services 
FOR SELECT 
TO public 
USING (is_active = true);

-- Admin/Owner can select all services
CREATE POLICY "services_select_admin" 
ON public.services 
FOR SELECT 
TO authenticated 
USING (is_admin_or_owner());

-- Admin/Owner can insert services
CREATE POLICY "services_insert_admin" 
ON public.services 
FOR INSERT 
TO authenticated 
WITH CHECK (is_admin_or_owner());

-- Admin/Owner can update services
CREATE POLICY "services_update_admin" 
ON public.services 
FOR UPDATE 
TO authenticated 
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

-- Admin/Owner can delete services (soft delete by setting is_active = false)
CREATE POLICY "services_delete_admin" 
ON public.services 
FOR DELETE 
TO authenticated 
USING (is_admin_or_owner());

-- Also ensure RLS is enabled
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Drop existing trigger if it exists and recreate
DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_services_updated_at();