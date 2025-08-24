-- Allow customer_id to be null for guest bookings and quote requests
ALTER TABLE public.bookings ALTER COLUMN customer_id DROP NOT NULL;
ALTER TABLE public.quote_requests ALTER COLUMN customer_id DROP NOT NULL;

-- Remove existing policies to rebuild them cleanly
DROP POLICY IF EXISTS "bookings_insert_guest_or_user" ON public.bookings;
DROP POLICY IF EXISTS "bookings_select_customer_or_org_or_technician" ON public.bookings;
DROP POLICY IF EXISTS "bookings_update_customer_or_technician_or_org" ON public.bookings;

DROP POLICY IF EXISTS "quote_requests_insert_guest_or_user" ON public.quote_requests;
DROP POLICY IF EXISTS "Users can read own quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Admin/Owner can read all quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Admin/Owner can update all quote requests" ON public.quote_requests;

-- BOOKINGS POLICIES
-- Anonymous users can insert bookings with contact info
CREATE POLICY "anon_insert_bookings" ON public.bookings
FOR INSERT TO anon
WITH CHECK (
  (contact_email IS NOT NULL OR contact_phone IS NOT NULL)
  AND created_by_type = 'guest'
  AND customer_id IS NULL
);

-- Authenticated users can insert their own bookings
CREATE POLICY "user_insert_own_bookings" ON public.bookings
FOR INSERT TO authenticated
WITH CHECK (customer_id = auth.uid());

-- Users can view their own bookings
CREATE POLICY "user_select_own_bookings" ON public.bookings
FOR SELECT TO authenticated
USING (customer_id = auth.uid());

-- Technicians can view bookings assigned to them
CREATE POLICY "technician_select_assigned_bookings" ON public.bookings
FOR SELECT TO authenticated
USING (technician_id = auth.uid());

-- Organization members can view org bookings
CREATE POLICY "org_select_bookings" ON public.bookings
FOR SELECT TO authenticated
USING (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id));

-- Admins and owners can view all bookings
CREATE POLICY "admin_select_all_bookings" ON public.bookings
FOR SELECT TO authenticated
USING (is_admin_or_owner());

-- Admins and owners can update all bookings
CREATE POLICY "admin_update_all_bookings" ON public.bookings
FOR UPDATE TO authenticated
USING (is_admin_or_owner());

-- QUOTE REQUESTS POLICIES
-- Anonymous users can insert quote requests with contact info
CREATE POLICY "anon_insert_quote_requests" ON public.quote_requests
FOR INSERT TO anon
WITH CHECK (
  (contact_email IS NOT NULL OR contact_phone IS NOT NULL)
  AND created_by_type = 'guest'
  AND customer_id IS NULL
);

-- Authenticated users can insert their own quote requests
CREATE POLICY "user_insert_own_quote_requests" ON public.quote_requests
FOR INSERT TO authenticated
WITH CHECK (customer_id = auth.uid());

-- Users can view their own quote requests
CREATE POLICY "user_select_own_quote_requests" ON public.quote_requests
FOR SELECT TO authenticated
USING (customer_id = auth.uid());

-- Admins and owners can view all quote requests
CREATE POLICY "admin_select_all_quote_requests" ON public.quote_requests
FOR SELECT TO authenticated
USING (is_admin_or_owner());

-- Admins and owners can update all quote requests
CREATE POLICY "admin_update_all_quote_requests" ON public.quote_requests
FOR UPDATE TO authenticated
USING (is_admin_or_owner());

-- Enable realtime for admin monitoring
ALTER TABLE public.bookings REPLICA IDENTITY FULL;
ALTER TABLE public.quote_requests REPLICA IDENTITY FULL;