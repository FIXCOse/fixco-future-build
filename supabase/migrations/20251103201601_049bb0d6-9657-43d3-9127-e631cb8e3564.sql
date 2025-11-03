-- Add RLS policies for quotes_new table
-- Drop existing policies if any
DROP POLICY IF EXISTS "Admin and owner can manage all quotes" ON quotes_new;
DROP POLICY IF EXISTS "Customers can view own quotes" ON quotes_new;

-- Admin/owner can manage all quotes
CREATE POLICY "Admin and owner can manage all quotes"
ON quotes_new FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
  OR auth.email() IN ('omar@fixco.se', 'imedashviliomar@gmail.com')
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
  OR auth.email() IN ('omar@fixco.se', 'imedashviliomar@gmail.com')
);

-- Customers can view their own quotes
CREATE POLICY "Customers can view own quotes"
ON quotes_new FOR SELECT
TO authenticated
USING (customer_id = auth.uid());

-- Enable realtime for quotes_new
ALTER TABLE quotes_new REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE quotes_new;