-- Add foreign key constraint for quote_id in invoices table (without IF NOT EXISTS which is not supported)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'invoices_quote_id_fkey' 
        AND table_name = 'invoices'
    ) THEN
        ALTER TABLE invoices 
        ADD CONSTRAINT invoices_quote_id_fkey 
        FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add index for better performance on quote lookups
CREATE INDEX IF NOT EXISTS idx_invoices_quote_id ON invoices(quote_id) WHERE quote_id IS NOT NULL;