
-- Tillägg för MARKARBETEN & GOLV kategorier (Batch 1)

-- MARKARBETEN: Bygga altan/trädäck
INSERT INTO service_addons (service_id, title_sv, title_en, description_sv, description_en, addon_price, icon, is_active, sort_order) VALUES 
  ('altan-bygga', 'Bortforsling av jord och sten', 'Soil and stone removal', 'Vi tar hand om och transporterar bort överskottsjord och sten från byggarbetsplatsen', 'We handle and transport away excess soil and stone from the construction site', 800, 'truck', true, 1),
  ('altan-bygga', 'Byggstäd efter byggnation', 'Post-construction cleaning', 'Professionell efterstädning när altanen är färdigbyggd', 'Professional post-construction cleaning when the deck is finished', 1200, 'sparkles', true, 2),
  ('altan-bygga', 'LED-belysning i altan', 'LED deck lighting', 'Installera inbyggd LED-belysning för mysig kvällsbelysning', 'Install built-in LED lighting for cozy evening ambiance', 4500, 'lightbulb', true, 3),
  ('altan-bygga', 'Behandling mot väder och röta', 'Weather and rot treatment', 'Professionell behandling för längre livslängd', 'Professional treatment for extended lifespan', 2500, 'shield', true, 4);

-- MARKARBETEN: Plattläggning
INSERT INTO service_addons (service_id, title_sv, title_en, description_sv, description_en, addon_price, icon, is_active, sort_order) VALUES 
  ('markarbeten-3', 'Bortforsling av jord/grus', 'Soil/gravel removal', 'Bortforsling av överskottsmaterial från schaktning', 'Removal of excess material from excavation', 600, 'truck', true, 1),
  ('markarbeten-3', 'Schaktning och markarbete', 'Excavation and groundwork', 'Förberedande schaktning och planering av marken', 'Preparatory excavation and ground leveling', 3500, 'wrench', true, 2),
  ('markarbeten-3', 'Geotextil och dräneringslager', 'Geotextile and drainage', 'Läggning av geotextil och dräneringslager för stabil grund', 'Installation of geotextile and drainage layer for stable foundation', 1500, 'droplet', true, 3);

-- MARKARBETEN: Dränering
INSERT INTO service_addons (service_id, title_sv, title_en, description_sv, description_en, addon_price, icon, is_active, sort_order) VALUES 
  ('markarbeten-2', 'Bortforsling av överskottsjord', 'Excess soil removal', 'Transport bort av överskottsjord från dräneringsarbetet', 'Transportation of excess soil from drainage work', 800, 'truck', true, 1),
  ('markarbeten-2', 'Schaktning', 'Excavation', 'Grävning för dräneringsledningar', 'Digging for drainage pipes', 4000, 'wrench', true, 2);

-- MARKARBETEN: Murverk  
INSERT INTO service_addons (service_id, title_sv, title_en, description_sv, description_en, addon_price, icon, is_active, sort_order) VALUES 
  ('markarbeten-4', 'Bortforsling av rivningsmaterial', 'Demolition material removal', 'Bortforsling av gammalt tegel och murbruk', 'Removal of old bricks and mortar', 800, 'truck', true, 1),
  ('markarbeten-4', 'Byggstäd efter murning', 'Post-masonry cleaning', 'Städning efter murningsarbete', 'Cleaning after masonry work', 600, 'sparkles', true, 2);

-- MARKARBETEN: Renovera befintlig altan
INSERT INTO service_addons (service_id, title_sv, title_en, description_sv, description_en, addon_price, icon, is_active, sort_order) VALUES 
  ('altan-renovera', 'Bortforsling av gammalt trä', 'Old wood removal', 'Borttransport av trasiga eller utbytta trädelar', 'Transportation of damaged or replaced wood parts', 1200, 'truck', true, 1),
  ('altan-renovera', 'Behandling och impregnering', 'Treatment and impregnation', 'Behandla altanen mot väder och slitage', 'Treat the deck against weather and wear', 2000, 'shield', true, 2);

-- MARKARBETEN: Schaktning
INSERT INTO service_addons (service_id, title_sv, title_en, description_sv, description_en, addon_price, icon, is_active, sort_order) VALUES 
  ('markarbeten-1', 'Bortforsling av jord/sten', 'Soil/stone removal', 'Bortforsling per kubikmeter', 'Removal per cubic meter', 1500, 'truck', true, 1);

-- MARKARBETEN: Staket & räcke
INSERT INTO service_addons (service_id, title_sv, title_en, description_sv, description_en, addon_price, icon, is_active, sort_order) VALUES 
  ('altan-rackesnstaket', 'Bortforsling av gammalt staket', 'Old fence removal', 'Demontering och borttransport av gammalt staket', 'Dismantling and removal of old fence', 600, 'truck', true, 1),
  ('altan-rackesnstaket', 'Målning/behandling av staket', 'Fence painting/treatment', 'Målning eller behandling för långvarigt skydd', 'Painting or treatment for long-lasting protection', 1800, 'paintbrush', true, 2);

