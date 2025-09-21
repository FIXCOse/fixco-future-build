-- Add trust indicators and common translations
INSERT INTO public.translation_keys (namespace, key, default_text, checksum) VALUES
-- Home trust indicators
('home', 'trust.quality_title', 'Fixco Kvalitet', md5('Fixco Kvalitet')),
('home', 'trust.quality_desc', 'Vårt löfte till dig', md5('Vårt löfte till dig')),
('home', 'trust.price_title', 'Lägst pris (ROT)', md5('Lägst pris (ROT)')),
('home', 'trust.price_desc', '480 kr/h efter ROT-avdrag', md5('480 kr/h efter ROT-avdrag')),
('home', 'trust.customers_title', '2000+ kunder', md5('2000+ kunder')),
('home', 'trust.customers_desc', 'Genomsnittligt betyg 4.9/5', md5('Genomsnittligt betyg 4.9/5')),
('home', 'trust.location_title', 'Uppsala & Stockholm', md5('Uppsala & Stockholm')),
('home', 'trust.location_desc', 'Nationellt vid större projekt', md5('Nationellt vid större projekt')),

-- Common trust bar items
('common', 'trust.fixco_quality', 'Fixco Kvalitet', md5('Fixco Kvalitet')),
('common', 'trust.quick_start', 'Start inom < 5 dagar', md5('Start inom < 5 dagar')),
('common', 'trust.locations', 'Uppsala & Stockholm', md5('Uppsala & Stockholm')),
('common', 'trust.satisfied_customers', '500+ nöjda kunder', md5('500+ nöjda kunder')),
('common', 'trust.insured_guaranteed', 'Försäkrad & garanterad', md5('Försäkrad & garanterad')),
('common', 'trust.family_business', 'Familjeföretag sedan 2015', md5('Familjeföretag sedan 2015'))
ON CONFLICT (namespace, key) DO NOTHING;

-- Add Swedish translations
INSERT INTO public.translation_locales (key_id, locale, text, status) 
SELECT 
  tk.id,
  'sv',
  tk.default_text,
  'auto'
FROM public.translation_keys tk
WHERE (tk.namespace = 'home' AND tk.key LIKE 'trust.%') 
   OR (tk.namespace = 'common' AND tk.key LIKE 'trust.%')
  AND NOT EXISTS (
    SELECT 1 FROM public.translation_locales tl 
    WHERE tl.key_id = tk.id AND tl.locale = 'sv'
  );

-- Add English translations
INSERT INTO public.translation_locales (key_id, locale, text, status)
SELECT tk.id, 'en', 
  CASE 
    -- Home trust indicators
    WHEN tk.key = 'trust.quality_title' THEN 'Fixco Quality'
    WHEN tk.key = 'trust.quality_desc' THEN 'Our promise to you'
    WHEN tk.key = 'trust.price_title' THEN 'Lowest price (ROT)'
    WHEN tk.key = 'trust.price_desc' THEN '480 SEK/h after ROT deduction'
    WHEN tk.key = 'trust.customers_title' THEN '2000+ customers'
    WHEN tk.key = 'trust.customers_desc' THEN 'Average rating 4.9/5'
    WHEN tk.key = 'trust.location_title' THEN 'Uppsala & Stockholm'
    WHEN tk.key = 'trust.location_desc' THEN 'Nationwide for larger projects'
    
    -- Common trust items  
    WHEN tk.key = 'trust.fixco_quality' THEN 'Fixco Quality'
    WHEN tk.key = 'trust.quick_start' THEN 'Start within < 5 days'
    WHEN tk.key = 'trust.locations' THEN 'Uppsala & Stockholm'
    WHEN tk.key = 'trust.satisfied_customers' THEN '500+ satisfied customers'
    WHEN tk.key = 'trust.insured_guaranteed' THEN 'Insured & guaranteed'
    WHEN tk.key = 'trust.family_business' THEN 'Family business since 2015'
    
    ELSE tk.default_text
  END,
  'auto'
FROM public.translation_keys tk
WHERE (tk.namespace = 'home' AND tk.key LIKE 'trust.%') 
   OR (tk.namespace = 'common' AND tk.key LIKE 'trust.%')
  AND NOT EXISTS (
    SELECT 1 FROM public.translation_locales tl 
    WHERE tl.key_id = tk.id AND tl.locale = 'en'
  );