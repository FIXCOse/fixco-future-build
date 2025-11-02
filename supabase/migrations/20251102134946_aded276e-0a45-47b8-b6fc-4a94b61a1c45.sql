-- Drop befintliga policies för audit_log
DROP POLICY IF EXISTS "Admins and owners can view audit logs" ON audit_log;
DROP POLICY IF EXISTS "Admins and owners can create audit logs" ON audit_log;
DROP POLICY IF EXISTS "Service role can insert audit logs" ON audit_log;

-- Skapa nya policies som använder is_admin_or_owner() security definer funktionen
CREATE POLICY "audit_log_select_admin"
ON audit_log
FOR SELECT
TO authenticated
USING (public.is_admin_or_owner());

CREATE POLICY "audit_log_insert_admin"
ON audit_log
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin_or_owner());

-- Service role policy för backend logging från edge functions
CREATE POLICY "audit_log_insert_service"
ON audit_log
FOR INSERT
TO service_role
WITH CHECK (true);