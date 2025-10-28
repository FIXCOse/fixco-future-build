-- Fix profiles_update_own policy by adding WITH CHECK clause
-- This resolves the policy conflict when combined with profiles_update_admin

-- Drop the old policy that lacks WITH CHECK
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

-- Recreate with both USING and WITH CHECK to prevent policy conflicts
CREATE POLICY "profiles_update_own"
ON public.profiles
FOR UPDATE
TO public
USING (id = auth.uid())
WITH CHECK (id = auth.uid());