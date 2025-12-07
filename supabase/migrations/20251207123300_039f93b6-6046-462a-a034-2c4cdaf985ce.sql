-- ============================================
-- SÄKERHETSFIX: Komplett migreringsplan
-- ============================================

-- 1) GE imedashviliomar@gmail.com ADMIN-ROLL (MÅSTE KÖRAS FÖRST!)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::user_role 
FROM auth.users 
WHERE email = 'imedashviliomar@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- 2) TA BORT HARDCODED EMAILS FRÅN RLS POLICIES

-- Bookings policies
DROP POLICY IF EXISTS "Admins and owners can manage all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins and owners can view all bookings" ON public.bookings;

CREATE POLICY "Admins and owners can manage all bookings"
ON public.bookings FOR ALL TO authenticated
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

CREATE POLICY "Admins and owners can view all bookings"
ON public.bookings FOR SELECT TO authenticated
USING (is_admin_or_owner());

-- Job requests policies
DROP POLICY IF EXISTS "Admins and owners can manage all job requests" ON public.job_requests;
DROP POLICY IF EXISTS "Admins and owners can view all job requests" ON public.job_requests;

CREATE POLICY "Admins and owners can manage all job requests"
ON public.job_requests FOR ALL TO authenticated
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

CREATE POLICY "Admins and owners can view all job requests"
ON public.job_requests FOR SELECT TO authenticated
USING (is_admin_or_owner());

-- Leads policies
DROP POLICY IF EXISTS "Admins and owners can manage all leads" ON public.leads;
DROP POLICY IF EXISTS "Admins and owners can view all leads" ON public.leads;

CREATE POLICY "Admins and owners can manage all leads"
ON public.leads FOR ALL TO authenticated
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

CREATE POLICY "Admins and owners can view all leads"
ON public.leads FOR SELECT TO authenticated
USING (is_admin_or_owner());

-- Quote questions policies  
DROP POLICY IF EXISTS "Admins and owners can delete questions" ON public.quote_questions;
DROP POLICY IF EXISTS "Admins and owners can update questions" ON public.quote_questions;
DROP POLICY IF EXISTS "Admins and owners can view all questions" ON public.quote_questions;

CREATE POLICY "Admins and owners can delete questions"
ON public.quote_questions FOR DELETE TO authenticated
USING (is_admin_or_owner());

CREATE POLICY "Admins and owners can update questions"
ON public.quote_questions FOR UPDATE TO authenticated
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

CREATE POLICY "Admins and owners can view all questions"
ON public.quote_questions FOR SELECT TO authenticated
USING (is_admin_or_owner());

-- Quotes_new policy
DROP POLICY IF EXISTS "Admins and owners can manage all quotes" ON public.quotes_new;

CREATE POLICY "Admins and owners can manage all quotes"
ON public.quotes_new FOR ALL TO authenticated
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

-- 3) SÄKRA worker_daily_stats MED RLS
ALTER TABLE public.worker_daily_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all worker stats" ON public.worker_daily_stats;
DROP POLICY IF EXISTS "Workers can view own stats" ON public.worker_daily_stats;

CREATE POLICY "Admins can view all worker stats"
ON public.worker_daily_stats FOR SELECT TO authenticated
USING (is_admin_or_owner());

CREATE POLICY "Workers can view own stats"
ON public.worker_daily_stats FOR SELECT TO authenticated
USING (worker_id = auth.uid());

-- 4) LÄGG TILL POLICIES FÖR activity_log
DROP POLICY IF EXISTS "Admins can view activity log" ON public.activity_log;
DROP POLICY IF EXISTS "System can insert activity" ON public.activity_log;

CREATE POLICY "Admins can view activity log"
ON public.activity_log FOR SELECT TO authenticated
USING (is_admin_or_owner());

CREATE POLICY "System can insert activity"
ON public.activity_log FOR INSERT TO authenticated
WITH CHECK (true);

-- 5) LÄGG TILL POLICIES FÖR job_events
DROP POLICY IF EXISTS "Admins can view all job events" ON public.job_events;
DROP POLICY IF EXISTS "Workers can view own job events" ON public.job_events;
DROP POLICY IF EXISTS "System can insert events" ON public.job_events;

CREATE POLICY "Admins can view all job events"
ON public.job_events FOR SELECT TO authenticated
USING (is_admin_or_owner());

CREATE POLICY "Workers can view own job events"
ON public.job_events FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.jobs 
    WHERE jobs.id = job_events.job_id 
    AND jobs.assigned_worker_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM public.job_workers
    WHERE job_workers.job_id = job_events.job_id
    AND job_workers.worker_id = auth.uid()
  )
);

CREATE POLICY "System can insert events"
ON public.job_events FOR INSERT TO authenticated
WITH CHECK (true);

-- 6) FIXA DEPRECATED is_owner() FUNKTION
CREATE OR REPLACE FUNCTION public.is_owner(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(user_uuid, 'owner')
$$;