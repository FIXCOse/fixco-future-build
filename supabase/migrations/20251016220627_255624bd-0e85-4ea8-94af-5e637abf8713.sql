-- Add locale column to site_content table
ALTER TABLE site_content ADD COLUMN IF NOT EXISTS locale text DEFAULT 'sv';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_site_content_locale ON site_content(locale);

-- Create index for content_id and locale combination
CREATE INDEX IF NOT EXISTS idx_site_content_content_id_locale ON site_content(content_id, locale);

-- Update existing content to have 'sv' locale
UPDATE site_content SET locale = 'sv' WHERE locale IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN site_content.locale IS 'Language code (sv, en) for multilingual content support';