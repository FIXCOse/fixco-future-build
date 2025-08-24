-- Fix RLS policies and add RPC functions for secure booking/quote creation

-- First, ensure quote_requests table has all needed columns
ALTER TABLE public.quote_requests 
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS price_type text CHECK (price_type IN ('hourly','fixed','quote')),
  ADD COLUMN IF NOT EXISTS estimated_hours numeric,
  ADD COLUMN IF NOT EXISTS hourly_rate numeric,
  ADD COLUMN IF NOT EXISTS attachments jsonb DEFAULT '[]'::jsonb;

-- Drop existing restrictive RLS policies
DROP POLICY IF EXISTS anon_insert_bookings ON public.bookings;
DROP POLICY IF EXISTS user_insert_own_bookings ON public.bookings;
DROP POLICY IF EXISTS anon_insert_quote_requests ON public.quote_requests;
DROP POLICY IF EXISTS user_insert_own_quote_requests ON public.quote_requests;

-- Create permissive insert policies (guests and users can create)
CREATE POLICY "allow_insert_bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "allow_insert_quote_requests" 
ON public.quote_requests 
FOR INSERT 
WITH CHECK (true);

-- Secure RPC function for creating bookings
CREATE OR REPLACE FUNCTION public.create_booking_secure(p jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_user_id uuid;
BEGIN
  -- Get current user if authenticated
  SELECT auth.uid() INTO v_user_id;
  
  INSERT INTO public.bookings (
    customer_id, service_id, service_name, price_type,
    hours_estimated, hourly_rate, rot_rut_type, description,
    contact_name, contact_email, contact_phone, 
    address, postal_code, city,
    base_price, final_price, status,
    created_by_type, source,
    -- Legacy fields for compatibility
    name, email, phone
  )
  VALUES (
    v_user_id,
    NULLIF(p->>'service_id', ''),
    NULLIF(p->>'service_name', ''),
    COALESCE(p->>'price_type', 'hourly'),
    NULLIF(p->>'hours_estimated', '')::numeric,
    NULLIF(p->>'hourly_rate', '')::numeric,
    NULLIF(p->>'rot_rut_type', ''),
    NULLIF(p->>'description', ''),
    COALESCE(NULLIF(p->>'contact_name', ''), 'Kund'),
    COALESCE(NULLIF(p->>'contact_email', ''), 'info@example.com'),
    COALESCE(NULLIF(p->>'contact_phone', ''), '000-000000'),
    NULLIF(p->>'address', ''),
    NULLIF(p->>'postal_code', ''),
    NULLIF(p->>'city', ''),
    COALESCE(NULLIF(p->>'hourly_rate', '')::numeric, 0),
    COALESCE(NULLIF(p->>'hourly_rate', '')::numeric, 0),
    'pending',
    CASE WHEN v_user_id IS NOT NULL THEN 'user' ELSE 'guest' END,
    CASE WHEN v_user_id IS NOT NULL THEN 'user' ELSE 'guest' END,
    -- Legacy fields
    COALESCE(NULLIF(p->>'contact_name', ''), 'Kund'),
    COALESCE(NULLIF(p->>'contact_email', ''), 'info@example.com'),
    COALESCE(NULLIF(p->>'contact_phone', ''), '000-000000')
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- Secure RPC function for creating quote requests
CREATE OR REPLACE FUNCTION public.create_quote_request_secure(p jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_user_id uuid;
BEGIN
  -- Get current user if authenticated
  SELECT auth.uid() INTO v_user_id;
  
  INSERT INTO public.quote_requests (
    customer_id, service_id, service_name, 
    rot_rut_type, description, price_type,
    estimated_hours, hourly_rate,
    contact_name, contact_email, contact_phone,
    address, postal_code, city,
    status, created_by_type, source,
    -- Legacy fields for compatibility
    name, email, phone
  )
  VALUES (
    v_user_id,
    NULLIF(p->>'service_id', ''),
    NULLIF(p->>'service_name', ''),
    NULLIF(p->>'rot_rut_type', ''),
    NULLIF(p->>'description', ''),
    NULLIF(p->>'price_type', ''),
    NULLIF(p->>'estimated_hours', '')::numeric,
    NULLIF(p->>'hourly_rate', '')::numeric,
    COALESCE(NULLIF(p->>'contact_name', ''), 'Kund'),
    COALESCE(NULLIF(p->>'contact_email', ''), 'info@example.com'),
    COALESCE(NULLIF(p->>'contact_phone', ''), '000-000000'),
    NULLIF(p->>'address', ''),
    NULLIF(p->>'postal_code', ''),
    NULLIF(p->>'city', ''),
    'new',
    CASE WHEN v_user_id IS NOT NULL THEN 'user' ELSE 'guest' END,
    CASE WHEN v_user_id IS NOT NULL THEN 'user' ELSE 'guest' END,
    -- Legacy fields
    COALESCE(NULLIF(p->>'contact_name', ''), 'Kund'),
    COALESCE(NULLIF(p->>'contact_email', ''), 'info@example.com'),
    COALESCE(NULLIF(p->>'contact_phone', ''), '000-000000')
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- Grant execute permissions to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION public.create_booking_secure(jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_quote_request_secure(jsonb) TO anon, authenticated;