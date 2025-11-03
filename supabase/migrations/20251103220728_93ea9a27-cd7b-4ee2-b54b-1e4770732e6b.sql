-- Create job_workers junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS public.job_workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_lead BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'active', 'completed', 'removed')),
  assigned_at TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(job_id, worker_id)
);

-- Create indexes for performance
CREATE INDEX idx_job_workers_job_id ON public.job_workers(job_id);
CREATE INDEX idx_job_workers_worker_id ON public.job_workers(worker_id);

-- Enable RLS
ALTER TABLE public.job_workers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage job workers"
  ON public.job_workers
  FOR ALL
  USING (is_admin_or_owner());

CREATE POLICY "Workers can view their assignments"
  ON public.job_workers
  FOR SELECT
  USING (worker_id = auth.uid());

-- Add estimated_hours to jobs table
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS estimated_hours NUMERIC;

-- Create helper view for aggregated worker hours
CREATE OR REPLACE VIEW public.job_worker_hours AS
SELECT 
  jw.job_id,
  jw.worker_id,
  jw.is_lead,
  jw.status,
  jw.assigned_at,
  jw.started_at,
  jw.completed_at,
  COALESCE(SUM(tl.hours), 0) as total_hours,
  COUNT(DISTINCT tl.id) as time_entries
FROM public.job_workers jw
LEFT JOIN public.time_logs tl ON tl.job_id = jw.job_id AND tl.worker_id = jw.worker_id
GROUP BY jw.job_id, jw.worker_id, jw.is_lead, jw.status, jw.assigned_at, jw.started_at, jw.completed_at;