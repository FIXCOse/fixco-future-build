-- Create smart products table
CREATE TABLE public.smart_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('security', 'lighting', 'climate', 'cleaning', 'garden', 'entertainment')),
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  ai_features JSONB DEFAULT '[]'::jsonb,
  
  -- Pricing
  product_price NUMERIC NOT NULL,
  installation_price NUMERIC NOT NULL DEFAULT 0,
  total_price NUMERIC GENERATED ALWAYS AS (product_price + installation_price) STORED,
  
  -- Installation details
  installation_time TEXT,
  installation_difficulty TEXT CHECK (installation_difficulty IN ('Lätt', 'Medium', 'Svår')),
  installation_included JSONB DEFAULT '[]'::jsonb,
  
  -- Popularity and ratings
  view_count INTEGER DEFAULT 0,
  purchase_count INTEGER DEFAULT 0,
  popularity_score NUMERIC DEFAULT 0, -- Calculated popularity score
  
  -- Reviews and ratings
  average_rating NUMERIC DEFAULT 0 CHECK (average_rating >= 0 AND average_rating <= 5),
  total_reviews INTEGER DEFAULT 0,
  value_rating NUMERIC DEFAULT 0, -- Price vs quality rating
  
  -- Product details
  warranty_years INTEGER DEFAULT 1,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for better performance
CREATE INDEX idx_smart_products_category ON smart_products(category);
CREATE INDEX idx_smart_products_popularity ON smart_products(popularity_score DESC);
CREATE INDEX idx_smart_products_price ON smart_products(total_price);
CREATE INDEX idx_smart_products_rating ON smart_products(average_rating DESC);
CREATE INDEX idx_smart_products_value ON smart_products(value_rating DESC);

-- Enable RLS
ALTER TABLE public.smart_products ENABLE ROW LEVEL SECURITY;

-- Create policies - products are public read-only for customers
CREATE POLICY "Anyone can view active products" 
ON public.smart_products 
FOR SELECT 
USING (is_active = true);

-- Admin can manage all products
CREATE POLICY "Admin can manage products" 
ON public.smart_products 
FOR ALL 
USING (is_admin_or_owner());

-- Create function to update popularity score
CREATE OR REPLACE FUNCTION update_product_popularity()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate popularity based on views and purchases (weighted)
  NEW.popularity_score = (NEW.view_count * 0.1) + (NEW.purchase_count * 2.0) + (NEW.average_rating * 5.0);
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update popularity
CREATE TRIGGER smart_products_popularity_trigger
  BEFORE UPDATE ON smart_products
  FOR EACH ROW
  EXECUTE FUNCTION update_product_popularity();

-- Create function to track product views
CREATE OR REPLACE FUNCTION track_product_view(p_product_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE smart_products 
  SET view_count = view_count + 1
  WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create product interaction logs table
CREATE TABLE public.product_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES smart_products(id),
  user_id UUID REFERENCES auth.users(id),
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'click', 'inquiry', 'purchase')),
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for interactions
ALTER TABLE public.product_interactions ENABLE ROW LEVEL SECURITY;

-- Policy for logging interactions
CREATE POLICY "Anyone can log interactions" 
ON public.product_interactions 
FOR INSERT 
WITH CHECK (true);

-- Policy for reading own interactions
CREATE POLICY "Users can view own interactions" 
ON public.product_interactions 
FOR SELECT 
USING (user_id = auth.uid() OR user_id IS NULL);

-- Admin can see all interactions
CREATE POLICY "Admin can view all interactions" 
ON public.product_interactions 
FOR SELECT 
USING (is_admin_or_owner());

-- Insert sample data with realistic Swedish market products
INSERT INTO smart_products (name, brand, model, category, description, features, ai_features, product_price, installation_price, installation_time, installation_difficulty, installation_included, view_count, purchase_count, average_rating, total_reviews, value_rating, warranty_years, image_url) VALUES

