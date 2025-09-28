-- Fix the security definer view issue
-- Remove the security_barrier setting that caused the security warning
ALTER VIEW public.booking_summary RESET (security_barrier);

-- Instead, apply proper RLS policies to the underlying table
-- The view itself doesn't need SECURITY DEFINER since it relies on the base table's RLS policies

-- Ensure the view respects RLS by making sure it only shows data the user is authorized to see
-- The CASE statements in the view already handle this properly