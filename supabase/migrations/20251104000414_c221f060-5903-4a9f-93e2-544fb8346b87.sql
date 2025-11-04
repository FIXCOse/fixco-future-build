-- Drop existing policies if any
DROP POLICY IF EXISTS "jobs_select_admin_or_owner" ON jobs;
DROP POLICY IF EXISTS "jobs_select_assigned_worker" ON jobs;
DROP POLICY IF EXISTS "jobs_select_pool_with_matching_skills" ON jobs;
DROP POLICY IF EXISTS "jobs_select_via_job_workers" ON jobs;
DROP POLICY IF EXISTS "jobs_insert_admin_or_owner" ON jobs;
DROP POLICY IF EXISTS "jobs_update_admin_or_owner" ON jobs;
DROP POLICY IF EXISTS "jobs_update_assigned_worker_status" ON jobs;
DROP POLICY IF EXISTS "jobs_delete_admin_or_owner" ON jobs;

-- Enable RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- SELECT Policies
CREATE POLICY "jobs_select_admin_or_owner"
ON jobs
FOR SELECT
TO authenticated
USING (is_admin_or_owner());

CREATE POLICY "jobs_select_assigned_worker"
ON jobs
FOR SELECT
TO authenticated
USING (assigned_worker_id = auth.uid());

CREATE POLICY "jobs_select_pool_with_matching_skills"
ON jobs
FOR SELECT
TO authenticated
USING (
  status = 'pool' 
  AND pool_enabled = true
  AND deleted_at IS NULL
  AND EXISTS (
    SELECT 1 FROM staff s
    WHERE s.user_id = auth.uid()
    AND s.active = true
  )
);

CREATE POLICY "jobs_select_via_job_workers"
ON jobs
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM job_workers jw
    WHERE jw.job_id = jobs.id
    AND jw.worker_id = auth.uid()
  )
);

-- INSERT Policy
CREATE POLICY "jobs_insert_admin_or_owner"
ON jobs
FOR INSERT
TO authenticated
WITH CHECK (is_admin_or_owner());

-- UPDATE Policies
CREATE POLICY "jobs_update_admin_or_owner"
ON jobs
FOR UPDATE
TO authenticated
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

CREATE POLICY "jobs_update_assigned_worker_status"
ON jobs
FOR UPDATE
TO authenticated
USING (assigned_worker_id = auth.uid())
WITH CHECK (assigned_worker_id = auth.uid());

-- DELETE Policy
CREATE POLICY "jobs_delete_admin_or_owner"
ON jobs
FOR DELETE
TO authenticated
USING (is_admin_or_owner());