-- Add answered_by_name column if not exists
ALTER TABLE quote_questions ADD COLUMN IF NOT EXISTS answered_by_name text;

-- Fix existing answered admin questions: set the correct customer name from the quote's customer
UPDATE quote_questions qq
SET answered_by_name = c.name
FROM quotes_new q
JOIN customers c ON c.id = q.customer_id
WHERE qq.quote_id = q.id
  AND qq.asked_by = 'admin'
  AND qq.answered = true
  AND qq.answered_by_name IS NULL;