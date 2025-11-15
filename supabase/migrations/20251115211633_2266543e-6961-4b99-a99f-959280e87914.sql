-- Add thumbnail_image column to reference_projects table
-- This allows admins to select a specific image as the thumbnail instead of always using the first image

ALTER TABLE reference_projects 
ADD COLUMN thumbnail_image text;

COMMENT ON COLUMN reference_projects.thumbnail_image IS 
'URL to the image that should be used as thumbnail. If null, falls back to first image in images array.';