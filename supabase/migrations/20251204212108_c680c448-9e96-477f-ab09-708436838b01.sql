-- Cross-lista tjänster från gömda kategorier

-- 1. BADRUM → VVS
UPDATE services SET additional_categories = array_append(COALESCE(additional_categories, '{}'), 'vvs')
WHERE category = 'badrum' AND NOT ('vvs' = ANY(COALESCE(additional_categories, '{}')));

-- 2. KÖK → SNICKERI
UPDATE services SET additional_categories = array_append(COALESCE(additional_categories, '{}'), 'snickeri')
WHERE category = 'kok' AND NOT ('snickeri' = ANY(COALESCE(additional_categories, '{}')));

-- 3. GOLV → SNICKERI
UPDATE services SET additional_categories = array_append(COALESCE(additional_categories, '{}'), 'snickeri')
WHERE category = 'golv' AND NOT ('snickeri' = ANY(COALESCE(additional_categories, '{}')));

-- 4. FÖNSTER & DÖRRAR → SNICKERI
UPDATE services SET additional_categories = array_append(COALESCE(additional_categories, '{}'), 'snickeri')
WHERE category = 'fonster-dorrar' AND NOT ('snickeri' = ANY(COALESCE(additional_categories, '{}')));

-- 5. TAKARBETEN → SNICKERI
UPDATE services SET additional_categories = array_append(COALESCE(additional_categories, '{}'), 'snickeri')
WHERE category = 'takarbeten' AND NOT ('snickeri' = ANY(COALESCE(additional_categories, '{}')));
