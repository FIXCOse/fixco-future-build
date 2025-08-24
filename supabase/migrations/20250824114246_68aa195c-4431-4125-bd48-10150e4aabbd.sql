-- Update the properties table to accept any text value for type
-- Remove the old enum constraint if it exists and allow any text
ALTER TABLE properties ALTER COLUMN type TYPE text;