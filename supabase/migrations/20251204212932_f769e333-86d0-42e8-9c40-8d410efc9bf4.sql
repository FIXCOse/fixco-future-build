-- Ta bort felaktiga cross-listings från Montering

-- 1. Ta bort 'montering' från badkar (det är VVS/badrumsarbete)
UPDATE services 
SET additional_categories = array_remove(additional_categories, 'montering')
WHERE id = 'badrum-badkar';

-- 2. Ta bort 'montering' från takarmatur (det är elarbete)
UPDATE services 
SET additional_categories = array_remove(additional_categories, 'montering')
WHERE id = 'el-3';

-- 3. Ta bort 'montering' från bänkskiva (det är köksarbete/snickeri)
UPDATE services 
SET additional_categories = array_remove(additional_categories, 'montering')
WHERE id = 'kok-bankskiva';