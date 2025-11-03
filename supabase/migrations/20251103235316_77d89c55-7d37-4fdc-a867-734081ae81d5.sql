-- ============================================
-- WORKER ID STANDARDIZATION MIGRATION
-- Standardiserar alla worker IDs till user_id
-- ============================================

-- Step 1: Rename job_requests.staff_id to worker_id
ALTER TABLE job_requests 
RENAME COLUMN staff_id TO worker_id;

-- Step 2: Drop old RLS policies
DROP POLICY IF EXISTS "job_requests_all_admin_owner" ON job_requests;
DROP POLICY IF EXISTS "job_requests_select_own" ON job_requests;
DROP POLICY IF EXISTS "job_requests_update_own" ON job_requests;

-- Step 3: Create new RLS policies using worker_id
CREATE POLICY "job_requests_all_admin_owner"
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

CREATE POLICY "job_requests_select_own"
ON job_requests
FOR SELECT
TO authenticated
USING (worker_id = auth.uid());

CREATE POLICY "job_requests_update_own"
ON job_requests
FOR UPDATE
TO authenticated
USING (worker_id = auth.uid());

-- Step 4: Add comment for clarity
COMMENT ON COLUMN job_requests.worker_id IS 'User ID (auth.uid()) of the worker - standardized across all worker tables';