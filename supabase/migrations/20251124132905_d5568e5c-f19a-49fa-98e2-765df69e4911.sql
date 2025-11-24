-- Add vat_included column to quotes_new table
ALTER TABLE quotes_new 
ADD COLUMN IF NOT EXISTS vat_included boolean DEFAULT false;

COMMENT ON COLUMN quotes_new.vat_included IS 'Indicates if VAT is included in the prices (true) or added on top (false)';
