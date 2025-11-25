-- Fix status constraint to include pending_reaccept
ALTER TABLE quotes_new 
DROP CONSTRAINT IF EXISTS quotes_new_status_check;

ALTER TABLE quotes_new 
ADD CONSTRAINT quotes_new_status_check 
CHECK (status = ANY (ARRAY['draft', 'sent', 'viewed', 'change_requested', 'accepted', 'declined', 'expired', 'pending_reaccept']));

-- Add updated_at column
ALTER TABLE quotes_new 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Set initial value to created_at for existing rows
UPDATE quotes_new 
SET updated_at = COALESCE(accepted_at, created_at)
WHERE updated_at IS NULL;

-- Create trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_quotes_new_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS quotes_new_updated_at_trigger ON quotes_new;

CREATE TRIGGER quotes_new_updated_at_trigger
BEFORE UPDATE ON quotes_new
FOR EACH ROW
EXECUTE FUNCTION update_quotes_new_updated_at();