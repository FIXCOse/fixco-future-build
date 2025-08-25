-- Update staff table role constraint to match our component values
ALTER TABLE staff DROP CONSTRAINT IF EXISTS staff_role_check;

-- Add new constraint with proper role values
ALTER TABLE staff 
ADD CONSTRAINT staff_role_check 
CHECK (role IN ('technician', 'manager', 'admin', 'coordinator', 'support'));

-- Also make sure to handle any existing data
UPDATE staff 
SET role = CASE 
  WHEN role = 'Elektriker' THEN 'technician'
  WHEN role = 'VVS' THEN 'technician' 
  WHEN role = 'Snickare' THEN 'technician'
  WHEN role = 'Admin' THEN 'admin'
  WHEN role = 'Koordinator' THEN 'coordinator'
  ELSE role
END
WHERE role IN ('Elektriker','VVS','Snickare','Admin','Koordinator');