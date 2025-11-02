-- Create RPC function for returning job to pool with tracking
CREATE OR REPLACE FUNCTION public.return_job_to_pool(
  p_job_id uuid,
  p_reason text DEFAULT 'unspecified',
  p_reason_text text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_worker_id uuid;
  v_claimed_at timestamptz;
  v_time_held_minutes integer;
  v_previous_claims integer;
BEGIN
  -- Get current worker and claim time
  SELECT assigned_worker_id, assigned_at INTO v_worker_id, v_claimed_at
  FROM jobs WHERE id = p_job_id;
  
  -- Verify worker owns this job or is admin
  IF v_worker_id != auth.uid() AND NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  -- Calculate how long worker held the job
  v_time_held_minutes := EXTRACT(EPOCH FROM (NOW() - v_claimed_at)) / 60;
  
  -- Count previous claims
  SELECT COUNT(*) INTO v_previous_claims
  FROM job_events
  WHERE job_id = p_job_id AND event = 'job.claimed';
  
  -- Reset job to pool
  UPDATE jobs
  SET 
    status = 'pool',
    pool_enabled = true,
    assigned_worker_id = NULL,
    assigned_at = NULL
  WHERE id = p_job_id;
  
  -- Log the return event with metadata
  INSERT INTO job_events(job_id, actor, event, meta)
  VALUES (
    p_job_id,
    auth.uid(),
    'job.returned_to_pool',
    jsonb_build_object(
      'worker_id', v_worker_id,
      'reason', p_reason,
      'reason_text', p_reason_text,
      'claimed_at', v_claimed_at,
      'returned_at', NOW(),
      'time_held_minutes', v_time_held_minutes,
      'previous_claims', v_previous_claims
    )
  );
  
  RETURN true;
END;
$$;

-- Create materialized view for worker performance stats
CREATE MATERIALIZED VIEW IF NOT EXISTS worker_performance_stats AS
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  p.email,
  COUNT(DISTINCT je_claimed.job_id) as total_claimed,
  COUNT(DISTINCT je_completed.job_id) as total_completed,
  COUNT(DISTINCT je_returned.job_id) as total_returned,
  ROUND(
    CASE 
      WHEN COUNT(DISTINCT je_claimed.job_id) > 0 
      THEN (COUNT(DISTINCT je_completed.job_id)::numeric / COUNT(DISTINCT je_claimed.job_id) * 100)
      ELSE 0 
    END, 
    1
  ) as completion_rate,
  ARRAY_AGG(DISTINCT je_returned.meta->>'reason') FILTER (WHERE je_returned.event = 'job.returned_to_pool') as return_reasons,
  AVG((je_returned.meta->>'time_held_minutes')::numeric) FILTER (WHERE je_returned.event = 'job.returned_to_pool') as avg_time_held_minutes
FROM profiles p
LEFT JOIN job_events je_claimed ON je_claimed.actor = p.id AND je_claimed.event = 'job.claimed'
LEFT JOIN job_events je_completed ON je_completed.actor = p.id AND je_completed.event = 'job.completed'
LEFT JOIN job_events je_returned ON je_returned.actor = p.id AND je_returned.event = 'job.returned_to_pool'
WHERE EXISTS (SELECT 1 FROM user_roles WHERE user_id = p.id AND role = 'worker')
GROUP BY p.id, p.first_name, p.last_name, p.email;

-- Create function to refresh stats
CREATE OR REPLACE FUNCTION refresh_worker_stats()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW worker_performance_stats;
END;
$$;

-- Grant permissions
GRANT SELECT ON worker_performance_stats TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_worker_stats() TO authenticated;