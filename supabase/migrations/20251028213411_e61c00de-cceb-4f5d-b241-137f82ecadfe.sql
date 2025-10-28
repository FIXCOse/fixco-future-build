-- Drop den gamla begränsade policyn
DROP POLICY IF EXISTS "Public can view customers by token" ON customers;

-- Skapa explicit admin SELECT-policy
CREATE POLICY "customers_select_admin"
ON customers
FOR SELECT
USING (is_admin_or_owner());

-- Återskapa public-access via quotes som en separat policy
CREATE POLICY "customers_select_via_quote"
ON customers
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM quotes_new 
  WHERE quotes_new.customer_id = customers.id
));