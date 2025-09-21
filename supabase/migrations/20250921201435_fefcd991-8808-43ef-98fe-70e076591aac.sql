-- Add new hero translation keys for HeroUltra component
INSERT INTO public.translation_keys (namespace, key, default_text, checksum) VALUES
('home', 'hero.brand', 'Fixco', md5('Fixco')),
('home', 'hero.solves_everything', 'löser allt inom', md5('löser allt inom')),
('home', 'hero.home_construction', 'hem & byggnad', md5('hem & byggnad')),
('home', 'hero.main_description', 'Snabbare, billigare och mer professionellt än konkurrenterna.', md5('Snabbare, billigare och mer professionellt än konkurrenterna.')),
('home', 'hero.quick_start_offer', 'Start inom 5 dagar, 50% rabatt med ROT.', md5('Start inom 5 dagar, 50% rabatt med ROT.')),
('home', 'hero.cta_quote', 'Begär offert', md5('Begär offert')),
('home', 'hero.cta_services', 'Se våra tjänster', md5('Se våra tjänster'))
ON CONFLICT (namespace, key) DO NOTHING;

-- Add Swedish translations (fallback to default text)
INSERT INTO public.translation_locales (key_id, locale, text, status) 
SELECT 
  tk.id,
  'sv',
  tk.default_text,
  'auto'
FROM public.translation_keys tk
WHERE tk.namespace = 'home' 
  AND tk.key IN ('hero.brand', 'hero.solves_everything', 'hero.home_construction', 'hero.main_description', 'hero.quick_start_offer', 'hero.cta_quote', 'hero.cta_services')
  AND NOT EXISTS (
    SELECT 1 FROM public.translation_locales tl 
    WHERE tl.key_id = tk.id AND tl.locale = 'sv'
  );

-- Add English translations
INSERT INTO public.translation_locales (key_id, locale, text, status)
SELECT tk.id, 'en', 
  CASE 
    WHEN tk.key = 'hero.brand' THEN 'Fixco'
    WHEN tk.key = 'hero.solves_everything' THEN 'solves everything in'
    WHEN tk.key = 'hero.home_construction' THEN 'home & construction'
    WHEN tk.key = 'hero.main_description' THEN 'Faster, cheaper and more professional than our competitors.'
    WHEN tk.key = 'hero.quick_start_offer' THEN 'Start within 5 days, 50% discount with ROT.'
    WHEN tk.key = 'hero.cta_quote' THEN 'Request Quote'
    WHEN tk.key = 'hero.cta_services' THEN 'View Our Services'
    ELSE tk.default_text
  END,
  'auto'
FROM public.translation_keys tk
WHERE tk.namespace = 'home' 
  AND tk.key IN ('hero.brand', 'hero.solves_everything', 'hero.home_construction', 'hero.main_description', 'hero.quick_start_offer', 'hero.cta_quote', 'hero.cta_services')
  AND NOT EXISTS (
    SELECT 1 FROM public.translation_locales tl 
    WHERE tl.key_id = tk.id AND tl.locale = 'en'
  );