-- Remove non-smart home products that are just regular consumer electronics
DELETE FROM smart_products 
WHERE name IN (
  'JBL Flip 6',
  'KEF LS50 Wireless II'  -- High-end speakers but not smart home automation
);

-- Update products that have questionable "AI" features to be more accurate
UPDATE smart_products 
SET ai_features = '["Smart crossover", "Room acoustic adaptation"]'::jsonb
WHERE name = 'Denon Home 350' 
  AND ai_features @> '["Sound optimization", "Smart grouping", "Adaptive audio enhancement"]';