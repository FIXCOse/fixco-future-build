-- Insert sample translation keys for testing
-- Header navigation translations
INSERT INTO public.translation_keys (namespace, key, default_text, checksum) VALUES
('header', 'nav.home', 'Hem', md5('Hem')),
('header', 'nav.services', 'Tjänster', md5('Tjänster')),
('header', 'nav.smart_home', 'Smart Hem', md5('Smart Hem')),
('header', 'nav.references', 'Referenser', md5('Referenser')),
('header', 'nav.about', 'Om oss', md5('Om oss')),
('header', 'nav.contact', 'Kontakt', md5('Kontakt')),
('header', 'nav.admin', 'Administration', md5('Administration')),
('header', 'auth.my_fixco', 'Mitt Fixco', md5('Mitt Fixco')),
('header', 'auth.logout', 'Logga ut', md5('Logga ut')),
('header', 'auth.logged_out', 'Du har loggats ut', md5('Du har loggats ut')),
('header', 'auth.logout_error', 'Kunde inte logga ut', md5('Kunde inte logga ut'))
ON CONFLICT (namespace, key) DO NOTHING;

-- Home page hero translations
INSERT INTO public.translation_keys (namespace, key, default_text, checksum) VALUES
('home', 'hero.large', 'Stora', md5('Stora')),
('home', 'hero.or', 'eller', md5('eller')),
('home', 'hero.small', 'små', md5('små')),
('home', 'hero.projects', 'projekt', md5('projekt')),
('home', 'hero.fixco_handles', 'Fixco hanterar', md5('Fixco hanterar')),
('home', 'hero.everything', 'allt', md5('allt')),
('home', 'hero.description', 'Snabbare, billigare och mer professionellt än våra konkurrenter.', md5('Snabbare, billigare och mer professionellt än våra konkurrenter.')),
('home', 'hero.start_time', 'Start inom < 5 dagar.', md5('Start inom < 5 dagar.')),
('home', 'hero.cta_primary', 'Begär offert', md5('Begär offert')),
('home', 'hero.cta_secondary', 'Se våra tjänster', md5('Se våra tjänster'))
ON CONFLICT (namespace, key) DO NOTHING;

-- Now add English translations
INSERT INTO public.translation_locales (key_id, locale, text, status) 
SELECT 
  tk.id,
  'sv',
  tk.default_text,
  'auto'
FROM public.translation_keys tk
WHERE NOT EXISTS (
  SELECT 1 FROM public.translation_locales tl 
  WHERE tl.key_id = tk.id AND tl.locale = 'sv'
);

-- Add English translations
INSERT INTO public.translation_locales (key_id, locale, text, status)
SELECT tk.id, 'en', 
  CASE 
    -- Header translations
    WHEN tk.namespace = 'header' AND tk.key = 'nav.home' THEN 'Home'
    WHEN tk.namespace = 'header' AND tk.key = 'nav.services' THEN 'Services'
    WHEN tk.namespace = 'header' AND tk.key = 'nav.smart_home' THEN 'Smart Home'
    WHEN tk.namespace = 'header' AND tk.key = 'nav.references' THEN 'References'
    WHEN tk.namespace = 'header' AND tk.key = 'nav.about' THEN 'About Us'
    WHEN tk.namespace = 'header' AND tk.key = 'nav.contact' THEN 'Contact'
    WHEN tk.namespace = 'header' AND tk.key = 'nav.admin' THEN 'Administration'
    WHEN tk.namespace = 'header' AND tk.key = 'auth.my_fixco' THEN 'My Fixco'
    WHEN tk.namespace = 'header' AND tk.key = 'auth.logout' THEN 'Logout'
    WHEN tk.namespace = 'header' AND tk.key = 'auth.logged_out' THEN 'You have been logged out'
    WHEN tk.namespace = 'header' AND tk.key = 'auth.logout_error' THEN 'Could not log out'
    
    -- Home hero translations
    WHEN tk.namespace = 'home' AND tk.key = 'hero.large' THEN 'Large'
    WHEN tk.namespace = 'home' AND tk.key = 'hero.or' THEN 'or'
    WHEN tk.namespace = 'home' AND tk.key = 'hero.small' THEN 'small'
    WHEN tk.namespace = 'home' AND tk.key = 'hero.projects' THEN 'projects'
    WHEN tk.namespace = 'home' AND tk.key = 'hero.fixco_handles' THEN 'Fixco handles'
    WHEN tk.namespace = 'home' AND tk.key = 'hero.everything' THEN 'everything'
    WHEN tk.namespace = 'home' AND tk.key = 'hero.description' THEN 'Faster, cheaper and more professional than our competitors.'
    WHEN tk.namespace = 'home' AND tk.key = 'hero.start_time' THEN 'Start within < 5 days.'
    WHEN tk.namespace = 'home' AND tk.key = 'hero.cta_primary' THEN 'Request Quote'
    WHEN tk.namespace = 'home' AND tk.key = 'hero.cta_secondary' THEN 'View Our Services'
    
    ELSE tk.default_text
  END,
  'auto'
FROM public.translation_keys tk
WHERE NOT EXISTS (
  SELECT 1 FROM public.translation_locales tl 
  WHERE tl.key_id = tk.id AND tl.locale = 'en'
);