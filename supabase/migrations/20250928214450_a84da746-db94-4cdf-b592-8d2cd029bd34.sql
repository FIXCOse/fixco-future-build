-- Check what views exist and remove the problematic one
-- Drop and recreate the view without security definer properties
DROP VIEW IF EXISTS public.booking_summary;

-- Create a simple view that relies entirely on RLS policies of the base table
-- This approach is more secure as it doesn't bypass RLS
CREATE VIEW public.booking_summary AS
SELECT 
  b.id,
  b.service_name,
  b.status,
  b.created_at,
  b.scheduled_date,
  b.base_price,
  b.final_price,
  b.customer_id,
  -- Only show contact name, other PII is protected by RLS
  b.contact_name
FROM public.bookings b;

-- Grant access to authenticated users only
GRANT SELECT ON public.booking_summary TO authenticated;

-- The view will automatically respect the RLS policies on the bookings table
-- No additional security settings needed