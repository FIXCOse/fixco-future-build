-- Backfill customers with postal_code and city from their bookings payload
UPDATE customers c
SET 
  postal_code = COALESCE(c.postal_code, (b.payload->>'postal_code')::text),
  city = COALESCE(c.city, (b.payload->>'city')::text)
FROM (
  SELECT DISTINCT ON (customer_id) 
    customer_id,
    payload
  FROM bookings 
  WHERE customer_id IS NOT NULL 
    AND deleted_at IS NULL
    AND (payload->>'postal_code' IS NOT NULL OR payload->>'city' IS NOT NULL)
  ORDER BY customer_id, created_at DESC
) b
WHERE c.id = b.customer_id
  AND (c.postal_code IS NULL OR c.city IS NULL);