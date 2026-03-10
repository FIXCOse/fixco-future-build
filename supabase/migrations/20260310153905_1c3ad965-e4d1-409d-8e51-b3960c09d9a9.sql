
-- Create quote_images table
CREATE TABLE public.quote_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES public.quotes_new(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT,
  uploaded_by TEXT DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_quote_images_quote_id ON quote_images(quote_id);
ALTER TABLE quote_images ENABLE ROW LEVEL SECURITY;

-- Public insert (kund laddar upp via token)
CREATE POLICY "Public can insert images" ON quote_images FOR INSERT WITH CHECK (true);
-- Public select (för att visa bilder)
CREATE POLICY "Public can view images" ON quote_images FOR SELECT USING (true);
-- Admin full access
CREATE POLICY "Admin full access images" ON quote_images FOR ALL TO authenticated USING (public.is_admin_or_owner());

-- Storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('quote-customer-images', 'quote-customer-images', true, 10485760, 
  ARRAY['image/jpeg','image/png','image/webp','image/heic']);

-- Public upload policy
CREATE POLICY "Anyone can upload quote images" ON storage.objects 
  FOR INSERT WITH CHECK (bucket_id = 'quote-customer-images');
CREATE POLICY "Anyone can view quote images" ON storage.objects 
  FOR SELECT USING (bucket_id = 'quote-customer-images');
