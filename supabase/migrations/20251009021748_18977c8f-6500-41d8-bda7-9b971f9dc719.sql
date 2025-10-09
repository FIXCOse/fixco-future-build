-- Skapa storage bucket för quote-meddelanden
INSERT INTO storage.buckets (id, name, public) 
VALUES ('quote-messages', 'quote-messages', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies för quote-messages bucket
CREATE POLICY "Admins can upload to quote-messages"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'quote-messages' 
  AND (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'owner')
);

CREATE POLICY "Public can upload change requests"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'quote-messages');

CREATE POLICY "Admins can view quote-messages"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'quote-messages' 
  AND (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'owner')
);

CREATE POLICY "Public can view via token"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'quote-messages');