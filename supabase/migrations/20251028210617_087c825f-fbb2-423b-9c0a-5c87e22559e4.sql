-- Step 1: Remove NOT NULL constraint from customer_id to allow cleanup
ALTER TABLE invoices 
ALTER COLUMN customer_id DROP NOT NULL;

-- Step 2: Set customer_id to NULL for invoices where customer_id doesn't exist in customers table
UPDATE invoices
SET customer_id = NULL
WHERE customer_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM customers c WHERE c.id = invoices.customer_id
  );

-- Step 3: Drop the old foreign key constraint that points to profiles
ALTER TABLE invoices 
DROP CONSTRAINT IF EXISTS invoices_customer_id_fkey;

-- Step 4: Add new foreign key constraint pointing to customers table
ALTER TABLE invoices
ADD CONSTRAINT invoices_customer_id_fkey 
FOREIGN KEY (customer_id) 
REFERENCES customers(id) 
ON DELETE SET NULL;

-- Step 5: Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id 
ON invoices(customer_id);

-- Step 6: Update or create the prepare_invoice_from_job function
CREATE OR REPLACE FUNCTION prepare_invoice_from_job(p_job_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'job_id', j.id,
    'customer_id', j.customer_id,
    'pricing_mode', j.pricing_mode,
    'hourly_rate', j.hourly_rate,
    'fixed_price', j.fixed_price,
    'hours', COALESCE(SUM(tl.hours), 0),
    'materials', COALESCE(SUM(ml.qty * ml.unit_price), 0),
    'expenses', COALESCE(SUM(el.amount), 0),
    'subtotal', 
      CASE 
        WHEN j.pricing_mode = 'fixed' THEN COALESCE(j.fixed_price, 0)
        WHEN j.pricing_mode = 'hourly' THEN COALESCE(SUM(tl.hours), 0) * COALESCE(j.hourly_rate, 0)
        ELSE 0
      END + COALESCE(SUM(ml.qty * ml.unit_price), 0) + COALESCE(SUM(el.amount), 0),
    'rot_rut', COALESCE(j.rot_rut, '{}'::jsonb)
  ) INTO result
  FROM jobs j
  LEFT JOIN time_logs tl ON tl.job_id = j.id
  LEFT JOIN material_logs ml ON ml.job_id = j.id
  LEFT JOIN expense_logs el ON el.job_id = j.id
  WHERE j.id = p_job_id
  GROUP BY j.id, j.pricing_mode, j.hourly_rate, j.fixed_price, j.rot_rut, j.customer_id;
  
  RETURN result;
END;
$$;