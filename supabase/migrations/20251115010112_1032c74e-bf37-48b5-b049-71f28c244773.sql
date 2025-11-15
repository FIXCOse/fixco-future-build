-- Add SELECT policy for admins and owners on services table
-- This fixes the is_active toggle issue by allowing admins to view all services
CREATE POLICY "services_select_admin" ON public.services
  FOR SELECT
  TO authenticated
  USING (is_admin_or_owner());