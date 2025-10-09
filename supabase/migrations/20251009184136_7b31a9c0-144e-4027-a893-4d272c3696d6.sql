-- Pragmatisk lösning: Gör pool jobs synliga för ALLA authenticated users
-- Application logic kan sedan filtrera baserat på role

DROP POLICY IF EXISTS jobs_select_worker ON public.jobs;

CREATE POLICY jobs_select_worker ON public.jobs
FOR SELECT TO authenticated
USING (
  -- Admin/owner ser alla jobb
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('owner', 'admin')
  -- Worker ser sina tilldelade jobb
  OR assigned_worker_id = auth.uid()
  -- Pool jobs är synliga för alla authenticated users (workers kan claima dem)
  OR (pool_enabled = true AND status = 'pool')
);