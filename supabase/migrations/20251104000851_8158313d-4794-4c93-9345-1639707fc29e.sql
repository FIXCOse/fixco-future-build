-- Step 1: Drop and recreate claim_job() RPC function with correct signature
DROP FUNCTION IF EXISTS public.claim_job(UUID);

CREATE OR REPLACE FUNCTION public.claim_job(p_job_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_job_status TEXT;
  v_pool_enabled BOOLEAN;
  v_result JSONB;
BEGIN
  -- Check if job exists and is available in pool
  SELECT status, pool_enabled INTO v_job_status, v_pool_enabled
  FROM jobs
  WHERE id = p_job_id;
  
  IF v_job_status IS NULL THEN
    RAISE EXCEPTION 'Job not found';
  END IF;
  
  IF v_job_status != 'pool' THEN
    RAISE EXCEPTION 'Job is not available in pool (current status: %)', v_job_status;
  END IF;
  
  IF v_pool_enabled = false THEN
    RAISE EXCEPTION 'Job is not enabled for pool';
  END IF;
  
  -- Check if user is an active worker via user_roles
  IF NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'worker'
  ) THEN
    RAISE EXCEPTION 'User is not a worker';
  END IF;
  
  -- Claim the job
  UPDATE jobs
  SET 
    assigned_worker_id = auth.uid(),
    assigned_at = NOW(),
    status = 'assigned',
    pool_enabled = false
  WHERE id = p_job_id;
  
  -- Add to job_workers table
  INSERT INTO job_workers (job_id, worker_id, is_lead)
  VALUES (p_job_id, auth.uid(), true)
  ON CONFLICT (job_id, worker_id) DO NOTHING;
  
  -- Log event
  INSERT INTO job_events (job_id, actor, event, meta)
  VALUES (
    p_job_id,
    auth.uid(),
    'job.claimed',
    jsonb_build_object('claimed_from', 'pool', 'claimed_at', NOW())
  );
  
  v_result := jsonb_build_object(
    'success', true,
    'job_id', p_job_id,
    'message', 'Job claimed successfully'
  );
  
  RETURN v_result;
END;
$$;

-- Step 2: Update RLS policy for pool jobs to use user_roles instead of staff
DROP POLICY IF EXISTS "jobs_select_pool_with_matching_skills" ON jobs;

CREATE POLICY "jobs_select_pool_with_matching_skills"
ON jobs
FOR SELECT
TO authenticated
USING (
  status = 'pool' 
  AND pool_enabled = true
  AND deleted_at IS NULL
  AND EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'worker'
  )
);

-- Step 3: Ensure job_requests has proper RLS policies
-- Enable RLS on job_requests if not already enabled
ALTER TABLE job_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "job_requests_select_own" ON job_requests;
DROP POLICY IF EXISTS "job_requests_insert_admin" ON job_requests;
DROP POLICY IF EXISTS "job_requests_update_own" ON job_requests;
DROP POLICY IF EXISTS "job_requests_select_admin" ON job_requests;
DROP POLICY IF EXISTS "job_requests_update_admin" ON job_requests;

-- Workers can see their own job requests (worker_id = auth.uid())
CREATE POLICY "job_requests_select_own"
ON job_requests
FOR SELECT
TO authenticated
USING (worker_id = auth.uid());

-- Admins can see all job requests
CREATE POLICY "job_requests_select_admin"
ON job_requests
FOR SELECT
TO authenticated
USING (is_admin_or_owner());

-- Admin/system can insert job requests (called from edge function)
CREATE POLICY "job_requests_insert_admin"
ON job_requests
FOR INSERT
TO authenticated
WITH CHECK (is_admin_or_owner());

-- Workers can update their own requests (accept/reject)
CREATE POLICY "job_requests_update_own"
ON job_requests
FOR UPDATE
TO authenticated
USING (worker_id = auth.uid())
WITH CHECK (worker_id = auth.uid());

-- Admins can update all requests
CREATE POLICY "job_requests_update_admin"
ON job_requests
FOR UPDATE
TO authenticated
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());