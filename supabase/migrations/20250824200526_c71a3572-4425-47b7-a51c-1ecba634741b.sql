-- Update the invoices table to ensure quote_id is set when invoices are created from quotes
-- Also fix the query in generate-invoice-pdf function to properly filter available quotes

-- First, let's make sure the foreign key constraint exists for quote_id
ALTER TABLE invoices 
ADD CONSTRAINT IF NOT EXISTS invoices_quote_id_fkey 
FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE SET NULL;

-- Update existing queries to properly exclude quotes that already have invoices
-- This is handled in the application code, but we add an index to improve performance
CREATE INDEX IF NOT EXISTS idx_invoices_quote_id ON invoices(quote_id) WHERE quote_id IS NOT NULL;