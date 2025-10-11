-- 1. Create job_locks table
CREATE TABLE IF NOT EXISTS public.job_locks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  locked_by UUID NOT NULL REFERENCES public.profiles(id),
  locked_at TIMESTAMPTZ DEFAULT NOW(),
  reason TEXT,
  UNIQUE(job_id)
);

ALTER TABLE public.job_locks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage locks" 
ON public.job_locks FOR ALL 
USING (is_admin_or_owner());

CREATE POLICY "Workers can view locks on their jobs" 
ON public.job_locks FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.jobs 
    WHERE jobs.id = job_locks.job_id 
    AND jobs.assigned_worker_id = auth.uid()
  )
);

-- 2. Create job_schedule_notifications table
CREATE TABLE IF NOT EXISTS public.job_schedule_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES public.profiles(id),
  scheduled_by UUID NOT NULL REFERENCES public.profiles(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.job_schedule_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workers can view their notifications" 
ON public.job_schedule_notifications FOR SELECT
USING (worker_id = auth.uid());

CREATE POLICY "Admin can create notifications" 
ON public.job_schedule_notifications FOR INSERT
WITH CHECK (is_admin_or_owner());

CREATE POLICY "Workers can mark as read" 
ON public.job_schedule_notifications FOR UPDATE
USING (worker_id = auth.uid());

-- 3. Create worker_statistics view
CREATE OR REPLACE VIEW public.worker_statistics AS
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
LEFT JOIN public.jobs j ON j.assigned_worker_id = p.id
WHERE p.role IN ('worker', 'technician')
GROUP BY p.id, p.first_name, p.last_name, p.email;

-- 4. Create update_job_schedule function
CREATE OR REPLACE FUNCTION public.update_job_schedule(
  p_job_id UUID,
  p_start_time TIMESTAMPTZ,
  p_end_time TIMESTAMPTZ
) RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_worker_id UUID;
  v_locked BOOLEAN;
  v_is_admin BOOLEAN;
BEGIN
  -- Check if user is admin
  v_is_admin := is_admin_or_owner();
  
  -- Check if job is locked
  SELECT EXISTS(SELECT 1 FROM public.job_locks WHERE job_id = p_job_id) INTO v_locked;
  
  IF v_locked AND NOT v_is_admin THEN
    RAISE EXCEPTION 'Job is locked and cannot be moved';
  END IF;
  
  SELECT assigned_worker_id INTO v_worker_id FROM public.jobs WHERE id = p_job_id;
  
  -- Check for double bookings
  IF EXISTS (
    SELECT 1 FROM public.jobs 
    WHERE assigned_worker_id = v_worker_id 
      AND id != p_job_id
      AND start_scheduled_at IS NOT NULL
      AND due_date IS NOT NULL
      AND (
        (start_scheduled_at, due_date) OVERLAPS (p_start_time, p_end_time)
      )
  ) THEN
    RAISE EXCEPTION 'Time slot already booked for this worker';
  END IF;
  
  -- Update job
  UPDATE public.jobs 
  SET start_scheduled_at = p_start_time, 
      due_date = p_end_time 
  WHERE id = p_job_id;
  
  -- If admin schedules, create notification
  IF v_is_admin AND v_worker_id IS NOT NULL THEN
    INSERT INTO public.job_schedule_notifications (job_id, worker_id, scheduled_by, scheduled_at)
    VALUES (p_job_id, v_worker_id, auth.uid(), p_start_time);
  END IF;
  
  RETURN TRUE;
END;
$$;