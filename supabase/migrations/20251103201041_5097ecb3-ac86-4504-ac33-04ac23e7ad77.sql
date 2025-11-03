-- RPC function för admin att hämta alla bookings
CREATE OR REPLACE FUNCTION public.admin_get_bookings()
RETURNS TABLE (
  id uuid,
  service_slug text,
  mode text,
  status text,
  payload jsonb,
  file_urls text[],
  customer_id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  deleted_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Kontrollera att användaren är admin/owner
  IF NOT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  ) AND auth.email() NOT IN ('omar@fixco.se', 'imedashviliomar@gmail.com') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Returnera alla bookings (exklusive soft-deleted)
  RETURN QUERY
  SELECT 
    b.id, 
    b.service_slug, 
    b.mode, 
    b.status, 
    b.payload, 
    b.file_urls,
    b.customer_id, 
    b.created_at,
    b.updated_at,
    b.deleted_at
  FROM bookings b
  WHERE b.deleted_at IS NULL
  ORDER BY b.created_at DESC;
END;
$$;

-- RPC function för admin att hämta alla job requests med joins
CREATE OR REPLACE FUNCTION public.admin_get_job_requests(
  p_status_filter text DEFAULT 'all',
  p_search_term text DEFAULT ''
)
RETURNS TABLE (
  id uuid,
  job_id uuid,
  staff_id uuid,
  status text,
  message text,
  response_message text,
  requested_at timestamptz,
  responded_at timestamptz,
  expires_at timestamptz,
  deleted_at timestamptz,
  staff_data jsonb,
  job_data jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Kontrollera att användaren är admin/owner
  IF NOT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  ) AND auth.email() NOT IN ('omar@fixco.se', 'imedashviliomar@gmail.com') THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Returnera alla job requests med staff och job data
  RETURN QUERY
  SELECT 
    jr.id,
    jr.job_id,
    jr.staff_id,
    jr.status,
    jr.message,
    jr.response_message,
    jr.requested_at,
    jr.responded_at,
    jr.expires_at,
    jr.deleted_at,
    -- Staff data as JSON
    jsonb_build_object(
      'id', s.id,
      'name', s.name,
      'staff_id', s.staff_id,
      'email', s.email,
      'phone', s.phone,
      'role', s.role
    ) as staff_data,
    -- Job data as JSON
    jsonb_build_object(
      'id', j.id,
      'title', j.title,
      'description', j.description,
      'address', j.address,
      'city', j.city,
      'status', j.status,
      'pricing_mode', j.pricing_mode,
      'hourly_rate', j.hourly_rate,
      'fixed_price', j.fixed_price
    ) as job_data
  FROM job_requests jr
  LEFT JOIN staff s ON s.id = jr.staff_id
  LEFT JOIN jobs j ON j.id = jr.job_id
  WHERE 
    jr.deleted_at IS NULL
    AND (p_status_filter = 'all' OR jr.status = p_status_filter)
    AND (
      p_search_term = '' 
      OR jr.message ILIKE '%' || p_search_term || '%'
      OR jr.response_message ILIKE '%' || p_search_term || '%'
    )
  ORDER BY jr.requested_at DESC;
END;
$$;