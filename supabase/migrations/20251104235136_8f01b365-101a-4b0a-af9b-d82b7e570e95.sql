-- Create enum for customer_type
CREATE TYPE customer_type AS ENUM ('private', 'company', 'brf');

-- Add customer_type column to customers table
ALTER TABLE customers 
ADD COLUMN customer_type customer_type DEFAULT 'private';

-- Add company-specific fields
ALTER TABLE customers 
ADD COLUMN company_name TEXT;

-- Add org_number for companies and BRFs
ALTER TABLE customers 
ADD COLUMN org_number TEXT;

-- Add brf-specific field
ALTER TABLE customers 
ADD COLUMN brf_name TEXT;

-- Create index for faster filtering
CREATE INDEX idx_customers_type ON customers(customer_type);

-- Add comments for documentation
COMMENT ON COLUMN customers.customer_type IS 'Type of customer: private, company, or brf';
COMMENT ON COLUMN customers.company_name IS 'Company name for company customers';
COMMENT ON COLUMN customers.org_number IS 'Organization number for companies and BRFs';
COMMENT ON COLUMN customers.brf_name IS 'BRF name for BRF customers';