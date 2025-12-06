-- Synka category-fältet med category_sv för alla referensprojekt
UPDATE reference_projects 
SET category = category_sv 
WHERE category_sv IS NOT NULL AND (category IS NULL OR category != category_sv);