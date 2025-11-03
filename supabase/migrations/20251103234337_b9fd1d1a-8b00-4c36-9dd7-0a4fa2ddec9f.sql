-- Fix RLS policies for job_workers table
ALTER TABLE job_workers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "job_workers_insert_admin" ON job_workers;
DROP POLICY IF EXISTS "job_workers_update_admin" ON job_workers;
DROP POLICY IF EXISTS "job_workers_select_admin" ON job_workers;
DROP POLICY IF EXISTS "job_workers_select_own" ON job_workers;
DROP POLICY IF EXISTS "job_workers_delete_admin" ON job_workers;

-- Admins and owners can insert job_workers
CREATE POLICY "job_workers_insert_admin"
ON job_workers
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
);

-- Admins and owners can update job_workers
CREATE POLICY "job_workers_update_admin"
ON job_workers
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
);

-- Admins and owners can delete job_workers
CREATE POLICY "job_workers_delete_admin"
ON job_workers
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
);

-- Admins and owners can select all job_workers
CREATE POLICY "job_workers_select_admin"
ON job_workers
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
);

-- Workers can select their own assignments
CREATE POLICY "job_workers_select_own"
ON job_workers
FOR SELECT
TO authenticated
USING (
  worker_id = auth.uid()
);

-- Fix RLS policies for job_requests table
ALTER TABLE job_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "job_requests_admin_all" ON job_requests;
DROP POLICY IF EXISTS "job_requests_select_own" ON job_requests;
DROP POLICY IF EXISTS "job_requests_update_own" ON job_requests;

-- Admins and owners can manage all job_requests
CREATE POLICY "job_requests_admin_all"
ON job_requests
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
);

-- Workers can view their own job_requests
CREATE POLICY "job_requests_select_own"
ON job_requests
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM staff
    WHERE staff.user_id = auth.uid()
    AND staff.id = job_requests.staff_id
  )
);

-- Workers can update their own job_requests (accept/reject)
CREATE POLICY "job_requests_update_own"
ON job_requests
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM staff
    WHERE staff.user_id = auth.uid()
    AND staff.id = job_requests.staff_id
  )
);