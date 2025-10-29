-- Add RLS policies for staff table

-- Admins and owners can see all staff
CREATE POLICY "staff_select_admin_owner"
ON public.staff
FOR SELECT
TO authenticated
USING (
  public.is_admin_or_owner()
);

-- Workers can see their own staff record
CREATE POLICY "staff_select_own"
ON public.staff
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
);

-- Admins and owners can insert staff
CREATE POLICY "staff_insert_admin_owner"
ON public.staff
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin_or_owner()
);

-- Admins and owners can update staff
CREATE POLICY "staff_update_admin_owner"
ON public.staff
FOR UPDATE
TO authenticated
USING (
  public.is_admin_or_owner()
)
WITH CHECK (
  public.is_admin_or_owner()
);

-- Admins and owners can delete staff
CREATE POLICY "staff_delete_admin_owner"
ON public.staff
FOR DELETE
TO authenticated
USING (
  public.is_admin_or_owner()
);