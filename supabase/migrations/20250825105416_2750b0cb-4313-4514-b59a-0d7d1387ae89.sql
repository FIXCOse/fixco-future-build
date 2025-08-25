-- Remove the constraint entirely first
ALTER TABLE staff DROP CONSTRAINT IF EXISTS staff_role_check;

-- Clean up any problematic data - normalize all roles to English
UPDATE staff SET role = CASE
  WHEN role IN ('Elektriker', 'El') THEN 'technician'
  WHEN role IN ('VVS', 'Rörmokare') THEN 'technician' 
  WHEN role IN ('Snickare', 'Snickeri') THEN 'technician'
  WHEN role IN ('Admin', 'Administrator') THEN 'admin'
  WHEN role IN ('Koordinator', 'Chef') THEN 'manager'
  WHEN role = 'technician' THEN 'technician'
  WHEN role = 'manager' THEN 'manager'
  WHEN role = 'admin' THEN 'admin'
  WHEN role = 'coordinator' THEN 'coordinator'
  WHEN role = 'support' THEN 'support'
  ELSE 'technician' -- Default fallback
END;

-- Now add the constraint with correct values
ALTER TABLE staff 
ADD CONSTRAINT staff_role_check 
CHECK (role IN ('technician', 'manager', 'admin', 'coordinator', 'support'));