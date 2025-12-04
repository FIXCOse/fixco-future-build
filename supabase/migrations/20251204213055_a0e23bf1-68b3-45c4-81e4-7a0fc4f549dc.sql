-- Konsolidera sanitets-subcategories: Ändra 'Sanitetsporsliner' till 'Sanitetsarbeten'
UPDATE services 
SET sub_category = 'Sanitetsarbeten' 
WHERE sub_category = 'Sanitetsporsliner';