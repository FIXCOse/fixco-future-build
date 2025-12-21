-- Fix: Remove the insecure customers_select_via_quote policy
-- This policy allowed anyone who could see a quote to also see the customer
-- Since quotes_new has a "Public can view quotes by token" policy, this exposed all customer data

DROP POLICY IF EXISTS "customers_select_via_quote" ON customers;

-- Instead, we create a secure policy that only allows access via authenticated token-based quote viewing
-- This uses SECURITY DEFINER to safely check the token without RLS recursion

CREATE OR REPLACE FUNCTION public.can_view_customer_via_quote_token(
  _customer_id uuid,
  _public_token text
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM quotes_new
    WHERE customer_id = _customer_id
      AND public_token = _public_token
      AND public_token IS NOT NULL
  );
$$;

-- Note: We're NOT recreating the policy because the token-based access should be handled
-- at the application level (edge functions), not via RLS policies that could be exploited.
-- Customers table should only be readable by:
-- 1. Admins/Owners (already covered by customers_select_admin and customers_select_admin_or_owner)
-- 2. The customer themselves if they're linked to a profile (could be added if needed)

-- For now, the edge functions (get-quote-public, etc.) use service role to fetch customer data
-- when a valid public_token is provided, which is the secure pattern.