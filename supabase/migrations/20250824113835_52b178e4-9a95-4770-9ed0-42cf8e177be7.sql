-- Fix security warnings by setting search_path for functions

-- Update set_single_primary_property function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update make_property_primary function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update handle_new_user function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update is_admin function
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM user_roles 
    WHERE user_id = user_uuid 
    AND role IN ('owner','admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;