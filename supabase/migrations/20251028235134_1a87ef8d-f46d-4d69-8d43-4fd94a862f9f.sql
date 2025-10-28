-- Add UPDATE policy for admins to update any profile's basic information
-- This does NOT give users ability to change roles (roles are in user_roles table)
CREATE POLICY "profiles_update_admin"
ON public.profiles
FOR UPDATE
TO public
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());