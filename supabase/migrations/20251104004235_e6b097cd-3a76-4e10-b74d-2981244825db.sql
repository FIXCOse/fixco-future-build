-- Drop and recreate job_worker_hours view to include manual_hours
DROP VIEW IF EXISTS job_worker_hours;

CREATE VIEW job_worker_hours AS
SELECT 
  jw.job_id,
  jw.worker_id,
  jw.is_lead,
  jw.assigned_at,
  jw.started_at,
  jw.completed_at,
  COALESCE(SUM(COALESCE(tl.hours, 0) + COALESCE(tl.manual_hours, 0)), 0) as total_hours,
  COUNT(tl.id) as time_entries,
  jw.status
FROM job_workers jw
LEFT JOIN time_logs tl ON tl.job_id = jw.job_id AND tl.worker_id = jw.worker_id
GROUP BY jw.job_id, jw.worker_id, jw.is_lead, jw.assigned_at, jw.started_at, jw.completed_at, jw.status;

-- Add RLS policy for customers table to allow admin/owner SELECT
CREATE POLICY "customers_select_admin_or_owner"
ON customers
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role IN ('admin', 'owner')
  )
);