-- Enable RLS on staff_skills if not already enabled
ALTER TABLE public.staff_skills ENABLE ROW LEVEL SECURITY;

-- Policy: Admins and owners can read all staff skills
CREATE POLICY "staff_skills_select_admin" 
ON public.staff_skills 
FOR SELECT 
TO authenticated
USING (public.is_admin_or_owner());

-- Policy: Admins and owners can insert staff skills
CREATE POLICY "staff_skills_insert_admin" 
ON public.staff_skills 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin_or_owner());

-- Policy: Admins and owners can update staff skills
CREATE POLICY "staff_skills_update_admin" 
ON public.staff_skills 
FOR UPDATE 
TO authenticated
USING (public.is_admin_or_owner())
WITH CHECK (public.is_admin_or_owner());

-- Policy: Admins and owners can delete staff skills
CREATE POLICY "staff_skills_delete_admin" 
ON public.staff_skills 
FOR DELETE 
TO authenticated
USING (public.is_admin_or_owner());