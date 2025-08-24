-- Make user_id nullable and add guest support fields
ALTER TABLE bookings 
ALTER COLUMN customer_id DROP NOT NULL;

ALTER TABLE quote_requests 
ALTER COLUMN customer_id DROP NOT NULL;

-- Add missing fields for guest bookings
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS contact_name text,
ADD COLUMN IF NOT EXISTS contact_email text,
ADD COLUMN IF NOT EXISTS contact_phone text,
ADD COLUMN IF NOT EXISTS source text DEFAULT 'guest',
ADD COLUMN IF NOT EXISTS created_by_type text DEFAULT 'guest';

-- Add missing fields for guest quote requests  
ALTER TABLE quote_requests
ADD COLUMN IF NOT EXISTS contact_name text,
ADD COLUMN IF NOT EXISTS contact_email text,
ADD COLUMN IF NOT EXISTS contact_phone text,
ADD COLUMN IF NOT EXISTS source text DEFAULT 'guest',
ADD COLUMN IF NOT EXISTS created_by_type text DEFAULT 'guest';

-- Update RLS policies for bookings - allow anonymous INSERT
DROP POLICY IF EXISTS "bookings_insert_customer_or_org" ON bookings;
CREATE POLICY "bookings_insert_guest_or_user" ON bookings
FOR INSERT 
WITH CHECK (
  -- Guests can insert with required contact info
  (auth.role() = 'anon' AND 
   source = 'guest' AND 
   customer_id IS NULL AND 
   (contact_email IS NOT NULL OR contact_phone IS NOT NULL))
  OR
  -- Authenticated users can insert their own bookings
  (auth.uid() IS NOT NULL AND customer_id = auth.uid())
  OR 
  -- Organization members can insert
  (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
);

-- Update RLS policies for quote_requests - allow anonymous INSERT
DROP POLICY IF EXISTS "Users can create own quote requests" ON quote_requests;
CREATE POLICY "quote_requests_insert_guest_or_user" ON quote_requests
FOR INSERT 
WITH CHECK (
  -- Guests can insert with required contact info
  (auth.role() = 'anon' AND 
   source = 'guest' AND 
   customer_id IS NULL AND 
   (contact_email IS NOT NULL OR contact_phone IS NOT NULL))
  OR
  -- Authenticated users can insert their own requests
  (auth.uid() IS NOT NULL AND customer_id = auth.uid())
);

-- Enable realtime for admin updates
ALTER TABLE bookings REPLICA IDENTITY FULL;
ALTER TABLE quote_requests REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE bookings;