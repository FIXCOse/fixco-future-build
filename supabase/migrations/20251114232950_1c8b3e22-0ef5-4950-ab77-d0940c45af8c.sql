-- Enable UPDATE for admins and owners
CREATE POLICY "services_update_admin" ON public.services
  FOR UPDATE
  TO authenticated
  USING (is_admin_or_owner())
  WITH CHECK (is_admin_or_owner());

-- Enable INSERT for admins and owners
CREATE POLICY "services_insert_admin" ON public.services
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_or_owner());

-- Enable DELETE for admins and owners
CREATE POLICY "services_delete_admin" ON public.services
  FOR DELETE
  TO authenticated
  USING (is_admin_or_owner());