-- Add property type and primary address columns
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS type text,
ADD COLUMN IF NOT EXISTS is_primary boolean NOT NULL DEFAULT false;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner','admin','staff','customer')),
  created_at timestamp with time zone DEFAULT now()
);

-- Unique primary address per user
CREATE UNIQUE INDEX IF NOT EXISTS uq_properties_primary_by_user
ON properties (owner_id)
WHERE is_primary = true AND owner_id IS NOT NULL;

-- Unique primary address per organization
CREATE UNIQUE INDEX IF NOT EXISTS uq_properties_primary_by_org
ON properties (organization_id)
WHERE is_primary = true AND organization_id IS NOT NULL;

-- Function to ensure single primary property
CREATE OR REPLACE FUNCTION set_single_primary_property()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary = true THEN
    -- Reset all other properties for the same owner
    IF NEW.owner_id IS NOT NULL THEN
      UPDATE properties
      SET is_primary = false
      WHERE owner_id = NEW.owner_id
        AND id <> NEW.id;
    END IF;
    
    -- Reset all other properties for the same organization
    IF NEW.organization_id IS NOT NULL THEN
      UPDATE properties
      SET is_primary = false
      WHERE organization_id = NEW.organization_id
        AND id <> NEW.id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trg_set_single_primary_property ON properties;
CREATE TRIGGER trg_set_single_primary_property
BEFORE INSERT OR UPDATE ON properties
FOR EACH ROW EXECUTE FUNCTION set_single_primary_property();

-- Function to make property primary
CREATE OR REPLACE FUNCTION make_property_primary(p_property_id uuid)
RETURNS void AS $$
DECLARE
  uid uuid := auth.uid();
  prop record;
BEGIN
  SELECT * INTO prop FROM properties WHERE id = p_property_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Property not found';
  END IF;

  -- Check ownership
  IF prop.owner_id IS NOT NULL AND prop.owner_id <> uid THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;
  
  IF prop.organization_id IS NOT NULL AND NOT is_organization_member(uid, prop.organization_id) THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;

  -- Reset all properties for this owner/org
  IF prop.owner_id IS NOT NULL THEN
    UPDATE properties SET is_primary = false WHERE owner_id = prop.owner_id;
  END IF;
  
  IF prop.organization_id IS NOT NULL THEN
    UPDATE properties SET is_primary = false WHERE organization_id = prop.organization_id;
  END IF;

  -- Set this property as primary
  UPDATE properties SET is_primary = true WHERE id = p_property_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle new user registration with role assignment
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  email text := NEW.email;
  role_to_set text := 'customer';
BEGIN
  -- Set role based on email domain
  IF email ILIKE '%@fixco.se' THEN
    role_to_set := 'admin';
  END IF;
  IF email ILIKE 'omar@fixco.se' THEN
    role_to_set := 'owner';
  END IF;

  -- Insert role
  INSERT INTO user_roles(user_id, role) 
  VALUES (NEW.id, role_to_set)
  ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new users
DROP TRIGGER IF EXISTS trg_handle_new_user ON auth.users;
CREATE TRIGGER trg_handle_new_user
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM user_roles 
    WHERE user_id = user_uuid 
    AND role IN ('owner','admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Update RLS policies to include admin access
DROP POLICY IF EXISTS properties_select_owner_or_org ON properties;
CREATE POLICY "properties_select_owner_or_org_or_admin" 
ON properties FOR SELECT 
USING (
  is_admin() OR 
  owner_id = auth.uid() OR 
  (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
);

DROP POLICY IF EXISTS properties_insert_owner_or_org_admin ON properties;
CREATE POLICY "properties_insert_owner_or_org_admin_or_admin" 
ON properties FOR INSERT 
WITH CHECK (
  is_admin() OR 
  owner_id = auth.uid() OR 
  (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
);

DROP POLICY IF EXISTS properties_update_owner_or_org_admin ON properties;
CREATE POLICY "properties_update_owner_or_org_admin_or_admin" 
ON properties FOR UPDATE 
USING (
  is_admin() OR 
  owner_id = auth.uid() OR 
  (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
);

DROP POLICY IF EXISTS properties_delete_owner_or_org_admin ON properties;
CREATE POLICY "properties_delete_owner_or_org_admin_or_admin" 
ON properties FOR DELETE 
USING (
  is_admin() OR 
  owner_id = auth.uid() OR 
  (organization_id IS NOT NULL AND is_organization_admin(auth.uid(), organization_id))
);

-- Enable RLS on user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- User can see their own role
CREATE POLICY "users_can_see_own_role" ON user_roles
FOR SELECT USING (user_id = auth.uid());

-- Admins can see all roles
CREATE POLICY "admins_can_see_all_roles" ON user_roles
FOR SELECT USING (is_admin());