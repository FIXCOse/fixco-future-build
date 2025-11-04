-- Step 1: Create RLS policies for job_photos table
ALTER TABLE job_photos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "job_photos_insert_assigned_worker" ON job_photos;
DROP POLICY IF EXISTS "job_photos_select_assigned_worker" ON job_photos;
DROP POLICY IF EXISTS "job_photos_admin_all" ON job_photos;

-- Workers can INSERT photos for jobs they're assigned to
CREATE POLICY "job_photos_insert_assigned_worker"
ON job_photos
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM jobs j 
    WHERE j.id = job_id 
    AND j.assigned_worker_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM job_workers jw
    WHERE jw.job_id = job_id
    AND jw.worker_id = auth.uid()
  )
);

-- Workers can SELECT photos for their assigned jobs
CREATE POLICY "job_photos_select_assigned_worker"
ON job_photos
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM jobs j 
    WHERE j.id = job_id 
    AND j.assigned_worker_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM job_workers jw
    WHERE jw.job_id = job_id
    AND jw.worker_id = auth.uid()
  )
);

-- Admins can do everything
CREATE POLICY "job_photos_admin_all"
ON job_photos
FOR ALL
TO authenticated
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

-- Step 2: Create Storage policies for job-photos bucket
-- Drop existing policies if any
DROP POLICY IF EXISTS "job_photos_upload_assigned_worker" ON storage.objects;
DROP POLICY IF EXISTS "job_photos_read_assigned_worker" ON storage.objects;
DROP POLICY IF EXISTS "job_photos_storage_admin_all" ON storage.objects;

-- Workers can upload photos for their assigned jobs
CREATE POLICY "job_photos_upload_assigned_worker"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'job-photos'
  AND (
    EXISTS (
      SELECT 1 FROM jobs j
      WHERE j.id::text = split_part(name, '/', 1)
      AND (
        j.assigned_worker_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM job_workers jw
          WHERE jw.job_id = j.id
          AND jw.worker_id = auth.uid()
        )
      )
    )
    OR is_admin_or_owner()
  )
);

-- Workers can read photos from their jobs
CREATE POLICY "job_photos_read_assigned_worker"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'job-photos'
  AND (
    EXISTS (
      SELECT 1 FROM jobs j
      WHERE j.id::text = split_part(name, '/', 1)
      AND (
        j.assigned_worker_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM job_workers jw
          WHERE jw.job_id = j.id
          AND jw.worker_id = auth.uid()
        )
      )
    )
    OR is_admin_or_owner()
  )
);

-- Admins can do everything
CREATE POLICY "job_photos_storage_admin_all"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'job-photos'
  AND is_admin_or_owner()
)
WITH CHECK (
  bucket_id = 'job-photos'
  AND is_admin_or_owner()
);

-- Step 4: Make job-photos bucket public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'job-photos';