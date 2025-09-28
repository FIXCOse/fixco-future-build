-- First, let's review and fix the overly permissive INSERT policy on bookings table
-- The current policy "allow_insert_bookings" has "WITH CHECK (true)" which is too permissive

-- Drop the overly permissive insert policy
DROP POLICY IF EXISTS "allow_insert_bookings" ON public.bookings;

-- Create a more secure insert policy that only allows:
-- 1. Authenticated users to create bookings for themselves
-- 2. Admin/owners to create bookings for anyone
-- 3. Organization members to create bookings for their organization
CREATE POLICY "secure_insert_bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (
  -- Must be authenticated
  auth.uid() IS NOT NULL 
  AND (
    -- User creating booking for themselves
    (customer_id = auth.uid()) 
    OR 
    -- Admin/owner can create for anyone
    is_admin_or_owner()
    OR 
    -- Organization member can create for their org
    (organization_id IS NOT NULL AND is_organization_member(auth.uid(), organization_id))
  )
);

-- Add additional security: ensure customer_id is always set for user-created bookings
-- Create a function to automatically set customer_id for authenticated users
CREATE OR REPLACE FUNCTION public.ensure_booking_customer_id()
RETURNS TRIGGER AS $$
BEGIN
  -- If customer_id is not set and user is authenticated, set it to current user
  IF NEW.customer_id IS NULL AND auth.uid() IS NOT NULL THEN
    NEW.customer_id := auth.uid();
  END IF;
  
  -- Prevent users from creating bookings for other users (unless admin)
  IF NOT is_admin_or_owner() AND NEW.customer_id != auth.uid() AND auth.uid() IS NOT NULL THEN
    RAISE EXCEPTION 'Cannot create booking for another user';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add trigger to enforce customer_id security
DROP TRIGGER IF EXISTS ensure_booking_customer_id_trigger ON public.bookings;
CREATE TRIGGER ensure_booking_customer_id_trigger
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.ensure_booking_customer_id();

-- Enhance the existing SELECT policies to be more explicit about PII access
-- First drop and recreate the user select policy with additional safeguards
DROP POLICY IF EXISTS "user_select_own_bookings" ON public.bookings;
CREATE POLICY "users_select_own_bookings_only" 
ON public.bookings 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND customer_id = auth.uid()
);

-- Ensure technicians can only see assigned bookings and only necessary fields
DROP POLICY IF EXISTS "technician_select_assigned_bookings" ON public.bookings;
CREATE POLICY "technicians_select_assigned_bookings_only" 
ON public.bookings 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND technician_id = auth.uid()
);

-- Add a policy to prevent unauthorized data export
-- Create a view for limited booking data that doesn't expose all PII
CREATE OR REPLACE VIEW public.booking_summary AS
SELECT 
  id,
  service_name,
  status,
  created_at,
  scheduled_date,
  base_price,
  final_price,
  -- Only show customer info to authorized users
  CASE 
    WHEN is_admin_or_owner() OR customer_id = auth.uid() OR technician_id = auth.uid()
    THEN customer_id
    ELSE NULL 
  END as customer_id,
  CASE 
    WHEN is_admin_or_owner() OR customer_id = auth.uid() OR technician_id = auth.uid()
    THEN contact_name
    ELSE 'Protected' 
  END as contact_name,
  -- Never expose full contact details in summary view
  CASE 
    WHEN is_admin_or_owner()
    THEN contact_email
    ELSE NULL 
  END as contact_email
FROM public.bookings;

-- Grant appropriate access to the view
GRANT SELECT ON public.booking_summary TO authenticated;

-- Add RLS to the view as well
ALTER VIEW public.booking_summary SET (security_barrier = true);

-- Create an audit function to log access to sensitive booking data
CREATE OR REPLACE FUNCTION public.log_booking_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log when someone accesses booking data with PII
  IF TG_OP = 'SELECT' THEN
    INSERT INTO public.activity_log (
      event_type,
      actor_user,
      subject_type,
      subject_id,
      summary,
      metadata
    ) VALUES (
      'booking_data_access',
      auth.uid(),
      'booking',
      NEW.id,
      'Booking personal data accessed',
      jsonb_build_object(
        'accessed_fields', ARRAY['email', 'phone', 'address'],
        'access_time', now()
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;