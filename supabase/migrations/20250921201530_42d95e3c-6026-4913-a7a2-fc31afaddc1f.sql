-- Add TrustBar translation keys
INSERT INTO public.translation_keys (namespace, key, default_text, checksum) VALUES
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
WHERE tk.namespace = 'common' 
  AND tk.key LIKE 'trust.%'
  AND NOT EXISTS (
    SELECT 1 FROM public.translation_locales tl 
    WHERE tl.key_id = tk.id AND tl.locale = 'sv'
  );

-- Add English translations
INSERT INTO public.translation_locales (key_id, locale, text, status)
SELECT tk.id, 'en', 
  CASE 
    WHEN tk.key = 'trust.fixco_quality' THEN 'Fixco Quality'
    WHEN tk.key = 'trust.quick_start' THEN 'Start within < 5 days'
    WHEN tk.key = 'trust.locations' THEN 'Uppsala & Stockholm'
    WHEN tk.key = 'trust.satisfied_customers' THEN '500+ happy customers'
    WHEN tk.key = 'trust.insured_guaranteed' THEN 'Insured & guaranteed'
    WHEN tk.key = 'trust.family_business' THEN 'Family business since 2015'
    ELSE tk.default_text
  END,
  'auto'
FROM public.translation_keys tk
WHERE tk.namespace = 'common' 
  AND tk.key LIKE 'trust.%'
  AND NOT EXISTS (
    SELECT 1 FROM public.translation_locales tl 
    WHERE tl.key_id = tk.id AND tl.locale = 'en'
  );