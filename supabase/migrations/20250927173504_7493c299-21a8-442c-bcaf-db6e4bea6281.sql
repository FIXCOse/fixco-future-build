-- Create services table
CREATE TABLE public.services (
  id text NOT NULL PRIMARY KEY,
  category text NOT NULL,
  
  -- Swedish (original)
  title_sv text NOT NULL,
  description_sv text NOT NULL,
  
  -- English (auto-translated)
  title_en text,
  description_en text,
  
  -- Pricing
  base_price numeric NOT NULL,
  price_unit text NOT NULL DEFAULT 'kr/h',
  price_type text NOT NULL DEFAULT 'hourly', -- 'hourly', 'fixed', 'quote'
  
  -- Eligibility
  rot_eligible boolean NOT NULL DEFAULT true,
  rut_eligible boolean NOT NULL DEFAULT false,
  
  -- Classification
  location text NOT NULL DEFAULT 'inomhus', -- 'inomhus', 'utomhus', 'båda'
  sub_category text,
  
  -- Status
  is_active boolean NOT NULL DEFAULT true,
  translation_status text NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  
  -- Metadata
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  sort_order integer DEFAULT 0
);

-- Create index for efficient queries
CREATE INDEX idx_services_category ON public.services(category);
CREATE INDEX idx_services_active ON public.services(is_active);
CREATE INDEX idx_services_translation_status ON public.services(translation_status);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Services are publicly readable"
  ON public.services FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage services"
  ON public.services FOR ALL
  USING (is_admin_or_owner());

-- Create trigger for updated_at
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert existing services from the code
INSERT INTO public.services (id, category, title_sv, description_sv, base_price, price_unit, price_type, rot_eligible, rut_eligible, location, sub_category, sort_order) VALUES

-- El services
('el-1', 'el', 'Byta vägguttag', 'Byte av vägguttag till nyare modeller. Antal väljs vid bokning', 1059, 'kr/h', 'hourly', true, false, 'inomhus', 'Uttag', 1),
('el-2', 'el', 'Byta strömbrytare och dimmer', 'Installation av nya strömbrytare och dimrar. Antal väljs vid bokning', 1059, 'kr/h', 'hourly', true, false, 'inomhus', 'Strömbrytare', 2),
('el-3', 'el', 'Installera takarmatur/pendel', 'Montering av takarmaturer och pendellampor. Antal väljs vid bokning', 1059, 'kr/h', 'hourly', true, false, 'inomhus', 'Belysning', 3),
('el-4', 'el', 'Installera spotlights', 'Installation av spotlights i tak. Antal väljs vid bokning (typiskt 0,5-1h per 4-6 st)', 1059, 'kr/h', 'hourly', true, false, 'inomhus', 'Belysning', 4),
('el-5', 'el', 'Utebelysning', 'Installation av fasad- och trädgårdsbelysning. Typ väljs vid bokning', 1059, 'kr/h', 'hourly', true, false, 'utomhus', 'Utebelysning', 5),
('el-6', 'el', 'Installera jordfelsbrytare', 'Installation av jordfelsbrytare för säkerhet', 1059, 'kr/h', 'hourly', true, false, 'inomhus', 'Säkerhet', 6),
('el-7', 'el', 'Felsökning el', 'Diagnostik och felsökning av elinstallationer (typiskt 1-2 h)', 1059, 'kr/h', 'hourly', true, false, 'båda', 'Service', 7),
('el-8', 'el', 'Dra fram ny elpunkt', 'Installation av ny elpunkt. Rum väljs vid bokning', 1059, 'kr/h', 'hourly', true, false, 'inomhus', 'Installationer', 8),
('el-9', 'el', 'Montera TV-väggfäste & kabelkanal', 'Montering av TV-fäste med kabelhantering', 1059, 'kr/h', 'hourly', true, false, 'inomhus', 'Montering', 9),
('el-10', 'el', 'Ny el till köksö', 'Elinstallation för köksö med uttag', 1059, 'kr/h', 'quote', true, false, 'inomhus', 'Installationer', 10),
('el-11', 'el', 'Ny elgrupp', 'Installation av ny elgrupp i centralen', 1059, 'kr/h', 'quote', true, false, 'inomhus', 'Installationer', 11),

