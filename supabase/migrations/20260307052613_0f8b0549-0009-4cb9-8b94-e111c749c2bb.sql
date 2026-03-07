
-- ============================================
-- Add missing RLS policies for tables flagged in security scan
-- ============================================

-- 1. payroll_entries: admin or own worker
CREATE POLICY "payroll_entries_select_admin_or_own"
ON public.payroll_entries FOR SELECT
TO authenticated
USING (
  is_admin_or_owner()
  OR worker_id = auth.uid()
);

-- 2. payroll_periods: admin only
CREATE POLICY "payroll_periods_select_admin"
ON public.payroll_periods FOR SELECT
TO authenticated
USING (is_admin_or_owner());

CREATE POLICY "payroll_periods_insert_admin"
ON public.payroll_periods FOR INSERT
TO authenticated
WITH CHECK (is_admin_or_owner());

CREATE POLICY "payroll_periods_update_admin"
ON public.payroll_periods FOR UPDATE
TO authenticated
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

CREATE POLICY "payroll_periods_delete_admin"
ON public.payroll_periods FOR DELETE
TO authenticated
USING (is_admin_or_owner());

-- 3. system_settings: admin only
CREATE POLICY "system_settings_select_admin"
ON public.system_settings FOR SELECT
TO authenticated
USING (is_admin_or_owner());

CREATE POLICY "system_settings_manage_admin"
ON public.system_settings FOR ALL
TO authenticated
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

-- 4. app_settings: admin only
CREATE POLICY "app_settings_select_admin"
ON public.app_settings FOR SELECT
TO authenticated
USING (is_admin_or_owner());

CREATE POLICY "app_settings_manage_admin"
ON public.app_settings FOR ALL
TO authenticated
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

-- 5. work_orders: admin or assigned staff
CREATE POLICY "work_orders_select_admin_or_assigned"
ON public.work_orders FOR SELECT
TO authenticated
USING (
  is_admin_or_owner()
  OR staff_id IN (SELECT id FROM staff WHERE user_id = auth.uid())
);

CREATE POLICY "work_orders_manage_admin"
ON public.work_orders FOR ALL
TO authenticated
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

-- 6. worker_assignments: admin or own worker
CREATE POLICY "worker_assignments_select_admin_or_own"
ON public.worker_assignments FOR SELECT
TO authenticated
USING (
  is_admin_or_owner()
  OR worker_id = auth.uid()
);

CREATE POLICY "worker_assignments_manage_admin"
ON public.worker_assignments FOR ALL
TO authenticated
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

-- 7. dispatch_queue: admin only
CREATE POLICY "dispatch_queue_select_admin"
ON public.dispatch_queue FOR SELECT
TO authenticated
USING (is_admin_or_owner());

CREATE POLICY "dispatch_queue_manage_admin"
ON public.dispatch_queue FOR ALL
TO authenticated
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

-- 8. edit_locks: authenticated users (needed for CMS editing)
CREATE POLICY "edit_locks_select_authenticated"
ON public.edit_locks FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "edit_locks_manage_admin"
ON public.edit_locks FOR ALL
TO authenticated
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

-- 9. quote_rejections: admin SELECT (already has public INSERT)
CREATE POLICY "quote_rejections_select_admin"
ON public.quote_rejections FOR SELECT
TO authenticated
USING (is_admin_or_owner());

-- 10. quote_reminders: admin SELECT (already has public INSERT)
CREATE POLICY "quote_reminders_select_admin"
ON public.quote_reminders FOR SELECT
TO authenticated
USING (is_admin_or_owner());

-- 11. quotes (old table): admin only
CREATE POLICY "quotes_select_admin"
ON public.quotes FOR SELECT
TO authenticated
USING (is_admin_or_owner());

CREATE POLICY "quotes_manage_admin"
ON public.quotes FOR ALL
TO authenticated
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

-- 12. projects: add admin SELECT (already has customer view)
CREATE POLICY "projects_select_admin"
ON public.projects FOR SELECT
TO authenticated
USING (is_admin_or_owner());

CREATE POLICY "projects_manage_admin"
ON public.projects FOR ALL
TO authenticated
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

-- 13. workers: drop overly permissive policy, add admin-only
DROP POLICY IF EXISTS "Workers can view themselves" ON public.workers;

CREATE POLICY "workers_select_admin"
ON public.workers FOR SELECT
TO authenticated
USING (is_admin_or_owner());

CREATE POLICY "workers_manage_admin"
ON public.workers FOR ALL
TO authenticated
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

-- 14. worker_profiles: add SELECT for admin and own
CREATE POLICY "worker_profiles_select_admin_or_own"
ON public.worker_profiles FOR SELECT
TO authenticated
USING (
  is_admin_or_owner()
  OR user_id = auth.uid()
);
