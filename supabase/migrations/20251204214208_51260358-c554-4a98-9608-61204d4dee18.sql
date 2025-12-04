-- Konsolidera duplicerade "Montera spegelskåp"-tjänster

-- Steg 1: Lägg till cross-listing på den primära tjänsten (VVS)
UPDATE services 
SET additional_categories = ARRAY['snickeri', 'montering']
WHERE id = 'vvs-montera-spegelskap';

-- Steg 2: Soft-delete duplicaterna
UPDATE services 
SET is_active = false
WHERE id IN ('montering-montera-spegelskap', 'snickeri-montera-spegelskap');