-- VVS services
('vvs-1', 'vvs', 'Byta blandare', 'Byte av blandare. Rum/typ väljs vid bokning', 959, 'kr/h', 'hourly', true, false, 'inomhus', 'Blandare', 1),
('vvs-2', 'vvs', 'Byta toalettstol', 'Byte av toalettstol med installation', 2890, 'kr', 'fixed', true, false, 'inomhus', 'Sanitetsporsliner', 2),
('vvs-3', 'vvs', 'Byta vattenlås & avloppssats', 'Byte av vattenlås och avloppssats', 959, 'kr/h', 'hourly', true, false, 'inomhus', 'Avlopp', 3),
('vvs-4', 'vvs', 'Montera diskmaskin', 'Installation och anslutning av diskmaskin', 959, 'kr/h', 'hourly', true, false, 'inomhus', 'Vitvaror', 4),
('vvs-5', 'vvs', 'Montera tvättmaskin', 'Installation och anslutning av tvättmaskin', 959, 'kr/h', 'hourly', true, false, 'inomhus', 'Vitvaror', 5),
('vvs-6', 'vvs', 'Installera duschblandare', 'Installation av ny duschblandare', 959, 'kr/h', 'hourly', true, false, 'inomhus', 'Dusch', 6),
('vvs-7', 'vvs', 'Installera takdusch', 'Installation av takdusch med rör', 959, 'kr/h', 'hourly', true, false, 'inomhus', 'Dusch', 7),
('vvs-8', 'vvs', 'Byta radiator', 'Byte av radiator med anslutningar', 959, 'kr/h', 'hourly', true, false, 'inomhus', 'Värme', 8),
('vvs-9', 'vvs', 'Byta termostatventil', 'Byte av termostatventil på radiator', 959, 'kr/h', 'hourly', true, false, 'inomhus', 'Värme', 9),
('vvs-10', 'vvs', 'Tätta rörkopplingar', 'Täta läckande rörkopplingar', 959, 'kr/h', 'hourly', true, false, 'inomhus', 'Service', 10),
('vvs-11', 'vvs', 'Åtgärda dropp', 'Reparera droppande kranar', 959, 'kr/h', 'hourly', true, false, 'inomhus', 'Service', 11),
('vvs-12', 'vvs', 'Golvbrunnsbyte', 'Byte av golvbrunn med anslutningar', 959, 'kr/h', 'quote', true, false, 'inomhus', 'Större projekt', 12),
('vvs-13', 'vvs', 'Badrumsrenovering', 'Komplett badrumsrenovering', 959, 'kr/h', 'quote', true, false, 'inomhus', 'Större projekt', 13),

-- Snickeri services
('snickeri-1', 'snickeri', 'Platsbyggd garderob', 'Tillverkning av platsbyggd garderob. Storlek väljs vid bokning', 859, 'kr/h', 'quote', true, false, 'inomhus', 'Förvaring', 1),
('snickeri-2', 'snickeri', 'Köksluckor & bänkskivor', 'Byte av köksluckor och installation av bänkskivor', 859, 'kr/h', 'quote', true, false, 'inomhus', 'Kök', 2),
('snickeri-3', 'snickeri', 'Inredning & hyllor', 'Tillverkning av specialanpassad inredning och hyllsystem', 859, 'kr/h', 'hourly', true, false, 'inomhus', 'Inredning', 3),
('snickeri-4', 'snickeri', 'Dörrmontage', 'Montering av innerdörrar med karmar och handtag', 859, 'kr/h', 'hourly', true, false, 'inomhus', 'Dörrar', 4),
('snickeri-5', 'snickeri', 'Lister & finish', 'Installation av golv-, tak- och dörrfoder', 859, 'kr/h', 'hourly', true, false, 'inomhus', 'Finish', 5),

-- Montering services
('montering-1', 'montering', 'IKEA-möbler', 'Montering av alla typer av IKEA-möbler', 759, 'kr/h', 'hourly', true, false, 'inomhus', 'Möbler', 1),
('montering-2', 'montering', 'TV-väggfäste', 'Säker montering av TV på vägg', 890, 'kr', 'fixed', true, false, 'inomhus', 'Elektronik', 2),
('montering-3', 'montering', 'Tavlor och speglar', 'Upphängning av tavlor, speglar och konst', 590, 'kr', 'fixed', true, false, 'inomhus', 'Inredning', 3),
('montering-4', 'montering', 'Vitvaror (kyl, frys, ugn)', 'Installation och anslutning av vitvaror', 1290, 'kr', 'fixed', true, false, 'inomhus', 'Vitvaror', 4),

