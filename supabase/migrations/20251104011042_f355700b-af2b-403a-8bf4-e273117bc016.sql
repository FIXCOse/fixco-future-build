
-- First, drop the old foreign key constraint
ALTER TABLE invoices 
DROP CONSTRAINT IF EXISTS invoices_quote_id_fkey;

-- Nullify any quote_ids that don't exist in quotes_new
UPDATE invoices
SET quote_id = NULL
WHERE quote_id IS NOT NULL 
  AND quote_id NOT IN (SELECT id FROM quotes_new);

-- Now add the new foreign key to quotes_new
ALTER TABLE invoices
ADD CONSTRAINT invoices_quote_id_fkey 
FOREIGN KEY (quote_id) 
REFERENCES quotes_new(id) 
ON DELETE SET NULL;

-- Backfill the correct quote_ids for invoiced jobs
UPDATE invoices
SET quote_id = 'd2b45259-50bc-480f-b2b4-660b9c664d14'
WHERE id = 'd8701009-5aa3-4fda-96a8-cf604c0926c5';

UPDATE invoices
SET quote_id = '8e11499a-9a5f-4977-b305-6c488d1195ae'
WHERE id = 'ecdb9f16-371d-4f49-be63-def30346d10b';

UPDATE invoices
SET quote_id = '982e169c-f09a-4ab4-be7e-67f8c2ea006f'
WHERE id = '703fbeba-6b65-42c3-a5f4-78a657ad4acc';

-- Generate public tokens for invoices that don't have them
UPDATE invoices
SET public_token = gen_random_uuid()::text
WHERE public_token IS NULL;
