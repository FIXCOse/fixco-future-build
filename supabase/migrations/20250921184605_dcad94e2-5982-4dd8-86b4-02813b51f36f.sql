-- Create i18n infrastructure tables
CREATE TABLE public.i18n_resources (
  id bigserial PRIMARY KEY,
  ns text NOT NULL,
  key text NOT NULL,
  locale text NOT NULL CHECK (locale IN ('sv','en')),
  value text NOT NULL,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id),
  UNIQUE (ns, key, locale)
);

-- Create translations table for dynamic content
CREATE TABLE public.translations (
  id bigserial PRIMARY KEY,
  entity_type text NOT NULL,       -- 'service','category','faq','email_template', etc.
  entity_id uuid NOT NULL,
  locale text NOT NULL CHECK (locale IN ('sv','en')),
  field text NOT NULL,             -- 'title','description','slug','cta_text'
  value text NOT NULL,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id),
  UNIQUE (entity_type, entity_id, locale, field)
);

-- Enable RLS
ALTER TABLE public.i18n_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- RLS policies for i18n_resources
CREATE POLICY "i18n_resources_select_all" ON public.i18n_resources 
  FOR SELECT USING (true);

CREATE POLICY "i18n_resources_admin_manage" ON public.i18n_resources 
  FOR ALL USING (is_admin_or_owner())
  WITH CHECK (is_admin_or_owner());

-- RLS policies for translations  
CREATE POLICY "translations_select_all" ON public.translations 
  FOR SELECT USING (true);

CREATE POLICY "translations_admin_manage" ON public.translations 
  FOR ALL USING (is_admin_or_owner())
  WITH CHECK (is_admin_or_owner());

-- Add language preference to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS language text DEFAULT 'sv' CHECK (language IN ('sv', 'en'));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_i18n_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER update_i18n_resources_updated_at
  BEFORE UPDATE ON public.i18n_resources
  FOR EACH ROW
  EXECUTE FUNCTION update_i18n_updated_at();

CREATE TRIGGER update_translations_updated_at
  BEFORE UPDATE ON public.translations
  FOR EACH ROW
  EXECUTE FUNCTION update_i18n_updated_at();