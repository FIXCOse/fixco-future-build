-- Fix circular RLS dependency on user_roles table

-- Drop the problematic policy that causes circular reference
DROP POLICY IF EXISTS "user_roles_select_own_or_admin" ON public.user_roles;

-- Create new policy: Users can ALWAYS see their own roles (no circular reference)
CREATE POLICY "user_roles_select_own"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
);

-- Separate policy: Admins/owners can see ALL roles
-- This works because users can already read their OWN roles via the policy above,
-- so is_admin_or_owner() will function correctly
CREATE POLICY "user_roles_select_admin"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  public.is_admin_or_owner()
);