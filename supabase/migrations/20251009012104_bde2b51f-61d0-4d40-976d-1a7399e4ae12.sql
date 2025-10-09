-- Fix create_booking_secure to handle null service_id and service_name
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
    internal_notes,
    -- Legacy fields for compatibility
    name, email, phone
  )
  VALUES (
    v_user_id,
    COALESCE(NULLIF(p->>'service_id', ''), 'unknown'),
    COALESCE(NULLIF(p->>'service_name', ''), 'Ingen tjänst vald'),
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
    NULLIF(p->>'internal_notes', ''),
    -- Legacy fields
    COALESCE(NULLIF(p->>'contact_name', ''), 'Kund'),
    COALESCE(NULLIF(p->>'contact_email', ''), 'info@example.com'),
    COALESCE(NULLIF(p->>'contact_phone', ''), '000-000000')
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;