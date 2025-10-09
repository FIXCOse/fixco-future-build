-- Add 'worker' as valid role
ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles 
  ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('owner', 'admin', 'manager', 'worker', 'technician', 'finance', 'support', 'customer'));

-- Now update the user to have worker role
UPDATE profiles 
SET role = 'worker' 
WHERE email = 'imedashviliomar@gmail.com';