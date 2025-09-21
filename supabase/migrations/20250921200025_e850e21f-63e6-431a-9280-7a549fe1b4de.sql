-- Fixco i18n 2.0 Database Structure
-- Translation keys (canonical UI keys from code)
CREATE TABLE IF NOT EXISTS public.translation_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  namespace TEXT NOT NULL,           -- e.g. 'home', 'header', 'services'
  key TEXT NOT NULL,                 -- stable key: 'hero.title'
  default_text TEXT NOT NULL,        -- SV default text
  checksum TEXT NOT NULL,            -- hash of default_text
  is_locked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(namespace, key)
);

-- Translations per locale
CREATE TABLE IF NOT EXISTS public.translation_locales (
  key_id UUID REFERENCES public.translation_keys(id) ON DELETE CASCADE,
  locale TEXT NOT NULL,              -- 'sv' | 'en'
  text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'auto', -- auto|reviewed|locked
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (key_id, locale)
);

-- Dynamic content: services (example, extend as needed)
CREATE TABLE IF NOT EXISTS public.service_translations (
  service_id UUID NOT NULL, -- Will reference services table when created
  locale TEXT NOT NULL,              -- 'sv' | 'en'
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (service_id, locale)
);

-- Job queue for batch translation of database records
CREATE TABLE IF NOT EXISTS public.translation_jobs (
  id BIGSERIAL PRIMARY KEY,
  kind TEXT NOT NULL,                -- 'service', 'faq', 'email_template', etc.
  entity_id UUID NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  payload JSONB NOT NULL,            -- fields to translate
  status TEXT NOT NULL DEFAULT 'pending', -- pending|processing|done|error
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_error TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_translation_keys_namespace ON public.translation_keys(namespace);
CREATE INDEX IF NOT EXISTS idx_translation_locales_locale ON public.translation_locales(locale);
CREATE INDEX IF NOT EXISTS idx_translation_jobs_status ON public.translation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_service_translations_locale ON public.service_translations(locale);

-- RLS Policies
ALTER TABLE public.translation_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_locales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_jobs ENABLE ROW LEVEL SECURITY;

-- Owners/admins can manage all translations
CREATE POLICY "translation_keys_admin_all" ON public.translation_keys
  FOR ALL USING (is_admin_or_owner());

CREATE POLICY "translation_locales_admin_all" ON public.translation_locales  
  FOR ALL USING (is_admin_or_owner());

CREATE POLICY "service_translations_admin_all" ON public.service_translations
  FOR ALL USING (is_admin_or_owner());

CREATE POLICY "translation_jobs_admin_all" ON public.translation_jobs
  FOR ALL USING (is_admin_or_owner());

-- Public read access for active translations (for frontend)
CREATE POLICY "translation_keys_public_read" ON public.translation_keys
  FOR SELECT USING (true);

CREATE POLICY "translation_locales_public_read" ON public.translation_locales
  FOR SELECT USING (true);

CREATE POLICY "service_translations_public_read" ON public.service_translations
  FOR SELECT USING (true);

-- Trigger to update updated_at columns
CREATE OR REPLACE FUNCTION public.update_translation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_translation_keys_updated_at
  BEFORE UPDATE ON public.translation_keys
  FOR EACH ROW EXECUTE FUNCTION public.update_translation_updated_at();

CREATE TRIGGER update_translation_locales_updated_at
  BEFORE UPDATE ON public.translation_locales  
  FOR EACH ROW EXECUTE FUNCTION public.update_translation_updated_at();

CREATE TRIGGER update_service_translations_updated_at
  BEFORE UPDATE ON public.service_translations
  FOR EACH ROW EXECUTE FUNCTION public.update_translation_updated_at();

CREATE TRIGGER update_translation_jobs_updated_at
  BEFORE UPDATE ON public.translation_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_translation_updated_at();