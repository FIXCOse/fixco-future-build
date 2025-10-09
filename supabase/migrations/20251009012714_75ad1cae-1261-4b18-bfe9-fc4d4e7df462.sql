-- Flytta alla befintliga quote_requests till bookings
INSERT INTO public.bookings (
  id,
  customer_id,
  service_id,
  service_name,
  price_type,
  hours_estimated,
  hourly_rate,
  rot_rut_type,
  description,
  contact_name,
  contact_email,
  contact_phone,
  address,
  postal_code,
  city,
  base_price,
  final_price,
  status,
  created_by_type,
  source,
  name,
  email,
  phone,
  created_at,
  updated_at,
  deleted_at,
  created_by
)
SELECT 
  gen_random_uuid(),
  customer_id,
  COALESCE(service_id, 'unknown'),
  COALESCE(service_name, 'Offertförfrågan'),
  COALESCE(price_type, 'quote'),
  estimated_hours,
  hourly_rate,
  rot_rut_type,
  COALESCE(description, message),
  COALESCE(contact_name, 'Kund'),
  COALESCE(contact_email, 'info@example.com'),
  COALESCE(contact_phone, '000-000000'),
  address,
  postal_code,
  city,
  COALESCE(hourly_rate * COALESCE(estimated_hours, 0), 0),
  COALESCE(hourly_rate * COALESCE(estimated_hours, 0), 0),
  'pending',
  COALESCE(created_by_type, 'guest'),
  COALESCE(source, 'guest'),
  COALESCE(name, contact_name, 'Kund'),
  COALESCE(email, contact_email, 'info@example.com'),
  COALESCE(phone, contact_phone, '000-000000'),
  created_at,
  updated_at,
  deleted_at,
  created_by
FROM public.quote_requests
WHERE deleted_at IS NULL;

-- Ta bort gamla quote_requests (mjuk borttagning)
UPDATE public.quote_requests
SET deleted_at = NOW()
WHERE deleted_at IS NULL;