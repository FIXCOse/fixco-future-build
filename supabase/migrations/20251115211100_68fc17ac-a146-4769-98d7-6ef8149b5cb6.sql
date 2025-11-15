-- Add RLS policies for reference_projects table to allow admin/owner management

-- Policy for UPDATE
CREATE POLICY "Admin/Owner can update reference projects"
ON reference_projects
FOR UPDATE
TO authenticated
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

-- Policy for INSERT
CREATE POLICY "Admin/Owner can insert reference projects"
ON reference_projects
FOR INSERT
TO authenticated
WITH CHECK (is_admin_or_owner());

-- Policy for DELETE (soft delete support)
CREATE POLICY "Admin/Owner can delete reference projects"
ON reference_projects
FOR DELETE
TO authenticated
USING (is_admin_or_owner());

-- Enhanced SELECT policy for admins to see all projects (including inactive)
CREATE POLICY "Admin/Owner can view all reference projects"
ON reference_projects
FOR SELECT
TO authenticated
USING (is_admin_or_owner());