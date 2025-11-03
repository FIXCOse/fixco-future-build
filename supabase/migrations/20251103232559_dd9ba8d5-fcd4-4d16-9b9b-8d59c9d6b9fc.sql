-- Enable RLS on customers table (if not already enabled)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Policy: Admins and owners can insert customers
CREATE POLICY "customers_insert_admin"
ON customers
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
);

-- Policy: Admins and owners can update customers
CREATE POLICY "customers_update_admin"
ON customers
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
);

-- Policy: Admins and owners can delete customers
CREATE POLICY "customers_delete_admin"
ON customers
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
);