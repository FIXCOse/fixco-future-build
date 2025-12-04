-- Fixa skumma sub_category-namn

-- 1. Ändra "Info" till "Allmänt"
UPDATE services 
SET sub_category = 'Allmänt' 
WHERE sub_category = 'Info';

-- 2. Ändra tomma strängar till NULL
UPDATE services 
SET sub_category = NULL 
WHERE sub_category = '';