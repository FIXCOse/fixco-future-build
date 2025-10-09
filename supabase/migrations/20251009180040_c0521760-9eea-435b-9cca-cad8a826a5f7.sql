-- Skapa storage bucket för booking-bilder om den inte finns
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'booking-attachments',
  'booking-attachments', 
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE
SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']::text[];

-- Drop befintliga policies om de finns
DROP POLICY IF EXISTS "Anyone can upload booking attachments" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view booking attachments" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete booking attachments" ON storage.objects;

-- Policy: Alla kan ladda upp bilder
CREATE POLICY "Anyone can upload booking attachments"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'booking-attachments');

-- Policy: Alla kan läsa bilder (eftersom bucketen är public)
CREATE POLICY "Anyone can view booking attachments"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'booking-attachments');

-- Policy: Admin kan radera bilder
CREATE POLICY "Admin can delete booking attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'booking-attachments' 
  AND is_admin_or_owner()
);