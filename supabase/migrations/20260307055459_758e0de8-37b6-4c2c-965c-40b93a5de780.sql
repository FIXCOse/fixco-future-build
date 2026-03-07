-- Revoke direct access to the view from anon and authenticated roles
REVOKE SELECT ON public.job_worker_hours FROM anon, authenticated;

-- Create a secure function that filters by worker or admin
CREATE OR REPLACE FUNCTION public.get_job_worker_hours(p_job_id uuid DEFAULT NULL)
RETURNS TABLE(
  job_id uuid,
  worker_id uuid,
  is_lead boolean,
  assigned_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  total_hours numeric,
  time_entries bigint,
  status text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Admins/owners see all
  IF public.is_admin_or_owner() THEN
    RETURN QUERY
    SELECT jwh.job_id, jwh.worker_id, jwh.is_lead, jwh.assigned_at,
           jwh.started_at, jwh.completed_at, jwh.total_hours, jwh.time_entries, jwh.status
    FROM public.job_worker_hours jwh
    WHERE (p_job_id IS NULL OR jwh.job_id = p_job_id);
  ELSE
    -- Workers only see their own hours
    RETURN QUERY
    SELECT jwh.job_id, jwh.worker_id, jwh.is_lead, jwh.assigned_at,
           jwh.started_at, jwh.completed_at, jwh.total_hours, jwh.time_entries, jwh.status
    FROM public.job_worker_hours jwh
    WHERE jwh.worker_id = auth.uid()
      AND (p_job_id IS NULL OR jwh.job_id = p_job_id);
  END IF;
END;
$$;