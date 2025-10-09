-- Insert staff record for worker user
INSERT INTO staff (
  user_id,
  name,
  email,
  phone,
  role,
  hourly_rate,
  active
)
SELECT 
  p.id,
  COALESCE(p.first_name || ' ' || p.last_name, p.full_name, p.email),
  p.email,
  p.phone,
  CASE 
    WHEN p.role = 'worker' THEN 'technician'
    ELSE p.role
  END,
  280,
  true
FROM profiles p
WHERE p.role IN ('worker', 'technician', 'manager', 'admin')
  AND NOT EXISTS (
    SELECT 1 FROM staff s WHERE s.user_id = p.id
  );