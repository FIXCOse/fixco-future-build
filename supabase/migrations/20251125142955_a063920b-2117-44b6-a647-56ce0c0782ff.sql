-- Add reaccept_requested_at column to quotes_new table
ALTER TABLE quotes_new
ADD COLUMN IF NOT EXISTS reaccept_requested_at TIMESTAMP WITH TIME ZONE;

-- Add comment to explain the column
COMMENT ON COLUMN quotes_new.reaccept_requested_at IS 'Timestamp when admin requested customer to re-accept a modified accepted quote';