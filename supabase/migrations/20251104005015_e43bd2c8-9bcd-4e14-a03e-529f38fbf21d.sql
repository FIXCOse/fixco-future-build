-- Add public_token column to invoices table
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS public_token TEXT UNIQUE;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_invoices_public_token ON invoices(public_token);

-- Create trigger to auto-generate public_token on insert
CREATE OR REPLACE FUNCTION generate_invoice_public_token()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.public_token IS NULL THEN
    NEW.public_token := encode(gen_random_bytes(32), 'hex');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_invoice_public_token
BEFORE INSERT ON invoices
FOR EACH ROW
EXECUTE FUNCTION generate_invoice_public_token();

-- Backfill existing invoices with tokens
UPDATE invoices 
SET public_token = encode(gen_random_bytes(32), 'hex')
WHERE public_token IS NULL;