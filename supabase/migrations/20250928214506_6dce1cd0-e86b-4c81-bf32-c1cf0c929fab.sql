-- Find and fix any views with security_definer or security_barrier
-- First check what views exist in our schema
SELECT schemaname, viewname, definition 
FROM pg_views 
WHERE schemaname = 'public';

-- Drop any potentially problematic views related to security
DROP VIEW IF EXISTS public.booking_summary CASCADE;

-- Instead of creating a view, let's just use the table directly with proper RLS
-- This is the most secure approach - no views needed

-- Add a comment to document the security approach
COMMENT ON TABLE public.bookings IS 'Customer PII protected by RLS policies. Use direct table access with proper authentication.';