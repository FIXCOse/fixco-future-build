-- Fix user_roles_update_admin policy by adding missing WITH CHECK clause
-- This ensures admins/owners can update roles securely

-- Drop the old policy
DROP POLICY IF EXISTS "user_roles_update_admin" ON public.user_roles;

-- Recreate with both USING and WITH CHECK clauses
CREATE POLICY "user_roles_update_admin"
ON public.user_roles
FOR UPDATE
TO public
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());