-- Trädgård services
('tradgard-1', 'tradgard', 'Gräsklippning', 'Regelbunden gräsklippning och kanttrimning', 659, 'kr/h', 'hourly', false, true, 'utomhus', 'Skötsel', 1),
('tradgard-2', 'tradgard', 'Häckklippning', 'Beskärning av häckar och buskar', 659, 'kr/h', 'hourly', false, true, 'utomhus', 'Skötsel', 2),
('tradgard-3', 'tradgard', 'Ogräsrensning', 'Borttagning av ogräs från rabatter och gångar', 659, 'kr/h', 'hourly', false, true, 'utomhus', 'Skötsel', 3),
('tradgard-4', 'tradgard', 'Plantering och anläggning', 'Plantering av växter och anläggning av rabatter', 659, 'kr/h', 'quote', true, false, 'utomhus', 'Anläggning', 4),
('tradgard-5', 'tradgard', 'Lövkrattning', 'Rensning av löv från gräsmatta och rabatter', 659, 'kr/h', 'hourly', false, true, 'utomhus', 'Skötsel', 5),
('tradgard-6', 'tradgard', 'Snöskottning/sandning', 'Snöröjning och halkbekämpning vid uppfart och gångar', 659, 'kr/h', 'hourly', false, true, 'utomhus', 'Vinterservice', 6),

-- Städning services
('stadning-1', 'stadning', 'Hemstäd regelbundet', 'Regelbunden städning av hemmet', 459, 'kr/h', 'hourly', false, true, 'inomhus', 'Hemstäd', 1),
('stadning-2', 'stadning', 'Flyttstäd', 'Grundlig städning vid flytt', 459, 'kr/h', 'quote', false, true, 'inomhus', 'Specialstäd', 2),
('stadning-3', 'stadning', 'Byggstäd', 'Städning efter renovering och byggarbeten', 459, 'kr/h', 'quote', false, true, 'inomhus', 'Specialstäd', 3),
('stadning-4', 'stadning', 'Fönsterputs', 'Professionell fönsterputsning in- och utvändigt', 459, 'kr/h', 'hourly', false, true, 'båda', 'Specialstäd', 4),

-- Markarbeten services
('markarbeten-1', 'markarbeten', 'Schaktning', 'Grävning och schaktarbeten för grund och ledningar', 859, 'kr/h', 'quote', true, false, 'utomhus', 'Grävning', 1),
('markarbeten-2', 'markarbeten', 'Dränering', 'Installation av dräneringssystem', 859, 'kr/h', 'quote', true, false, 'utomhus', 'Dränering', 2),
('markarbeten-3', 'markarbeten', 'Plattläggning', 'Läggning av plattor och stenbeläggning', 859, 'kr/h', 'quote', true, false, 'utomhus', 'Beläggning', 3),
('markarbeten-4', 'markarbeten', 'Murverk', 'Murarbeten och stensättning', 859, 'kr/h', 'quote', true, false, 'utomhus', 'Murning', 4),

-- Tekniska installationer services
('tekniska-1', 'tekniska-installationer', 'Nätverk & IT', 'Installation av nätverk och IT-infrastruktur', 1059, 'kr/h', 'hourly', false, false, 'inomhus', 'IT', 1),
('tekniska-2', 'tekniska-installationer', 'Larmsystem', 'Installation av säkerhetslarm och övervakningssystem', 1059, 'kr/h', 'quote', false, false, 'inomhus', 'Säkerhet', 2),
('tekniska-3', 'tekniska-installationer', 'Ljud & Bild', 'Installation av hemmabio och ljudsystem', 1059, 'kr/h', 'quote', false, false, 'inomhus', 'AV', 3),

-- Flytt services
('flytt-1', 'flytt', 'Bärhjälp', 'Hjälp med tunga lyft och transport', 559, 'kr/h', 'hourly', false, true, 'båda', 'Transport', 1),
('flytt-2', 'flytt', 'Packning', 'Professionell packning av dina tillhörigheter', 559, 'kr/h', 'hourly', false, true, 'inomhus', 'Packning', 2),
('flytt-3', 'flytt', 'Flyttransport', 'Transport av möbler och tillhörigheter', 559, 'kr/h', 'hourly', false, true, 'båda', 'Transport', 3);

-- Create function to auto-translate services using DeepL
CREATE OR REPLACE FUNCTION translate_service_to_english(service_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  service_record record;
BEGIN
  -- Get the service record
  SELECT * INTO service_record FROM public.services WHERE id = service_id;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Mark as translation in progress
  UPDATE public.services 
  SET translation_status = 'pending'
  WHERE id = service_id;
  
  -- Call edge function to translate
  -- This will be handled by a background job or trigger
  
  RETURN true;
END;
$$;