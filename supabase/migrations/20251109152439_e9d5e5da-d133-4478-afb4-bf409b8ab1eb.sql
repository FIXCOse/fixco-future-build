-- Add multilingual columns for reference projects
ALTER TABLE reference_projects
  ADD COLUMN title_sv TEXT,
  ADD COLUMN title_en TEXT,
  ADD COLUMN description_sv TEXT,
  ADD COLUMN description_en TEXT,
  ADD COLUMN location_sv TEXT,
  ADD COLUMN location_en TEXT,
  ADD COLUMN category_sv TEXT,
  ADD COLUMN category_en TEXT,
  ADD COLUMN features_sv TEXT[],
  ADD COLUMN features_en TEXT[];

-- Migrate existing data to Swedish columns
UPDATE reference_projects
SET 
  title_sv = title,
  description_sv = description,
  location_sv = location,
  category_sv = category,
  features_sv = features
WHERE title_sv IS NULL;

-- Make Swedish fields required
ALTER TABLE reference_projects
  ALTER COLUMN title_sv SET NOT NULL,
  ALTER COLUMN description_sv SET NOT NULL,
  ALTER COLUMN location_sv SET NOT NULL,
  ALTER COLUMN category_sv SET NOT NULL,
  ALTER COLUMN features_sv SET NOT NULL,
  ALTER COLUMN features_sv SET DEFAULT '{}';

COMMENT ON COLUMN reference_projects.title_sv IS 'Swedish title (required)';
COMMENT ON COLUMN reference_projects.title_en IS 'English title (optional)';
COMMENT ON COLUMN reference_projects.description_sv IS 'Swedish description (required)';
COMMENT ON COLUMN reference_projects.description_en IS 'English description (optional)';
COMMENT ON COLUMN reference_projects.location_sv IS 'Swedish location (required)';
COMMENT ON COLUMN reference_projects.location_en IS 'English location (optional)';
COMMENT ON COLUMN reference_projects.category_sv IS 'Swedish category (required)';
COMMENT ON COLUMN reference_projects.category_en IS 'English category (optional)';
COMMENT ON COLUMN reference_projects.features_sv IS 'Swedish features array (required)';
COMMENT ON COLUMN reference_projects.features_en IS 'English features array (optional)';