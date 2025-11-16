-- Fixa de två UUID-baserade tjänsterna som skapades tidigare
-- Uppdatera dem till slug-baserade ID:n

-- Uppdatera "Tvätta altan" i städning
UPDATE services 
SET id = 'stadning-tvatta-altan'
WHERE title_sv = 'Tvätta altan' 
  AND category = 'stadning'
  AND id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- Uppdatera "Tvätta altan" i markarbeten
UPDATE services 
SET id = 'markarbeten-tvatta-altan'
WHERE title_sv = 'Tvätta altan' 
  AND category = 'markarbeten'
  AND id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';