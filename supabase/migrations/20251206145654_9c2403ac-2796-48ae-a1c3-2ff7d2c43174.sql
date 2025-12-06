-- Synka location-fältet med location_sv för alla referensprojekt
UPDATE reference_projects 
SET location = location_sv 
WHERE location_sv IS NOT NULL AND (location IS NULL OR location = '' OR location != location_sv);