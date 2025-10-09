-- Skapa en dedikerad security definer funktion för att kolla worker role
-- Detta undviker RLS recursion problem
CREATE OR REPLACE FUNCTION public.check_user_is_worker()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() 
    AND role IN ('worker', 'technician')
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_user_is_worker() TO authenticated;

-- Uppdatera jobs RLS policy för att använda den nya funktionen
DROP POLICY IF EXISTS jobs_select_worker ON public.jobs;

CREATE POLICY jobs_select_worker ON public.jobs
FOR SELECT TO authenticated
USING (
  -- Admins/owners ser alla jobb
  is_admin_or_owner()
  -- Workers ser sina egna tilldelade jobb
  OR assigned_worker_id = auth.uid()
  -- Workers ser pool-jobb
  OR (pool_enabled = true AND status = 'pool' AND check_user_is_worker())
);