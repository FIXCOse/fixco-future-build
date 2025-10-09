-- Allow NULL customer_id for quotes from guest users
ALTER TABLE quotes ALTER COLUMN customer_id DROP NOT NULL;