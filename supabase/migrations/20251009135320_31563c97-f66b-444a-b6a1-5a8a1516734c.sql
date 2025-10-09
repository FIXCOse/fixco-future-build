-- Create function to update job status (for workers)
CREATE OR REPLACE FUNCTION public.update_job_status(p_job_id uuid, p_status text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  job_worker_id uuid;
BEGIN
  -- Verify worker has access to this job
  SELECT assigned_worker_id INTO job_worker_id 
  FROM public.jobs 
  WHERE id = p_job_id;
  
  IF job_worker_id != auth.uid() AND NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied to this job';
  END IF;

  -- Update job status
  UPDATE public.jobs
  SET status = p_status
  WHERE id = p_job_id;

  -- Log event
  INSERT INTO public.job_events(job_id, actor, event, meta)
  VALUES (
    p_job_id, 
    auth.uid(), 
    'job.status_changed',
    jsonb_build_object('new_status', p_status)
  );

  RETURN TRUE;
END;
$$;