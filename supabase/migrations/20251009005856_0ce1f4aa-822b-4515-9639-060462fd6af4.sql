-- Allow admins and owners to update any profile
CREATE POLICY "Admin can update all profiles"
ON public.profiles
FOR UPDATE
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

-- Allow admins and owners to manage user roles (as they need to update roles)
CREATE POLICY "Admin can delete profiles"
ON public.profiles
FOR DELETE
USING (is_admin_or_owner());