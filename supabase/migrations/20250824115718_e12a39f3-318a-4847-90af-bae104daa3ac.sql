-- 1) Add owner_welcome_at column to track when owner welcome was shown
ALTER TABLE profiles
ADD COLUMN owner_welcome_at timestamptz NULL;

-- 2) Add role column to profiles using lowercase values to match the pattern
-- First check what enum values we should use by looking at existing patterns
CREATE TYPE profile_role AS ENUM ('owner','admin','tech','user');

ALTER TABLE profiles
ADD COLUMN role profile_role NOT NULL DEFAULT 'user';

-- 3) Set Omar as OWNER (update with correct email)
UPDATE profiles
SET role = 'owner'
WHERE email = 'omar@dinadress.se';

-- If no user with that email exists, we can create a sample one for testing
-- This will only insert if the user doesn't exist
INSERT INTO profiles (id, email, role, first_name)
SELECT 
    gen_random_uuid(),
    'omar@dinadress.se', 
    'owner',
    'Omar'
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'omar@dinadress.se');