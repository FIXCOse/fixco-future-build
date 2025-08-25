-- Enhance staff table with complete personal information and unique ID system
ALTER TABLE staff ADD COLUMN IF NOT EXISTS staff_id SERIAL UNIQUE;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC DEFAULT 0;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS invitation_sent_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS invitation_accepted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE staff ADD COLUMN IF NOT EXISTS invited_by UUID REFERENCES auth.users(id);

-- Create skills table for managing all available skills
CREATE TABLE IF NOT EXISTS skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on skills table
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Create policy for skills (admin/owner can manage, all can read)
CREATE POLICY "Skills select all" ON skills FOR SELECT USING (true);
CREATE POLICY "Skills admin manage" ON skills FOR ALL USING (is_admin_or_owner());

-- Create service_skills junction table to link services with required skills
CREATE TABLE IF NOT EXISTS service_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id TEXT NOT NULL,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  required BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on service_skills table
ALTER TABLE service_skills ENABLE ROW LEVEL SECURITY;

-- Create policies for service_skills
CREATE POLICY "Service skills select all" ON service_skills FOR SELECT USING (true);
CREATE POLICY "Service skills admin manage" ON service_skills FOR ALL USING (is_admin_or_owner());

-- Create staff_skills junction table to link staff with their skills
CREATE TABLE IF NOT EXISTS staff_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 5), -- 1-5 skill level
  certified_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(staff_id, skill_id)
);

-- Enable RLS on staff_skills table
ALTER TABLE staff_skills ENABLE ROW LEVEL SECURITY;

-- Create policies for staff_skills
CREATE POLICY "Staff skills select all" ON staff_skills FOR SELECT USING (true);
CREATE POLICY "Staff skills admin manage" ON staff_skills FOR ALL USING (is_admin_or_owner());

-- Create job_requests table for manual job assignments
CREATE TABLE IF NOT EXISTS job_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  message TEXT,
  response_message TEXT,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  responded_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '24 hours')
);

-- Enable RLS on job_requests table
ALTER TABLE job_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for job_requests
CREATE POLICY "Job requests admin manage" ON job_requests FOR ALL USING (is_admin_or_owner());
CREATE POLICY "Job requests staff view own" ON job_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM staff WHERE staff.id = job_requests.staff_id AND staff.user_id = auth.uid())
);
CREATE POLICY "Job requests staff respond" ON job_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM staff WHERE staff.id = job_requests.staff_id AND staff.user_id = auth.uid())
);

-- Insert some default skills
INSERT INTO skills (name, description, category) VALUES
('VVS', 'Vatten, värme och sanitet', 'plumbing'),
('El', 'Elektriska installationer', 'electrical'),
('Målning', 'Målerarbeten', 'painting'),
('Tiling', 'Kakelläggning', 'tiling'),
('Golv', 'Golvläggning', 'flooring'),
('Snickeri', 'Allmänt snickeriarbete', 'carpentry'),
('Bygg', 'Allmänt byggarbete', 'construction'),
('Tak', 'Takarbeten', 'roofing'),
('Ventilation', 'Ventilationssystem', 'hvac'),
('Smart Home', 'Smart hem-installationer', 'technology')
ON CONFLICT (name) DO NOTHING;

-- Create function to get next staff ID
CREATE OR REPLACE FUNCTION get_next_staff_id()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  next_id INTEGER;
BEGIN
  SELECT COALESCE(MAX(staff_id), 0) + 1 INTO next_id FROM staff;
  RETURN next_id;
END;
$$;

-- Create trigger to auto-assign staff_id if not provided
CREATE OR REPLACE FUNCTION assign_staff_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.staff_id IS NULL THEN
    NEW.staff_id := get_next_staff_id();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER assign_staff_id_trigger
BEFORE INSERT ON staff
FOR EACH ROW
EXECUTE FUNCTION assign_staff_id();