-- Fix admin visibility and enable realtime for bookings, leads, and job_requests

-- ============================================================================
-- RLS POLICIES FOR ADMIN/OWNER ACCESS
-- ============================================================================

-- Bookings: Allow admin/owner to view all bookings
CREATE POLICY "Admins and owners can view all bookings"
ON bookings FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
);

-- Leads: Allow admin/owner to view all leads
CREATE POLICY "Admins and owners can view all leads"
ON leads FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
);

-- Leads: Allow admin/owner to manage all leads
CREATE POLICY "Admins and owners can manage all leads"
ON leads FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
);

-- Job Requests: Allow admin/owner to view all job requests
CREATE POLICY "Admins and owners can view all job requests"
ON job_requests FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
);

-- Job Requests: Allow admin/owner to manage all job requests
CREATE POLICY "Admins and owners can manage all job requests"
ON job_requests FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'owner')
  )
);

-- ============================================================================
-- ENABLE REALTIME UPDATES
-- ============================================================================

-- Set REPLICA IDENTITY FULL for complete row data in realtime updates
ALTER TABLE bookings REPLICA IDENTITY FULL;
ALTER TABLE leads REPLICA IDENTITY FULL;
ALTER TABLE job_requests REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE leads;
ALTER PUBLICATION supabase_realtime ADD TABLE job_requests;