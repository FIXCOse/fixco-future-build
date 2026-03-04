-- Step 1: Fix RLS — Allow admin/owner to read all events
DROP POLICY IF EXISTS "events_select_own" ON events;
CREATE POLICY "events_select_all_for_admin"
  ON events FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR is_admin_or_owner()
  );

-- Step 2: Enable Realtime on events table
ALTER PUBLICATION supabase_realtime ADD TABLE events;