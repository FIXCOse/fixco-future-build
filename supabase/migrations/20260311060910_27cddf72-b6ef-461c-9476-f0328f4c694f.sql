-- Add 'superseded' to allowed status values
ALTER TABLE quotes_new DROP CONSTRAINT quotes_new_status_check;
ALTER TABLE quotes_new ADD CONSTRAINT quotes_new_status_check CHECK (status = ANY (ARRAY['draft','sent','viewed','change_requested','accepted','declined','expired','pending_reaccept','superseded']));

-- Fix the existing quotes
UPDATE quotes_new SET status = 'superseded', replaced_by_id = '7b450a9b-d20a-43c1-8566-a72dc9f24c6b' WHERE id = '544a2db6-6268-4894-8928-6ac3399d3fc5';
UPDATE quotes_new SET replaces_quote_id = '544a2db6-6268-4894-8928-6ac3399d3fc5' WHERE id = '7b450a9b-d20a-43c1-8566-a72dc9f24c6b';