-- SÄKERHET (Premium till Budget)
('Yale Doorman L3', 'Yale', 'Doorman L3', 'security', 'Premiumlås med fingeravtryck och WiFi', 
 '["Fingeravtryck + PIN-kod", "Bluetooth + WiFi", "Skandinaviskt godkänt lås", "Batteri 12+ månader"]'::jsonb,
 '["Lär sig dina rutiner", "Automatisk låsning", "Aktivitetslogg med mönsterigenkänning"]'::jsonb,
 4990, 1500, '2-3 timmar', 'Medium', '["Installation", "Konfiguration", "Utbildning"]'::jsonb,
 1250, 89, 4.6, 156, 4.2, 2, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('Ring Video Doorbell Pro 2', 'Ring (Amazon)', 'Video Doorbell Pro 2', 'security', 'Populär smart dörrklocka med HD-video',
 '["1536p HD-video", "Rörelsezoner", "Tvåvägskommunikation", "Nattseende"]'::jsonb,
 '["Paketdetektering", "Personigenkänning", "Smart rörelseavkänning"]'::jsonb,
 2490, 800, '1-2 timmar', 'Lätt', '["Montering", "WiFi-setup", "App-konfiguration"]'::jsonb,
 2100, 167, 4.4, 289, 4.5, 1, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('TP-Link Tapo C200', 'TP-Link', 'Tapo C200 Pan/Tilt', 'security', 'Billig smart kamera med bra funktioner',
 '["1080p Full HD", "360° horisontell rotation", "Nattsyn upp till 9m", "Rörelse- och ljuddetektering"]'::jsonb,
 '["Smart rörelsespårning", "Babygråt-detektering", "Automatisk personföljning"]'::jsonb,
 299, 300, '30 minuter', 'Lätt', '["WiFi-setup", "App-installation", "Grundkonfiguration"]'::jsonb,
 3400, 245, 4.1, 512, 4.8, 2, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

-- BELYSNING (Premium till Budget)  
('Philips Hue White & Color', 'Philips', 'Hue White & Color Ambiance', 'lighting', 'Marknads-ledande smart belysning',
 '["16 miljoner färger", "Dimbar 1-100%", "Zigbee 3.0", "25 000 timmars livslängd"]'::jsonb,
 '["Adaptiv belysning baserat på tid", "Geofencing (automatisk på/av)", "Synkroniseras med solens rytm"]'::jsonb,
 8990, 1200, '2-3 timmar för hela hemmet', 'Lätt', '["Installation av Hue Bridge", "Lampbyten", "App-setup"]'::jsonb,
 1890, 134, 4.7, 203, 4.0, 2, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('TP-Link Tapo L530E 4-pack', 'TP-Link', 'Tapo L530E WiFi Smart Bulb', 'lighting', 'Prisvärd smart belysning utan hub',
 '["16 miljoner färger", "WiFi-anslutning (ingen hub)", "Dimbar 1-100%", "Röststyrning Alexa/Google"]'::jsonb,
 '["Automatiska scheman", "Solnedgång/soluppgång-anpassning", "Närvarobaserad belysning"]'::jsonb,
 599, 400, '1 timme', 'Lätt', '["4 lampor", "WiFi-setup", "App-konfiguration"]'::jsonb,
 4100, 312, 4.3, 467, 4.9, 2, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

-- KLIMAT
('Google Nest Learning Thermostat', 'Google', 'Nest Learning Thermostat 3rd Gen', 'climate', 'AI-driven termostat som lär sig',
 '["Läckagesensor för rör", "Väderprognos-integration", "Fjärrstyrning via app", "Energihistorik"]'::jsonb,
 '["Lär sig dina vanor på 1 vecka", "Auto-Schedule funktion", "Före/efter rapporter på energianvändning"]'::jsonb,
 2890, 1800, '2-3 timmar', 'Medium', '["Installation", "Konfiguration", "Kalibrering"]'::jsonb,
 890, 67, 4.5, 134, 4.3, 2, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

-- ROBOTAR  
('iRobot Roomba j7+', 'iRobot', 'Roomba j7+', 'cleaning', 'Premium robot med AI-navigation',
 '["PrecisionVision navigation", "Självtömmande bas 60 dagar", "Kartläggning av hela hemmet", "3-stegs rengöringssystem"]'::jsonb,
 '["Undviker husdjursolyckor (P.O.O.P Promise)", "Lär sig hemmet layout", "Föreslår optimal städschema"]'::jsonb,
 12990, 500, '1 timme', 'Lätt', '["Uppackning", "Setup", "Första kartläggning"]'::jsonb,
 1100, 78, 4.8, 89, 3.8, 1, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('Eufy RoboVac 11S', 'Eufy', 'RoboVac 11S', 'cleaning', 'Budget-robot med bra prestanda',
 '["Supertyst (55dB)", "1300Pa sugkraft", "100 minuters batteritid", "Automatisk återladdning"]'::jsonb,
 '["Smart rengöringsmönster", "Automatisk kantdammsugning", "Hinderundvikande"]'::jsonb,
 1990, 200, '15 minuter', 'Lätt', '["Uppackning", "Laddstation", "Fjärrkontroll"]'::jsonb,
 2900, 178, 4.2, 456, 4.7, 1, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

-- TRÄDGÅRD
('Husqvarna Automower 315X', 'Husqvarna', 'Automower 315X', 'garden', 'Premium gräsklippare med GPS',
 '["GPS-navigation & tracking", "Klippytor upp till 1500m²", "Mulchning för friskare gräs", "Automatisk regndetektering"]'::jsonb,
 '["X-line navigation (AI-driven routing)", "Weather timer (anpassar efter väder)", "Automower Connect app med AI-analys"]'::jsonb,
 28990, 4500, '4-6 timmar', 'Svår', '["Gränstråd installation", "Laddstation", "GPS-konfiguration"]'::jsonb,
 450, 23, 4.9, 34, 3.5, 2, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

-- UNDERHÅLLNING (Premium till Budget)
('Sonos Arc Surround System', 'Sonos', 'Arc + Sub + One SL', 'entertainment', 'Premium hemmabio-system',
 '["Dolby Atmos soundbar", "Trådlös subwoofer", "Surroundhögtalare", "AirPlay 2 & Spotify Connect"]'::jsonb,
 '["Trueplay rumsanpassning", "Automatisk EQ-justering", "Speech Enhancement AI"]'::jsonb,
 22990, 2000, '2-3 timmar', 'Medium', '["TV-anslutning", "Surroundpositionering", "Trueplay-kalibrering"]'::jsonb,
 670, 45, 4.8, 67, 3.2, 2, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('Amazon Echo Dot (5:e gen) 3-pack', 'Amazon', 'Echo Dot 5th Generation', 'entertainment', 'Populär budget smart högtalare',
 '["Alexa inbyggt", "Smart Home Hub", "Bluetooth & WiFi", "Droppar in överallt"]'::jsonb,
 '["Adaptiv volym", "Alexa Conversations", "Multi-room musik"]'::jsonb,
 1497, 400, '1 timme för 3 st', 'Lätt', '["3 Echo Dots", "WiFi-setup", "Alexa-konfiguration"]'::jsonb,
 5200, 389, 4.1, 724, 4.6, 1, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('Chromecast med Google TV (4K)', 'Google', 'Chromecast with Google TV 4K', 'entertainment', 'Billig streaming-enhet',
 '["4K HDR10+ support", "Dolby Vision", "Google TV interface", "Röststyrning med fjärr"]'::jsonb,
 '["Personliga rekommendationer", "Content discovery AI", "Smart användarprofiler"]'::jsonb,
 699, 300, '30 minuter', 'Lätt', '["Chromecast enhet", "HDMI-anslutning", "Google TV setup"]'::jsonb,
 6700, 456, 4.0, 892, 4.9, 1, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png');

-- Update popularity scores for all products
UPDATE smart_products SET view_count = view_count + 0 WHERE id IS NOT NULL;