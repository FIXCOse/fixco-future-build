-- Policy: Admins and owners can select all customers
CREATE POLICY "customers_select_admin"
ON customers
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
);