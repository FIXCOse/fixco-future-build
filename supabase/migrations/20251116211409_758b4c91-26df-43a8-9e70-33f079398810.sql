-- Lägg till "Tvätta altan" i städning (RUT-berättigad)
INSERT INTO services (
  id,
  title_sv,
  description_sv,
  category,
  base_price,
  price_unit,
  price_type,
  rot_eligible,
  rut_eligible,
  location,
  is_active,
  translation_status
) VALUES (
  gen_random_uuid(),
  'Tvätta altan',
  'Professionell högtryckstvätt av altan för ett fräscht resultat',
  'stadning',
  959,
  'kr/h',
  'hourly',
  false,
  true,
  'utomhus',
  true,
  'pending'
);

-- Lägg till "Tvätta altan" i markarbeten (ROT-berättigad)
INSERT INTO services (
  id,
  title_sv,
  description_sv,
  category,
  base_price,
  price_unit,
  price_type,
  rot_eligible,
  rut_eligible,
  location,
  is_active,
  translation_status
) VALUES (
  gen_random_uuid(),
  'Tvätta altan',
  'Högtryckstvätt av altan som del av yttre underhåll och renovering',
  'markarbeten',
  959,
  'kr/h',
  'hourly',
  true,
  false,
  'utomhus',
  true,
  'pending'
);