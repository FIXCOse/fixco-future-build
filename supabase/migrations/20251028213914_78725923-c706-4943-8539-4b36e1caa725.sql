-- Drop eventuella gamla constraints först
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_customer_id_fkey;
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_booking_id_fkey;
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_quote_id_fkey;
ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_organization_id_fkey;

-- Lägg till nya foreign key constraints
ALTER TABLE invoices
  ADD CONSTRAINT invoices_customer_id_fkey 
  FOREIGN KEY (customer_id) 
  REFERENCES customers(id) 
  ON DELETE SET NULL;

ALTER TABLE invoices
  ADD CONSTRAINT invoices_booking_id_fkey 
  FOREIGN KEY (booking_id) 
  REFERENCES bookings(id) 
  ON DELETE SET NULL;

ALTER TABLE invoices
  ADD CONSTRAINT invoices_quote_id_fkey 
  FOREIGN KEY (quote_id) 
  REFERENCES quotes(id) 
  ON DELETE SET NULL;

ALTER TABLE invoices
  ADD CONSTRAINT invoices_organization_id_fkey 
  FOREIGN KEY (organization_id) 
  REFERENCES organizations(id) 
  ON DELETE SET NULL;