ALTER TABLE quotes_new ADD COLUMN replaced_by_id UUID REFERENCES quotes_new(id);
ALTER TABLE quotes_new ADD COLUMN replaces_quote_id UUID REFERENCES quotes_new(id);