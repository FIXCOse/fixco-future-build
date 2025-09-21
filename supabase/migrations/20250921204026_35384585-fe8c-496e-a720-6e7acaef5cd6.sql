-- Create content management table for Swedish/English content
CREATE TABLE public.content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,              -- 'page','section','block','service','faq','email_template', etc.
  sv_path TEXT NOT NULL,           -- canonical Swedish URL-path (ex '/tjanster/el')
  en_path TEXT NOT NULL,           -- corresponding English path (ex '/en/services/electrical')
  sv_json JSONB NOT NULL,          -- Swedish fields (title, ingress, sections, CTA texts, SEO)
  en_draft_json JSONB,             -- auto or manually translated draft
  en_live_json JSONB,              -- LIVE published English data (shown on /en)
  en_status TEXT NOT NULL DEFAULT 'missing', -- missing|auto|needs_review|approved|locked
  changed_at TIMESTAMPTZ DEFAULT now(),
  en_last_reviewed_at TIMESTAMPTZ,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- Create unique index on paths
CREATE UNIQUE INDEX idx_content_sv_path ON public.content(sv_path);
CREATE UNIQUE INDEX idx_content_en_path ON public.content(en_path);

-- Create index for type and status
CREATE INDEX idx_content_type_status ON public.content(type, en_status);

-- RLS policies
CREATE POLICY "Public can read live English content" 
ON public.content 
FOR SELECT 
USING (en_live_json IS NOT NULL);

CREATE POLICY "Admin can manage all content" 
ON public.content 
FOR ALL 
USING (is_admin_or_owner());

-- Create trigger for updated_at
CREATE TRIGGER update_content_updated_at
BEFORE UPDATE ON public.content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial content for main pages
INSERT INTO public.content (type, sv_path, en_path, sv_json, en_status) VALUES
(
  'page',
  '/',
  '/en',
  '{
    "title": "FIXCO - Din Helhetslösning",
    "meta_description": "Sveriges ledande hemtjänstföretag. ROT & RUT-avdrag, professionella hantverkare, över 15 000 nöjda kunder.",
    "h1": "Din kompletta hemtjänst med ROT & RUT-avdrag",
    "hero_subtitle": "Professionella hantverkare, transparent prissättning och över 15 000 nöjda kunder",
    "cta_primary": "Begär offert",
    "cta_secondary": "Ring oss"
  }',
  'missing'
),
(
  'page',
  '/tjanster',
  '/en/services',
  '{
    "title": "Tjänster - FIXCO",
    "meta_description": "Alla våra hemtjänster på ett ställe. El, VVS, målning, städning och mycket mer med ROT & RUT-avdrag.",
    "h1": "Våra tjänster",
    "subtitle": "Professionell hemtjänst med ROT & RUT-avdrag"
  }',
  'missing'
),
(
  'page',
  '/kontakt',
  '/en/contact',
  '{
    "title": "Kontakt - FIXCO",
    "meta_description": "Kontakta FIXCO för hjälp med ditt hem. Telefon, e-post eller boka direkt online.",
    "h1": "Kontakta oss",
    "subtitle": "Vi hjälper dig gärna"
  }',
  'missing'
),
(
  'page',
  '/om-oss',
  '/en/about',
  '{
    "title": "Om oss - FIXCO",
    "meta_description": "Läs mer om FIXCO - Sveriges ledande hemtjänstföretag med över 15 000 nöjda kunder.",
    "h1": "Om FIXCO",
    "subtitle": "Sveriges ledande hemtjänstföretag"
  }',
  'missing'
),
(
  'page',
  '/referenser',
  '/en/references',
  '{
    "title": "Referenser - FIXCO",
    "meta_description": "Se våra genomförda projekt och läs vad våra kunder säger om FIXCO.",
    "h1": "Referenser",
    "subtitle": "Se vad våra kunder säger"
  }',
  'missing'
),
(
  'page',
  '/smart-hem',
  '/en/smart-home',
  '{
    "title": "Smart Hem - FIXCO",
    "meta_description": "Gör ditt hem smartare med FIXCO. Professionell installation av smarta produkter.",
    "h1": "Smart Hem",
    "subtitle": "Gör ditt hem smartare"
  }',
  'missing'
);