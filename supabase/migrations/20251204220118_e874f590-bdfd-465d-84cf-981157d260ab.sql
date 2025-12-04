-- Clean up whitespace in services table
UPDATE services 
SET description_sv = TRIM(description_sv),
    description_en = TRIM(description_en),
    title_sv = TRIM(title_sv),
    title_en = TRIM(title_en)
WHERE description_sv IS DISTINCT FROM TRIM(description_sv) 
   OR description_en IS DISTINCT FROM TRIM(description_en)
   OR title_sv IS DISTINCT FROM TRIM(title_sv)
   OR title_en IS DISTINCT FROM TRIM(title_en);