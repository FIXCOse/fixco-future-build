-- Ta bort den komplexa RLS policyn och gör en enklare version
-- som faktiskt fungerar med Supabase JavaScript client
DROP POLICY IF EXISTS jobs_select_worker ON public.jobs;

-- Skapa en policy som tillåter authenticated users att se pool jobs
-- och workers att se sina egna tilldelade jobb
CREATE POLICY jobs_select_worker ON public.jobs
FOR SELECT TO authenticated
USING (
  -- Check 1: User är admin/owner (kan se alla jobb)
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
  -- Check 2: Jobbet är tilldelat till användaren
  OR assigned_worker_id = auth.uid()
  -- Check 3: Jobbet är i poolen OCH användaren är worker
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

-- Säkerställ att profiles table har SELECT policy för authenticated users
DROP POLICY IF EXISTS profiles_select_for_rls ON public.profiles;

CREATE POLICY profiles_select_for_rls ON public.profiles
FOR SELECT TO authenticated
USING (true);