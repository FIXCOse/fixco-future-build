-- Fix RLS policy by inlining the role check instead of using function
DROP POLICY IF EXISTS jobs_select_worker ON public.jobs;

CREATE POLICY jobs_select_worker ON public.jobs
FOR SELECT TO authenticated
USING (
  -- Admins/owners ser alla jobb
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
  -- Workers ser sina egna tilldelade jobb
  OR assigned_worker_id = auth.uid()
  -- Workers ser pool-jobb (inline check istället för funktion)
  OR (
    pool_enabled = true 
    AND status = 'pool' 
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('worker', 'technician')
    )
  )
);