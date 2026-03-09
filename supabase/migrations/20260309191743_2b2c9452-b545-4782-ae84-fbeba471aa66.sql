ALTER TABLE bookings ADD COLUMN IF NOT EXISTS locale text DEFAULT 'sv';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS preferred_locale text DEFAULT 'sv';
ALTER TABLE quotes_new ADD COLUMN IF NOT EXISTS locale text DEFAULT 'sv';