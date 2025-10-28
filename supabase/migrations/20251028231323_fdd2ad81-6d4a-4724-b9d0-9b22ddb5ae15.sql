-- Add missing RLS policies for user_roles table
-- These policies allow admins and owners to manage user roles

-- Allow admins and owners to insert roles
CREATE POLICY "admins_can_insert_roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin_or_owner());

-- Allow admins and owners to update roles
CREATE POLICY "admins_can_update_roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.is_admin_or_owner())
WITH CHECK (public.is_admin_or_owner());

-- Allow admins and owners to delete roles
CREATE POLICY "admins_can_delete_roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.is_admin_or_owner());