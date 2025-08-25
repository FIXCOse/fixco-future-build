-- First check what roles exist in the table
SELECT role, COUNT(*) as count FROM staff GROUP BY role;