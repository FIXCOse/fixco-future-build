-- Add DELETE policy for quote_questions so admins can delete questions
CREATE POLICY "Admin and owner can delete quote questions"
ON quote_questions
FOR DELETE
USING (
  (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = ANY (ARRAY['admin'::user_role, 'owner'::user_role])
  )) OR (auth.email() = ANY (ARRAY['omar@fixco.se'::text, 'imedashviliomar@gmail.com'::text]))
);

-- Add seen_at column to bookings for notification tracking
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS seen_at timestamptz DEFAULT NULL;