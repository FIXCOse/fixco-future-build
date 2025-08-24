-- Work with existing function and add missing pieces
-- Add created_by column to quotes if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quotes' AND column_name = 'created_by') THEN
    ALTER TABLE quotes ADD COLUMN created_by UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Update existing quotes to have created_by (use customer_id as fallback)
UPDATE quotes SET created_by = customer_id WHERE created_by IS NULL;

-- Drop existing quote policies and create new ones
DROP POLICY IF EXISTS "quotes_select_customer_or_org" ON quotes;
DROP POLICY IF EXISTS "quotes_insert_customer_or_org" ON quotes;
DROP POLICY IF EXISTS "quotes_update_customer_or_org" ON quotes;

-- New RLS policies for quotes using existing is_admin_or_owner function
CREATE POLICY "quotes_select_creator_customer_admin" ON quotes
FOR SELECT USING (
  created_by = auth.uid() OR 
  customer_id = auth.uid() OR 
  is_admin_or_owner() OR
  (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
);

CREATE POLICY "quotes_insert_creator_admin" ON quotes
FOR INSERT WITH CHECK (
  created_by = auth.uid() OR 
  is_admin_or_owner() OR
  (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
);

CREATE POLICY "quotes_update_creator_admin" ON quotes
FOR UPDATE USING (
  created_by = auth.uid() OR 
  is_admin_or_owner() OR
  (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
);

-- Update profiles RLS to allow admins to see all users
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON profiles;

CREATE POLICY "profiles_select_own_or_admin" ON profiles
FOR SELECT USING (
  id = auth.uid() OR 
  is_admin_or_owner()
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS quotes_created_at_idx ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS quotes_status_idx ON quotes(status);
CREATE INDEX IF NOT EXISTS quotes_customer_idx ON quotes(customer_id);
CREATE INDEX IF NOT EXISTS quotes_created_by_idx ON quotes(created_by);

-- Enable realtime for quotes and profiles
ALTER TABLE quotes REPLICA IDENTITY FULL;
ALTER TABLE profiles REPLICA IDENTITY FULL;