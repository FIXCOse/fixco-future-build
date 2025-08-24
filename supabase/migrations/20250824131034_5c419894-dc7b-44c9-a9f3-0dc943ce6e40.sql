-- Complete role-based access system setup (corrected)

-- 1) Update profiles table with proper role constraints
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS owner_onboarded BOOLEAN DEFAULT false;

-- Update role column to have proper constraints
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('owner','admin','manager','technician','finance','support','customer'));

-- 2) Create security functions (avoid recursion)
CREATE OR REPLACE FUNCTION public.is_owner(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.profiles 
    WHERE id = user_uuid AND role = 'owner'
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_owner(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.profiles 
    WHERE id = user_uuid AND role IN ('owner','admin')
  )
$$;

-- 3) Set omar@fixco.se as owner (seed data)
UPDATE public.profiles 
SET role = 'owner' 
WHERE email = 'omar@fixco.se';

-- 4) Create staff table for personnel management
CREATE TABLE IF NOT EXISTS public.staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  personal_number text,
  email text,
  phone text,
  role text CHECK (role IN ('technician', 'manager', 'finance', 'support')),
  hourly_rate numeric(10,2),
  active boolean DEFAULT true,
  notes text,
  starts_at date,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on staff table
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Staff policies - only admin/owner can manage
CREATE POLICY "staff_admin_owner_all" ON public.staff
  FOR ALL USING (is_admin_or_owner());

-- 5) Create system settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  description text,
  updated_by uuid REFERENCES auth.users(id),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on system settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- System settings policies - only admin/owner can manage
CREATE POLICY "system_settings_admin_owner_all" ON public.system_settings
  FOR ALL USING (is_admin_or_owner());

-- 6) Update triggers for updated_at
CREATE TRIGGER update_staff_updated_at
  BEFORE UPDATE ON public.staff
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 7) Insert default system settings
INSERT INTO public.system_settings (key, value, description) VALUES
  ('company_info', '{"name": "Fixco", "email": "info@fixco.se", "phone": "+46 70 123 45 67", "address": "", "postal_code": "", "city": ""}', 'Företagsinformation'),
  ('default_rot_percentage', '30', 'Standard ROT-avdrag procent'),
  ('whatsapp_enabled', 'true', 'WhatsApp chat aktiverad'),
  ('offer_wizard_enabled', 'true', 'Offertguide aktiverad'),
  ('force_2fa', 'false', 'Tvinga 2FA för alla användare')
ON CONFLICT (key) DO NOTHING;

-- 8) Insert default feature flags (only key and enabled, skip description)
INSERT INTO public.feature_flags (key, enabled) VALUES
  ('user_dashboard', true),
  ('admin_dashboard', true),
  ('staff_management', true),
  ('advanced_reporting', true)
ON CONFLICT (key) DO NOTHING;