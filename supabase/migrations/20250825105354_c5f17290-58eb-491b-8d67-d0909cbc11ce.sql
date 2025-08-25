-- Add updated_at column to staff table if it doesn't exist
ALTER TABLE staff ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Update existing data to match new English values
UPDATE staff 
SET role = 'technician'
WHERE role = 'Snickare';

-- Now we can safely drop the old constraint and add the new one
ALTER TABLE staff DROP CONSTRAINT IF EXISTS staff_role_check;

-- Add new constraint with proper role values
ALTER TABLE staff 
ADD CONSTRAINT staff_role_check 
CHECK (role IN ('technician', 'manager', 'admin', 'coordinator', 'support'));