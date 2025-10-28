-- Fix worker_statistics view security definer issue
-- Drop the old view
DROP VIEW IF EXISTS public.worker_statistics;

-- Recreate with SECURITY INVOKER and using the new user_roles table
CREATE VIEW public.worker_statistics
WITH (security_invoker = true) AS
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  p.email,
  COUNT(j.id) AS total_jobs,
  COUNT(j.id) FILTER (WHERE j.status = 'completed') AS completed_jobs,
  COUNT(j.id) FILTER (WHERE j.created_at >= NOW() - INTERVAL '30 days') AS jobs_last_30_days,
  ROUND(AVG(EXTRACT(EPOCH FROM (j.due_date - j.start_scheduled_at)) / 3600), 2) AS avg_job_duration_hours
FROM public.profiles p
INNER JOIN public.user_roles ur ON p.id = ur.user_id
LEFT JOIN public.jobs j ON j.assigned_worker_id = p.id
WHERE ur.role IN ('worker', 'technician')
GROUP BY p.id, p.first_name, p.last_name, p.email;

-- Add comment explaining the security model
COMMENT ON VIEW public.worker_statistics IS 'Worker statistics view with SECURITY INVOKER - respects RLS policies on underlying tables. Only accessible to users who have permission to view the profiles and jobs tables.';