-- Add many more Swedish market products across all categories

INSERT INTO smart_products (name, brand, model, category, description, features, ai_features, product_price, installation_price, installation_time, installation_difficulty, installation_included, view_count, purchase_count, average_rating, total_reviews, value_rating, warranty_years, image_url) VALUES

-- SÄKERHET - Fler alternativ från budget till premium
('Aqara Door Window Sensor', 'Aqara', 'Door & Window Sensor', 'security', 'Budget smart sensor för dörrar och fönster',
 '["Zigbee 3.0", "2 års batteritid", "Apple HomeKit", "Magnetisk sensor"]'::jsonb,
 '["Automatisk aktivering", "Smart hem-integration", "Notifieringar vid öppning"]'::jsonb,
 149, 200, '15 minuter per sensor', 'Lätt', '["5 sensorer", "HomeKit setup", "Batterier"]'::jsonb,
 4800, 298, 4.2, 445, 4.9, 2, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('Netatmo Smart Video Doorbell', 'Netatmo', 'Smart Video Doorbell', 'security', 'Fransk premium dörrklocka utan abonnemang',
 '["1080p Full HD", "Ingen molnkostnad", "Apple HomeKit", "Ansiktsigenkänning"]'::jsonb,
 '["AI-ansiktsigenkänning", "Paket- och persondetektering", "Smart notifieringar"]'::jsonb,
 3990, 1200, '2-3 timmar', 'Medium', '["Kabelanslutning", "HomeKit setup", "Molnfri lagring"]'::jsonb,
 890, 67, 4.6, 123, 4.3, 2, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('Hikvision ColorVu 4K', 'Hikvision', 'DS-2CD2387G2-LU', 'security', 'Professionell 4K säkerhetskamera',
 '["4K 8MP upplösning", "ColorVu nattseende", "Inbyggd mikrofon", "PoE-driven"]'::jsonb,
 '["Smart intrångsdetektering", "Fordonigenkänning", "Ljudanalys"]'::jsonb,
 2890, 1800, '3-4 timmar', 'Svår', '["Professionell installation", "Nätverkskonfiguration", "NVR-setup"]'::jsonb,
 650, 34, 4.8, 89, 4.1, 3, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('Reolink Argus 3 Pro', 'Reolink', 'Argus 3 Pro', 'security', 'Budget trådlös kamera med solpanel',
 '["2K QHD", "Solpanel medföljer", "PIR-sensor", "Färg-nattseende"]'::jsonb,
 '["Smart persondetektering", "Automatisk inspelning", "Tidslapse-funktion"]'::jsonb,
 1290, 400, '1 timme', 'Lätt', '["Solpanel", "MicroSD-kort", "Väderbeständig montering"]'::jsonb,
 2100, 145, 4.3, 267, 4.6, 2, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('Unifi Protect G4 Doorbell Pro', 'Ubiquiti', 'UniFi Protect G4 Doorbell Pro', 'security', 'Professionell enterprise dörrklocka',
 '["4K HDR video", "Package detection", "2-way audio", "PoE+ powered"]'::jsonb,
 '["AI package detection", "Smart chime", "License plate recognition"]'::jsonb,
 4590, 2500, '4-5 timmar', 'Svår', '["PoE+ installation", "UniFi Network setup", "Professional config"]'::jsonb,
 320, 18, 4.9, 45, 3.8, 3, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

-- BELYSNING - Fler alternativ
('LIFX Color 1000', 'LIFX', 'Color 1000 WiFi Smart Bulb', 'lighting', 'Premium WiFi-lampa utan hub',
 '["WiFi-anslutning", "16 miljoner färger", "1100 lumen", "HomeKit & Alexa"]'::jsonb,
 '["Day & Dusk automation", "Music visualization", "Security lighting"]'::jsonb,
 899, 150, '10 minuter per lampa', 'Lätt', '["1 lampa", "WiFi setup", "App installation"]'::jsonb,
 1800, 234, 4.4, 456, 4.3, 2, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('Yeelight LED Strip Plus', 'Yeelight', 'Lightstrip Plus 2M', 'lighting', 'Budget LED-strip för ambient ljus',
 '["2 meter strip", "16 miljoner färger", "WiFi 2.4GHz", "Klippbar var 10cm"]'::jsonb,
 '["Musiksynkronisering", "Scen-automation", "DIY-lägen"]'::jsonb,
 299, 200, '30 minuter', 'Lätt', '["2m LED strip", "Kontroller", "3M-tejp"]'::jsonb,
 3400, 289, 4.1, 578, 4.8, 1, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('Signify Wiz Connected Colors', 'Signify', 'Wiz Colors A60 E27', 'lighting', 'Mellanpris smart belysning',
 '["WiFi-anslutning", "64000 färgnyanser", "Tunable white", "Alexa & Google"]'::jsonb,
 '["Circadian rytm", "Vacation mode", "SpaceSense motion detection"]'::jsonb,
 199, 100, '5 minuter per lampa', 'Lätt', '["1 lampa", "WiFi pairing", "WiZ app"]'::jsonb,
 2700, 198, 4.2, 389, 4.4, 2, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('Nanoleaf Elements Wood Look', 'Nanoleaf', 'Elements Hexagon Wood 7-pack', 'lighting', 'Design smart belysning med träkänsla',
 '["7 hexagon paneler", "Trästruktur design", "Touch reaktiv", "Thread support"]'::jsonb,
 '["Sound reactive", "Screen mirroring", "Rhythm music sync"]'::jsonb,
 2490, 600, '2 timmar', 'Medium', '["Väggmontering", "Thread setup", "Design layout"]'::jsonb,
 890, 78, 4.7, 134, 4.0, 2, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

-- KLIMAT - Fler alternativ
('Netatmo Smart Thermostat', 'Netatmo', 'Smart Thermostat', 'climate', 'Fransk design-termostat',
 '["Elegant design", "Auto-adapt funktion", "Väder-anpassning", "Energirapporter"]'::jsonb,
 '["Lär sig hemrutiner", "Närvarodetektering", "Geolocation kontroll"]'::jsonb,
 1990, 1500, '2-3 timmar', 'Medium', '["Installation", "App setup", "Kalibrering"]'::jsonb,
 1200, 89, 4.5, 167, 4.4, 2, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('Xiaomi Mi Air Purifier 3H', 'Xiaomi', 'Mi Air Purifier 3H', 'climate', 'Budget luftrenare med HEPA-filter',
 '["HEPA 13 filter", "380 m³/h CADR", "OLED display", "Mi Home app"]'::jsonb,
 '["Auto-läge luftkvalitet", "Smart schemaläggning", "Filterbytevarningar"]'::jsonb,
 1599, 300, '30 minuter', 'Lätt', '["Uppackning", "WiFi setup", "Filter installation"]'::jsonb,
 2800, 167, 4.3, 445, 4.6, 2, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('Dyson Pure Hot+Cool HP07', 'Dyson', 'Pure Hot+Cool HP07', 'climate', 'Premium luftrenare med värme/kyla',
 '["HEPA H13 & aktivt kol", "Värme och fläkt", "350° oscillering", "Dyson Link app"]'::jsonb,
 '["Luftkvalitets-sensorer", "Auto-läge", "Nattläge med timer"]'::jsonb,
 7990, 500, '1 timme', 'Lätt', '["Installation", "App setup", "Filter check"]'::jsonb,
 670, 45, 4.6, 123, 3.9, 2, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('IQAir HealthPro Plus', 'IQAir', 'HealthPro Plus', 'climate', 'Schweizisk medicinsk luftrenare',
 '["HyperHEPA filtration", "Medicinskklass", "0.003 mikron partiklar", "Tyst drift"]'::jsonb,
 '["Smart filter monitoring", "Automatic speed adjustment", "Air quality feedback"]'::jsonb,
 12990, 800, '1 timme', 'Lätt', '["Professional setup", "Filter installation", "Calibration"]'::jsonb,
 180, 12, 4.9, 34, 3.2, 3, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

-- ROBOTAR - Fler alternativ
('Tineco PURE ONE S12', 'Tineco', 'PURE ONE S12 Smart Vacuum', 'cleaning', 'Trådlös smart dammsugare',
 '["iLoop Smart sensor", "LED display", "40 min batteritid", "Anti-tangle borste"]'::jsonb,
 '["Automatisk sugkrafts-justering", "Smartt dammdetektering", "App kontroll"]'::jsonb,
 2990, 200, '15 minuter', 'Lätt', '["Uppackning", "App setup", "Tillbehör"]'::jsonb,
 1900, 156, 4.4, 278, 4.5, 2, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('Shark IQ Robot RV1001AE', 'Shark', 'IQ Robot RV1001AE', 'cleaning', 'Amerikansk premium robot',
 '["Självtömmande bas", "IQ Navigation", "SharkClean app", "Anti-allergen filter"]'::jsonb,
 '["Smart home mapping", "Scheduled cleaning", "Carpet detection"]'::jsonb,
 8990, 500, '1 timme', 'Lätt', '["Base setup", "Mapping run", "App configuration"]'::jsonb,
 450, 34, 4.5, 89, 4.2, 2, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('Bissell CrossWave Pet Pro', 'Bissell', 'CrossWave Pet Pro All-in-One', 'cleaning', 'Våt/torr-robot för husdjursägare',
 '["Tvätt + torr samtidigt", "Husdjurs-specialformel", "Dual-action borstrull", "Smart-Touch kontroller"]'::jsonb,
 '["Pet hair detection", "Smart cleaning modes", "Automatic solution mixing"]'::jsonb,
 3490, 300, '45 minuter', 'Lätt', '["Setup", "Cleaning solution", "Pet formula demo"]'::jsonb,
 890, 67, 4.3, 156, 4.4, 2, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('Narwal Freo', 'Narwal', 'Freo Robot Vacuum & Mop', 'cleaning', 'Advanced robot med självtvätt',
 '["Dual spinning mops", "Automatisk tvätt", "4000Pa suction", "Obstacle avoidance"]'::jsonb,
 '["AI DirtSense", "Smart mopping patterns", "Auto mop lifting"]'::jsonb,
 11990, 500, '1 timme', 'Lätt', '["Base station setup", "Water tank fill", "First clean"]'::jsonb,
 320, 23, 4.7, 67, 3.7, 2, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

-- TRÄDGÅRD - Fler alternativ
('Flymo EasiLife 150', 'Flymo', 'EasiLife 150', 'garden', 'Budget robotgräsklippare från Flymo',
 '["150m² täckning", "Flexicut system", "Lift & tilt sensor", "PIN-kodslås"]'::jsonb,
 '["Random cutting pattern", "Weather protection", "Anti-theft alarm"]'::jsonb,
 4990, 1800, '3-4 timmar', 'Medium', '["Boundary wire 150m", "Charging station", "Setup"]'::jsonb,
 1400, 98, 4.1, 234, 4.7, 2, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('Ambrogio L60 Deluxe', 'Ambrogio', 'L60 Deluxe', 'garden', 'Italiensk premium robotgräsklippare',
 '["600m² kapacitet", "Bluetooth app", "25% lutning", "Brushless motor"]'::jsonb,
 '["Smart area mapping", "Weather adaptive", "Edge cutting precision"]'::jsonb,
 19990, 3500, '5-6 timmar', 'Svår', '["Professional installation", "Perimeter mapping", "App training"]'::jsonb,
 280, 18, 4.8, 45, 3.4, 3, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('Rain Bird Smart WiFi Timer', 'Rain Bird', 'ST8I-WiFi Smart Irrigation', 'garden', 'Smart bevattningssystem',
 '["8 zoner", "WiFi kontroll", "Väder-anpassning", "Rain Bird app"]'::jsonb,
 '["Weather-based watering", "Soil moisture integration", "Water usage tracking"]'::jsonb,
 2290, 2000, '3-4 timmar', 'Svår', '["Zone wiring", "Sensor installation", "System programming"]'::jsonb,
 450, 34, 4.4, 78, 4.2, 3, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

-- UNDERHÅLLNING - Fler alternativ
('KEF LS50 Wireless II', 'KEF', 'LS50 Wireless II', 'entertainment', 'Brittiska premium högtalare',
 '["Uni-Q driver array", "Trådlös streaming", "384kHz/24-bit", "KEF Connect app"]'::jsonb,
 '["Room acoustic adaptation", "Smart crossover", "Digital signal processing"]'::jsonb,
 34990, 1500, '2 timmar', 'Medium', '["Positioning", "Network setup", "Room calibration"]'::jsonb,
 120, 8, 4.9, 23, 2.9, 3, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('JBL Flip 6', 'JBL', 'Flip 6 Portable Speaker', 'entertainment', 'Budget bärbar Bluetooth högtalare',
 '["IP67 vattentät", "12 timmars batteri", "JBL Pro Sound", "USB-C laddning"]'::jsonb,
 '["PartyBoost multi-speaker", "Voice assistant ready", "EQ customization"]'::jsonb,
 899, 0, 'Plug & play', 'Lätt', '["Unboxing", "Bluetooth pairing", "App download"]'::jsonb,
 5600, 445, 4.2, 789, 4.8, 1, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('Denon Home 350', 'Denon', 'Home 350 Wireless Speaker', 'entertainment', 'Japansk Hi-Fi streaming högtalare',
 '["Hi-Res audio", "HEOS multiroom", "Voice control", "AirPlay 2 & Chromecast"]'::jsonb,
 '["Sound optimization", "Smart grouping", "Adaptive audio enhancement"]'::jsonb,
 4990, 400, '1 timme', 'Lätt', '["Network setup", "HEOS app", "Room tuning"]'::jsonb,
 890, 67, 4.6, 134, 4.1, 2, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('PlayStation 5 + Pulse 3D', 'Sony', 'PlayStation 5 Console + Headset', 'entertainment', 'Gaming console med 3D-audio',
 '["4K gaming upp till 120fps", "Ray tracing", "SSD ultra-high speed", "DualSense controller"]'::jsonb,
 '["3D Spatial Audio", "Adaptive triggers", "Haptic feedback", "Smart downloads"]'::jsonb,
 6490, 500, '2 timmar', 'Medium', '["Console setup", "Network config", "Game installation"]'::jsonb,
 2300, 178, 4.7, 456, 4.3, 1, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('Samsung QN90A 65" Neo QLED', 'Samsung', '65" QN90A Neo QLED 4K TV', 'entertainment', 'Premium smart TV med mini-LED',
 '["Neo QLED 4K", "Quantum HDR 32X", "120Hz gaming", "Tizen smart platform"]'::jsonb,
 '["AI upscaling 4K", "Adaptive sound", "Multi-view splitscreen", "SmartThings hub"]'::jsonb,
 24990, 1200, '3-4 timmar', 'Medium', '["Wall mounting", "Smart setup", "Calibration"]'::jsonb,
 450, 34, 4.8, 89, 3.6, 2, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png'),

('TCL 55P635 4K Android TV', 'TCL', '55" P635 4K HDR Android TV', 'entertainment', 'Budget smart TV med bra prestanda',
 '["4K HDR10+", "Android TV 11", "Dolby Audio", "Google Assistant"]'::jsonb,
 '["AI picture optimization", "Content recommendations", "Voice search", "Chromecast built-in"]'::jsonb,
 4990, 800, '2-3 timmar', 'Medium', '["Wall/stand setup", "Android setup", "App installation"]'::jsonb,
 1800, 134, 4.1, 367, 4.6, 2, '/lovable-uploads/d3f251ab-0fc2-4c53-8ba9-e68d78dca329.png');

-- Update popularity scores for all products
UPDATE smart_products SET view_count = view_count + 0 WHERE id IS NOT NULL;