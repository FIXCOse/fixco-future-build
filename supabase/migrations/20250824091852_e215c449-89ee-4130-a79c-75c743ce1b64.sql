-- Fix remaining functions with search_path
CREATE OR REPLACE FUNCTION set_quote_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quote_number IS NULL THEN
    NEW.quote_number = generate_quote_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION set_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invoice_number IS NULL THEN
    NEW.invoice_number = generate_invoice_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]),
  ('property-photos', 'property-photos', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]),
  ('booking-attachments', 'booking-attachments', false, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']::text[]),
  ('invoices', 'invoices', false, 10485760, ARRAY['application/pdf']::text[]);

-- Storage policies for avatars (public)
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for property photos
CREATE POLICY "Property photos viewable by owner/org members" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'property-photos' 
  AND (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM public.properties p 
      JOIN public.organization_members om ON p.organization_id = om.organization_id
      WHERE p.id::text = (storage.foldername(name))[2]
      AND om.user_id = auth.uid()
    )
  )
);

CREATE POLICY "Property photos uploadable by owner/org members" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'property-photos' 
  AND (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM public.properties p 
      JOIN public.organization_members om ON p.organization_id = om.organization_id
      WHERE p.id::text = (storage.foldername(name))[2]
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'beställare')
    )
  )
);

-- Storage policies for booking attachments
CREATE POLICY "Booking attachments viewable by customer/technician/org" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'booking-attachments' 
  AND EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id::text = (storage.foldername(name))[1]
    AND (
      b.customer_id = auth.uid() OR
      b.technician_id = auth.uid() OR
      (b.organization_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.organization_members om
        WHERE om.organization_id = b.organization_id
        AND om.user_id = auth.uid()
      ))
    )
  )
);

CREATE POLICY "Booking attachments uploadable by customer/technician/org" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'booking-attachments' 
  AND EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id::text = (storage.foldername(name))[1]
    AND (
      b.customer_id = auth.uid() OR
      b.technician_id = auth.uid() OR
      (b.organization_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.organization_members om
        WHERE om.organization_id = b.organization_id
        AND om.user_id = auth.uid()
      ))
    )
  )
);

-- Storage policies for invoices
CREATE POLICY "Invoices viewable by customer/org" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'invoices' 
  AND EXISTS (
    SELECT 1 FROM public.invoices i
    WHERE i.id::text = (storage.foldername(name))[1]
    AND (
      i.customer_id = auth.uid() OR
      (i.organization_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.organization_members om
        WHERE om.organization_id = i.organization_id
        AND om.user_id = auth.uid()
      ))
    )
  )
);

CREATE POLICY "Invoices uploadable by service" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'invoices'); -- Controlled by edge functions