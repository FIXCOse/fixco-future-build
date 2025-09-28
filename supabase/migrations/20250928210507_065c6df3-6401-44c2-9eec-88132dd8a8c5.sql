-- Create storage bucket for reference project images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('reference-projects', 'reference-projects', true, 52428800, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

-- Create RLS policies for reference project images
CREATE POLICY "Anyone can view reference project images"
ON storage.objects FOR SELECT
USING (bucket_id = 'reference-projects');

CREATE POLICY "Admin/Owner can upload reference project images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'reference-projects' AND is_admin_or_owner());

CREATE POLICY "Admin/Owner can update reference project images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'reference-projects' AND is_admin_or_owner());

CREATE POLICY "Admin/Owner can delete reference project images"
ON storage.objects FOR DELETE
USING (bucket_id = 'reference-projects' AND is_admin_or_owner());