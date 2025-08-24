-- First, let's check and fix the quotes table structure and RLS
-- Add created_by column to quotes if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'created_by') THEN
    ALTER TABLE quotes ADD COLUMN created_by UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Update existing quotes to have created_by (use customer_id as fallback)
UPDATE quotes SET created_by = customer_id WHERE created_by IS NULL;

-- Create helper function for admin roles
CREATE OR REPLACE FUNCTION public.is_admin_or_owner(uid uuid DEFAULT auth.uid())
RETURNS boolean 
LANGUAGE sql 
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS(
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role IN ('owner','admin')
  );
$$;

-- Drop existing policies and create new ones
DROP POLICY IF EXISTS "quotes_select_customer_or_org" ON quotes;
DROP POLICY IF EXISTS "quotes_insert_customer_or_org" ON quotes;
DROP POLICY IF EXISTS "quotes_update_customer_or_org" ON quotes;

-- New RLS policies for quotes
CREATE POLICY "quotes_select_creator_customer_admin" ON quotes
FOR SELECT USING (
  created_by = auth.uid() OR 
  customer_id = auth.uid() OR 
  is_admin_or_owner(auth.uid()) OR
  (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
);

CREATE POLICY "quotes_insert_creator_admin" ON quotes
FOR INSERT WITH CHECK (
  created_by = auth.uid() OR 
  is_admin_or_owner(auth.uid()) OR
  (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
);

CREATE POLICY "quotes_update_creator_admin" ON quotes
FOR UPDATE USING (
  created_by = auth.uid() OR 
  is_admin_or_owner(auth.uid()) OR
  (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
);

-- Ensure profiles RLS allows admins to see all users
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;

CREATE POLICY "profiles_select_own_or_admin" ON profiles
FOR SELECT USING (
  id = auth.uid() OR 
  is_admin_or_owner(auth.uid())
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS quotes_created_at_idx ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS quotes_status_idx ON quotes(status);
CREATE INDEX IF NOT EXISTS quotes_customer_idx ON quotes(customer_id);
CREATE INDEX IF NOT EXISTS quotes_created_by_idx ON quotes(created_by);

-- Ensure profiles table has all needed columns
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'company_name') THEN
    ALTER TABLE profiles ADD COLUMN company_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'org_number') THEN  
    ALTER TABLE profiles ADD COLUMN org_number TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'user_type') THEN
    ALTER TABLE profiles ADD COLUMN user_type TEXT DEFAULT 'private';
  END IF;
END $$;

-- Enable realtime for quotes and profiles
ALTER TABLE quotes REPLICA IDENTITY FULL;
ALTER TABLE profiles REPLICA IDENTITY FULL;