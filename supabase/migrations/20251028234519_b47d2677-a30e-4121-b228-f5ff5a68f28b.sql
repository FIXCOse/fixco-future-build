-- Add SELECT policy for profiles table
-- Users can view their own profile, admins/owners can view all profiles

CREATE POLICY "profiles_select_own_or_admin"
ON public.profiles
FOR SELECT
TO public
USING (
  id = auth.uid() 
  OR 
  is_admin_or_owner()
);

-- Add DELETE policy for admins to delete profiles
CREATE POLICY "profiles_delete_admin"
ON public.profiles
FOR DELETE
TO public
USING (is_admin_or_owner());

-- Add INSERT policy for admins to create profiles for any user
CREATE POLICY "profiles_insert_admin"
ON public.profiles
FOR INSERT
TO public
WITH CHECK (is_admin_or_owner());

-- Update existing INSERT policy to allow users to create their own profile OR admins to create any
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;

CREATE POLICY "profiles_insert_own_or_admin"
ON public.profiles
FOR INSERT
TO public
WITH CHECK (
  id = auth.uid()
  OR
  is_admin_or_owner()
);