-- GOLV: Lägga parkettgolv
INSERT INTO service_addons (service_id, title_sv, title_en, description_sv, description_en, addon_price, icon, is_active, sort_order) VALUES 
  ('golv-parkett', 'Flytta möbler före/efter', 'Move furniture before/after', 'Vi flyttar dina möbler så du slipper', 'We move your furniture so you don''t have to', 1500, 'package', true, 1),
  ('golv-parkett', 'Bortforsling av gammalt golv', 'Old floor removal', 'Rivning och bortforsling av befintligt golv', 'Demolition and removal of existing floor', 1200, 'truck', true, 2),
  ('golv-parkett', 'Byggstäd efter golvläggning', 'Post-installation cleaning', 'Professionell städning efter färdigt golv', 'Professional cleaning after floor installation', 800, 'sparkles', true, 3),
  ('golv-parkett', 'Golvvärme-installation', 'Floor heating installation', 'Installation av elektrisk golvvärme', 'Installation of electric floor heating', 8500, 'flame', true, 4);

-- GOLV: Lägga laminat/vinylgolv
INSERT INTO service_addons (service_id, title_sv, title_en, description_sv, description_en, addon_price, icon, is_active, sort_order) VALUES 
  ('golv-laminat', 'Flytta möbler före/efter', 'Move furniture before/after', 'Vi flyttar dina möbler åt dig', 'We move your furniture for you', 1200, 'package', true, 1),
  ('golv-laminat', 'Bortforsling av gammalt golv', 'Old floor removal', 'Rivning och transport av gammalt golv', 'Demolition and transport of old floor', 1000, 'truck', true, 2),
  ('golv-laminat', 'Byggstäd efter läggning', 'Post-installation cleaning', 'Efterstädning när golvet är klart', 'Cleaning when floor is finished', 600, 'sparkles', true, 3);

-- GOLV: Lägga klinkergolv
INSERT INTO service_addons (service_id, title_sv, title_en, description_sv, description_en, addon_price, icon, is_active, sort_order) VALUES 
  ('golv-klinker', 'Flytta möbler före/efter', 'Move furniture before/after', 'Möbelflyttning ingår ej i priset', 'Furniture moving not included in price', 1500, 'package', true, 1),
  ('golv-klinker', 'Bortforsling av gammalt golv', 'Old floor removal', 'Rivning och bortforsling av gammalt golv', 'Demolition and removal of old floor', 1500, 'truck', true, 2),
  ('golv-klinker', 'Byggstäd efter kakelsättning', 'Post-tiling cleaning', 'Professionell städning efter kakelsättning', 'Professional cleaning after tiling', 1000, 'sparkles', true, 3),
  ('golv-klinker', 'Golvvärme-installation', 'Floor heating installation', 'Installation av elektrisk golvvärme', 'Installation of electric floor heating', 9500, 'flame', true, 4);

-- GOLV: Lägga mattgolv
INSERT INTO service_addons (service_id, title_sv, title_en, description_sv, description_en, addon_price, icon, is_active, sort_order) VALUES 
  ('golv-matta', 'Flytta möbler före/efter', 'Move furniture before/after', 'Vi hjälper till med möblerna', 'We help with the furniture', 1000, 'package', true, 1),
  ('golv-matta', 'Bortforsling av gammal matta', 'Old carpet removal', 'Rivning och transport av gammal matta', 'Removal and transport of old carpet', 800, 'truck', true, 2),
  ('golv-matta', 'Byggstäd efter läggning', 'Post-installation cleaning', 'Städning efter färdig läggning', 'Cleaning after installation', 500, 'sparkles', true, 3);

-- GOLV: Slipa och lacka parkett
INSERT INTO service_addons (service_id, title_sv, title_en, description_sv, description_en, addon_price, icon, is_active, sort_order) VALUES 
  ('golv-slipa', 'Flytta möbler före/efter', 'Move furniture before/after', 'Möbelflyttning innan slipning', 'Furniture moving before sanding', 1500, 'package', true, 1),
  ('golv-slipa', 'Byggstäd efter slipning', 'Post-sanding cleaning', 'Dammsugning och städning efter sliparbetet', 'Vacuuming and cleaning after sanding', 1000, 'sparkles', true, 2),
  ('golv-slipa', 'Extra lacklager för hållbarhet', 'Extra lacquer layer', 'Ytterligare lacklager för extra skydd', 'Additional lacquer layer for extra protection', 800, 'shield', true, 3);
