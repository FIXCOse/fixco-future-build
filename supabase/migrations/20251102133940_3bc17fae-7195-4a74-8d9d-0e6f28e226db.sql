-- Enable RLS on audit_log (already enabled but for clarity)
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Policy: Admins and owners can view all audit logs
CREATE POLICY "Admins and owners can view audit logs"
ON audit_log
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'owner')
  )
);

-- Policy: Admins and owners can create audit logs (for manual logging from frontend)
CREATE POLICY "Admins and owners can create audit logs"
ON audit_log
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'owner')
  )
);

-- Policy: Service role can always insert (for RPC functions and backend logging)
CREATE POLICY "Service role can insert audit logs"
ON audit_log
FOR INSERT
TO service_role
WITH CHECK (true);