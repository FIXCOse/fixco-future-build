-- FAS 5: Data migration - Consolidate TV mounting services and create add-ons

-- First, let's consolidate TV services by picking one main service
-- Find the main TV mounting service (we'll keep this one)
DO $$
DECLARE
  main_tv_service_id text;
BEGIN
  -- Find the first active TV mounting service to keep as main
  SELECT id INTO main_tv_service_id
  FROM services
  WHERE (title_sv ILIKE '%montera%tv%' OR title_sv ILIKE '%tv%fäste%')
    AND is_active = true
  LIMIT 1;

  -- If we found a service, update it to be the main TV mounting service
  IF main_tv_service_id IS NOT NULL THEN
    UPDATE services
    SET 
      title_sv = 'Montera TV på vägg',
      title_en = 'Mount TV on wall',
      description_sv = 'Professionell montering av TV på vägg med säker fästning och nivellering',
      description_en = 'Professional TV wall mounting with secure fastening and leveling',
      base_price = 890,
      price_type = 'fixed',
      price_unit = 'kr',
      rot_eligible = true,
      rut_eligible = false
    WHERE id = main_tv_service_id;

    -- Create add-on services for TV mounting
    INSERT INTO service_addons (service_id, title_sv, title_en, description_sv, description_en, addon_price, price_unit, icon, rot_eligible, rut_eligible, sort_order)
    VALUES 
      (main_tv_service_id, 
       'Kabelhantering', 
       'Cable management', 
       'Dold kabelföring i vägg eller installation av kabelkanal för en snygg finish', 
       'Hidden cable routing in wall or cable channel installation for a clean finish',
       300, 
       'kr', 
       '🔌', 
       true, 
       false,
       1),
      
      (main_tv_service_id, 
       'Slänga gammal TV', 
       'Dispose old TV', 
       'Miljövänlig bortforsling och återvinning av din gamla TV', 
       'Environmentally friendly disposal and recycling of your old TV',
       200, 
       'kr', 
       '♻️', 
       false, 
       false,
       2),
      
      (main_tv_service_id, 
       'Installera soundbar', 
       'Install soundbar', 
       'Montering och anslutning av soundbar till TV och strömkälla', 
       'Mounting and connection of soundbar to TV and power source',
       250, 
       'kr', 
       '🔊', 
       true, 
       false,
       3),
      
      (main_tv_service_id, 
       'Flytta/organisera sopor', 
       'Organize waste', 
       'Städning och bortforsling av förpackningsmaterial och kartong', 
       'Cleaning and disposal of packaging materials and cardboard',
       150, 
       'kr', 
       '🗑️', 
       false, 
       true,
       4);

    -- Deactivate other similar TV services to avoid duplicates
    UPDATE services
    SET is_active = false
    WHERE (title_sv ILIKE '%tv%fäste%' OR title_sv ILIKE '%montera%tv%kabel%')
      AND id != main_tv_service_id
      AND is_active = true;

    RAISE NOTICE 'TV services consolidated. Main service: %, Add-ons created: 4', main_tv_service_id;
  ELSE
    RAISE NOTICE 'No TV mounting service found to consolidate';
  END IF;
END $$;

-- Add helpful comment
COMMENT ON TABLE service_addons IS 
'Add-on services can be selected alongside main services. Example: TV mounting can have add-ons like cable management, disposal of old TV, etc.';