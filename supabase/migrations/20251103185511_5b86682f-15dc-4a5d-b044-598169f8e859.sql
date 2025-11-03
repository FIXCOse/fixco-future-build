-- Debug functions för auth troubleshooting
CREATE OR REPLACE FUNCTION public.debug_auth_context()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  result jsonb;
BEGIN
  result := jsonb_build_object(
    'auth_uid', auth.uid(),
    'auth_email', auth.email(),
    'auth_role', auth.role(),
    'user_roles', (
      SELECT jsonb_agg(role)
      FROM user_roles
      WHERE user_id = auth.uid()
    )
  );
  
  RETURN result;
END;
$$;

-- Lägg till RLS policy på user_roles så authenticated users kan läsa den
DROP POLICY IF EXISTS "Authenticated users can read user_roles" ON user_roles;
CREATE POLICY "Authenticated users can read user_roles"
ON user_roles FOR SELECT
TO authenticated
USING (true);

-- Förbättrade RLS policies med email fallback för bookings
DROP POLICY IF EXISTS "Admins and owners can view all bookings" ON bookings;
CREATE POLICY "Admins and owners can view all bookings"
ON bookings FOR SELECT
TO authenticated
USING (
  -- Check via user_roles table
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
  OR
  -- Email fallback för specifika admin-accounts
  auth.email() IN ('omar@fixco.se', 'imedashviliomar@gmail.com')
);

-- Förbättrade RLS policies med email fallback för leads
DROP POLICY IF EXISTS "Admins and owners can view all leads" ON leads;
CREATE POLICY "Admins and owners can view all leads"
ON leads FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
  OR
  auth.email() IN ('omar@fixco.se', 'imedashviliomar@gmail.com')
);

-- Förbättrade RLS policies med email fallback för job_requests
DROP POLICY IF EXISTS "Admins and owners can view all job requests" ON job_requests;
CREATE POLICY "Admins and owners can view all job requests"
ON job_requests FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
  OR
  auth.email() IN ('omar@fixco.se', 'imedashviliomar@gmail.com')
);

DROP POLICY IF EXISTS "Admins and owners can manage all job requests" ON job_requests;
CREATE POLICY "Admins and owners can manage all job requests"
ON job_requests FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
  OR
  auth.email() IN ('omar@fixco.se', 'imedashviliomar@gmail.com')
);

-- Lägg till admin policies för leads (INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Admins and owners can manage all leads" ON leads;
CREATE POLICY "Admins and owners can manage all leads"
ON leads FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
  OR
  auth.email() IN ('omar@fixco.se', 'imedashviliomar@gmail.com')
);

-- Lägg till admin policies för bookings (UPDATE, DELETE)
DROP POLICY IF EXISTS "Admins and owners can manage all bookings" ON bookings;
CREATE POLICY "Admins and owners can manage all bookings"
ON bookings FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
  OR
  auth.email() IN ('omar@fixco.se', 'imedashviliomar@gmail.com')
);