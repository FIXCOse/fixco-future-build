-- Allow admin/owner to upload images to reference-projects bucket
CREATE POLICY "Admin and owner can upload reference project images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'reference-projects'
  AND (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = ANY (ARRAY['admin'::user_role, 'owner'::user_role])
    )
    OR auth.email() = ANY (ARRAY['omar@fixco.se', 'imedashviliomar@gmail.com'])
  )
);

-- Allow admin/owner to update images in reference-projects bucket
CREATE POLICY "Admin and owner can update reference project images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'reference-projects'
  AND (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = ANY (ARRAY['admin'::user_role, 'owner'::user_role])
    )
    OR auth.email() = ANY (ARRAY['omar@fixco.se', 'imedashviliomar@gmail.com'])
  )
);

-- Allow admin/owner to delete images from reference-projects bucket
CREATE POLICY "Admin and owner can delete reference project images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'reference-projects'
  AND (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = ANY (ARRAY['admin'::user_role, 'owner'::user_role])
    )
    OR auth.email() = ANY (ARRAY['omar@fixco.se', 'imedashviliomar@gmail.com'])
  )
);