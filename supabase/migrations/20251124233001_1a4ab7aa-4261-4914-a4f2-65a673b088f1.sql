-- Skapa quotes bucket om den inte finns
INSERT INTO storage.buckets (id, name, public)
VALUES ('quotes', 'quotes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Uppdatera invoices bucket till public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'invoices';

-- RLS policies för quotes bucket
CREATE POLICY "Authenticated users can upload quotes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'quotes');

CREATE POLICY "Public can view quotes"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'quotes');

CREATE POLICY "Authenticated users can delete quotes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'quotes');

-- RLS policies för invoices bucket
CREATE POLICY "Authenticated users can upload invoices"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'invoices');

CREATE POLICY "Public can view invoices"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'invoices');

CREATE POLICY "Authenticated users can delete invoices"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'invoices');