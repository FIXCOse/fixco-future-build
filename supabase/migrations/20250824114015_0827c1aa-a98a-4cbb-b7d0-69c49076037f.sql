-- Update property types to match the new Swedish property types
-- First check if the property type is already an enum or just text
DO $$
BEGIN
  -- If type is already an enum, we need to add the new values
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_type') THEN
    -- Add new enum values if they don't exist
    BEGIN
      ALTER TYPE property_type ADD VALUE IF NOT EXISTS 'Villa';
      ALTER TYPE property_type ADD VALUE IF NOT EXISTS 'Lägenhet';
      ALTER TYPE property_type ADD VALUE IF NOT EXISTS 'Radhus';
      ALTER TYPE property_type ADD VALUE IF NOT EXISTS 'BRF';
      ALTER TYPE property_type ADD VALUE IF NOT EXISTS 'Företagslokal';
      ALTER TYPE property_type ADD VALUE IF NOT EXISTS 'Butik';
      ALTER TYPE property_type ADD VALUE IF NOT EXISTS 'Kontor';
      ALTER TYPE property_type ADD VALUE IF NOT EXISTS 'Lager';
      ALTER TYPE property_type ADD VALUE IF NOT EXISTS 'Sommarstuga';
      ALTER TYPE property_type ADD VALUE IF NOT EXISTS 'Övrigt';
    EXCEPTION WHEN duplicate_object THEN
      -- Values already exist, continue
      NULL;
    END;
  ELSE
    -- The type column is just text, so we can use any values
    -- Update existing values to match new format
    UPDATE properties SET type = 'Villa' WHERE type = 'villa';
    UPDATE properties SET type = 'Lägenhet' WHERE type = 'lägenhet';
    UPDATE properties SET type = 'Kontor' WHERE type = 'kontor';
    UPDATE properties SET type = 'Företagslokal' WHERE type = 'lokal';
    UPDATE properties SET type = 'Övrigt' WHERE type = 'fastighet';
  END IF;
END
$$;