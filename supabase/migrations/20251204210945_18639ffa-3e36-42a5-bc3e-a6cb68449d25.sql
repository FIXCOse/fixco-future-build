-- Add additional_categories column for cross-listing services
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS additional_categories text[] DEFAULT '{}';

COMMENT ON COLUMN services.additional_categories IS 'Extra kategorier där tjänsten också ska visas (cross-listing)';

-- MONTERING → snickeri
UPDATE services SET additional_categories = ARRAY['snickeri'] 
WHERE id IN ('montering-1', 'montering-3', 'montering-allman-montering');

-- SNICKERI cross-listings
UPDATE services SET additional_categories = ARRAY['montering', 'fonster-dorrar'] WHERE id = 'snickeri-4';
UPDATE services SET additional_categories = ARRAY['montering', 'el'] WHERE id = 'vvs-5';
UPDATE services SET additional_categories = ARRAY['montering'] WHERE id IN ('snickeri-3', 'akustik-panel', 'akustik-tak');
UPDATE services SET additional_categories = ARRAY['montering', 'malning'] WHERE id = 'inredning-ribs';
UPDATE services SET additional_categories = ARRAY['kok'] WHERE id = 'snickeri-2';
UPDATE services SET additional_categories = ARRAY['malning'] WHERE id = 'snickeri-5';

-- FÖNSTER-DÖRRAR → snickeri/målning
UPDATE services SET additional_categories = ARRAY['snickeri'] WHERE id IN ('dorr-inner', 'dorr-ytter', 'dorr-justera', 'fonster-byta');
UPDATE services SET additional_categories = ARRAY['malning'] WHERE id = 'fonster-mala';

-- BADRUM → vvs/golv/montering
UPDATE services SET additional_categories = ARRAY['vvs'] WHERE id = 'badrum-toalett';
UPDATE services SET additional_categories = ARRAY['vvs', 'montering'] WHERE id = 'badrum-badkar';
UPDATE services SET additional_categories = ARRAY['golv'] WHERE id = 'badrum-kakla';

-- KÖK → snickeri/montering/golv
UPDATE services SET additional_categories = ARRAY['snickeri'] WHERE id = 'kok-luckor';
UPDATE services SET additional_categories = ARRAY['snickeri', 'montering'] WHERE id = 'kok-bankskiva';
UPDATE services SET additional_categories = ARRAY['golv'] WHERE id = 'kok-kakel';

-- EL → montering/trädgård/markarbeten/kök
UPDATE services SET additional_categories = ARRAY['montering'] WHERE id = 'el-3';
UPDATE services SET additional_categories = ARRAY['tradgard', 'markarbeten'] WHERE id = 'el-5';
UPDATE services SET additional_categories = ARRAY['kok'] WHERE id = 'el-10';

-- MÅLNING → fönster-dörrar/markarbeten
UPDATE services SET additional_categories = ARRAY['fonster-dorrar'] WHERE id = 'malning-dorrar';
UPDATE services SET additional_categories = ARRAY['markarbeten'] WHERE id = 'malning-fasad';

-- MARKARBETEN → snickeri/trädgård/städning
UPDATE services SET additional_categories = ARRAY['snickeri', 'tradgard'] WHERE id = 'altan-bygga';
UPDATE services SET additional_categories = ARRAY['snickeri'] WHERE id IN ('altan-renovera', 'altan-staket');
UPDATE services SET additional_categories = ARRAY['stadning'] WHERE id = 'markarbeten-tvatta-altan';

-- GOLV → badrum/kök
UPDATE services SET additional_categories = ARRAY['badrum', 'kok'] WHERE id = 'golv-klinker';