-- Ensure admin can view all bookings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' 
    AND policyname = 'Admin can view all bookings'
  ) THEN
    CREATE POLICY "Admin can view all bookings"
      ON bookings
      FOR SELECT
      TO authenticated
      USING (
        is_admin_or_owner()
      );
  END IF;
END $$;