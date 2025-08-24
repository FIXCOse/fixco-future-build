-- 1) Add owner_welcome_at column to track when owner welcome was shown
ALTER TABLE profiles
ADD COLUMN owner_welcome_at timestamptz NULL;

-- 2) Create user_role enum (if not exists) and add role column
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('OWNER','ADMIN','TECH','USER');
    END IF;
END $$;

ALTER TABLE profiles
ADD COLUMN role user_role NOT NULL DEFAULT 'USER';

-- 3) Set Omar as OWNER (update with correct email)
UPDATE profiles
SET role = 'OWNER'
WHERE email = 'omar@dinadress.se';

-- 4) Ensure RLS policies allow users to update their own profiles
-- The existing policies should already cover this, but let's make sure
-- profiles_update_own policy should allow updating own profile including new columns