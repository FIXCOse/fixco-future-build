-- Update staff table to link with profiles
UPDATE staff 
SET user_id = (
  SELECT id FROM profiles 
  WHERE profiles.email = staff.email 
  LIMIT 1
)
WHERE user_id IS NULL AND email IS NOT NULL;

-- Add RLS policy for staff deletion
CREATE POLICY "Admin can delete staff"
ON staff
FOR DELETE
TO authenticated
USING (is_admin_or_owner());

-- Update staff role to match profiles role
UPDATE staff s
SET role = CASE 
  WHEN p.role = 'worker' THEN 'technician'
  WHEN p.role IN ('technician', 'manager', 'admin') THEN p.role
  ELSE 'technician'
END
FROM profiles p
WHERE s.user_id = p.id;