-- Check what constraints exist on staff table
SELECT constraint_name, constraint_type, check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'staff';