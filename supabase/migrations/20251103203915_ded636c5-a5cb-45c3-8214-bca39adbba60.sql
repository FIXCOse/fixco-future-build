-- Tillåt admin/owner att läsa alla kundfrågor
CREATE POLICY "Admin and owner can view all quote questions"
ON quote_questions FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
  OR auth.email() IN ('omar@fixco.se', 'imedashviliomar@gmail.com')
);

-- Tillåt admin/owner att uppdatera frågor (markera som besvarad)
CREATE POLICY "Admin and owner can update quote questions"
ON quote_questions FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
  OR auth.email() IN ('omar@fixco.se', 'imedashviliomar@gmail.com')
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
  OR auth.email() IN ('omar@fixco.se', 'imedashviliomar@gmail.com')
);

-- Aktivera realtime för quote_questions
ALTER TABLE quote_questions REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE quote_questions;