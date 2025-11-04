-- Drop existing restrictive policy
DROP POLICY IF EXISTS "invoices_select_customer_or_org" ON invoices;

-- Create new policy with admin bypass
CREATE POLICY "invoices_select_customer_or_org_or_admin"
ON invoices FOR SELECT
USING (
  is_admin_or_owner() OR
  (customer_id = auth.uid()) OR
  ((organization_id IS NOT NULL) AND is_organization_member(auth.uid(), organization_id))
);