-- Add admin SELECT policy for invoices
CREATE POLICY "invoices_select_admin"
ON invoices
FOR SELECT
USING (is_admin_or_owner());

-- Update INSERT policy (security improvement)
DROP POLICY IF EXISTS "invoices_insert_service" ON invoices;
CREATE POLICY "invoices_insert_admin"
ON invoices
FOR INSERT
WITH CHECK (is_admin_or_owner());

-- Update UPDATE policy (security improvement)
DROP POLICY IF EXISTS "invoices_update_service" ON invoices;
CREATE POLICY "invoices_update_admin"
ON invoices
FOR UPDATE
USING (is_admin_or_owner());

-- Add DELETE policy (was missing)
CREATE POLICY "invoices_delete_admin"
ON invoices
FOR DELETE
USING (is_admin_or_owner());