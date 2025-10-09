-- Tillåt owner/admin att se alla jobb i poolen (för testning och övervakning)
DROP POLICY IF EXISTS jobs_select_worker ON public.jobs;

CREATE POLICY jobs_select_worker ON public.jobs
FOR SELECT TO authenticated
USING (
  is_admin_or_owner()  -- Admins/owners ser alla jobb
  OR assigned_worker_id = auth.uid()  -- Workers ser sina egna jobb
  OR (pool_enabled = true AND status = 'pool' AND is_worker())  -- Workers ser pool-jobb
);