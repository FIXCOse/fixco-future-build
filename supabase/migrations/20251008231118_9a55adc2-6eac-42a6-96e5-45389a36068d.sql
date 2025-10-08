-- Lägg till saknade tjänster med unika ID:n

-- ALTAN (helt nya)
INSERT INTO services (id, title_sv, title_en, description_sv, description_en, category, sub_category, base_price, price_type, rot_eligible, rut_eligible, is_active, sort_order) VALUES
('altan-bygga', 'Bygga altan/trädäck', 'Build Deck/Terrace', 'Bygga ny altan eller trädäck i trä eller komposit. Pris per kvm.', 'Build new wooden or composite deck/terrace. Price per sqm.', 'markarbeten', 'Altan', 3500, 'per_sqm', true, false, true, 10),
('altan-renovera', 'Renovera befintlig altan', 'Renovate Existing Deck', 'Renovering av befintlig altan - slipning, målning, bytes av skadade delar.', 'Renovation of existing deck - sanding, painting, replacement of damaged parts.', 'markarbeten', 'Altan', 1200, 'per_sqm', true, false, true, 11),
('altan-rackesnstaket', 'Staket & räcke till altan', 'Deck Railing & Fence', 'Montera staket och räcke runt altan för säkerhet och stil.', 'Install fence and railing around deck for safety and style.', 'markarbeten', 'Altan', 850, 'hourly', true, false, true, 12),

-- MÅLNING (helt nya)
('malning-innervagg', 'Måla innerväggar', 'Paint Interior Walls', 'Måla om innerväggar - spackling, grundning och målning. Pris per kvm vägg.', 'Repaint interior walls - spackling, priming and painting. Price per sqm wall.', 'malning', 'Innerväggar', 180, 'per_sqm', true, false, true, 20),
('malning-tak', 'Måla tak', 'Paint Ceiling', 'Måla om tak - spackling, grundning och målning. Pris per kvm tak.', 'Repaint ceiling - spackling, priming and painting. Price per sqm ceiling.', 'malning', 'Tak', 200, 'per_sqm', true, false, true, 21),
('malning-dorrar', 'Måla dörrar & karmar', 'Paint Doors & Frames', 'Måla om dörrar och karmar - slipning, grundning och målning.', 'Repaint doors and frames - sanding, priming and painting.', 'malning', 'Dörrar', 850, 'per_unit', true, false, true, 22),
('malning-tapet', 'Tapetsera', 'Wallpaper Installation', 'Ta bort gammal tapet och sätta upp ny tapet. Pris per kvm.', 'Remove old wallpaper and install new. Price per sqm.', 'malning', 'Tapetsering', 250, 'per_sqm', true, false, true, 23),
('malning-fasad', 'Måla fasad', 'Paint Exterior', 'Måla om fasad utvändigt - rengöring, grundning och målning.', 'Repaint exterior facade - cleaning, priming and painting.', 'malning', 'Fasad', 350, 'per_sqm', true, false, true, 24),

-- GOLV (helt nya)
('golv-laminat', 'Lägga laminat/vinylgolv', 'Install Laminate/Vinyl Flooring', 'Lägga laminat eller vinylgolv inklusive underlag. Pris per kvm.', 'Install laminate or vinyl flooring including underlay. Price per sqm.', 'golv', 'Laminat/Vinyl', 450, 'per_sqm', true, false, true, 30),
('golv-parkett', 'Lägga parkettgolv', 'Install Parquet Flooring', 'Lägga massiv eller flerskiktsparkett. Pris per kvm.', 'Install solid or engineered parquet flooring. Price per sqm.', 'golv', 'Parkett', 650, 'per_sqm', true, false, true, 31),
('golv-slipa', 'Slipa och lacka parkett', 'Sand & Lacquer Parquet', 'Slipa och lacka befintligt parkettgolv. Pris per kvm.', 'Sand and lacquer existing parquet flooring. Price per sqm.', 'golv', 'Parkett', 380, 'per_sqm', true, false, true, 32),
('golv-klinker', 'Lägga klinkergolv', 'Install Tile Flooring', 'Lägga klinkerplattor på golv i kök, hall eller badrum.', 'Install ceramic tile flooring in kitchen, hallway or bathroom.', 'golv', 'Klinker', 550, 'per_sqm', true, false, true, 33),
('golv-matta', 'Lägga mattgolv/heltäckande', 'Install Carpet', 'Lägga heltäckningsmatta eller mattgolv. Pris per kvm.', 'Install wall-to-wall carpet or carpet flooring. Price per sqm.', 'golv', 'Matta', 320, 'per_sqm', true, false, true, 34),

-- BADRUM (helt nya)
('badrum-total', 'Totalrenovering badrum', 'Complete Bathroom Renovation', 'Helrenovering av badrum - kakel, golv, rör, elinstallationer, montering.', 'Complete bathroom renovation - tiles, flooring, plumbing, electrical, installation.', 'badrum', 'Totalrenovering', 5500, 'per_sqm', true, false, true, 40),
('badrum-kakla', 'Kakla badrum', 'Tile Bathroom', 'Lägga kakel på väggar och golv i badrum. Pris per kvm.', 'Install tiles on bathroom walls and floors. Price per sqm.', 'badrum', 'Kakel', 850, 'per_sqm', true, false, true, 41),
('badrum-badkar', 'Byta badkar/duschkabin', 'Replace Bathtub/Shower', 'Demontera och byta ut befintligt badkar eller duschkabin.', 'Remove and replace existing bathtub or shower cabin.', 'badrum', 'Sanitetsarbeten', 12500, 'fixed', true, false, true, 42),
('badrum-toalett', 'Byta toalett/handfat', 'Replace Toilet/Sink', 'Byta ut toalett och/eller handfat inklusive anslutningar.', 'Replace toilet and/or sink including connections.', 'badrum', 'Sanitetsarbeten', 6500, 'fixed', true, false, true, 43),

-- KÖK (helt nya)
('kok-ikea', 'Montera IKEA-kök', 'Install IKEA Kitchen', 'Montera komplett IKEA-kök inklusive stommar, luckor, bänkskiva och vitvaror.', 'Install complete IKEA kitchen including cabinets, doors, countertop and appliances.', 'kok', 'Montering', 45000, 'fixed', true, false, true, 50),
('kok-kakel', 'Lägga kakel köksvägg', 'Install Kitchen Backsplash', 'Lägga kakel/klinker på köksvägg bakom spis och diskbänk.', 'Install tiles on kitchen wall behind stove and sink.', 'kok', 'Kakel', 850, 'per_sqm', true, false, true, 51),
('kok-luckor', 'Byta köksluckor', 'Replace Kitchen Doors', 'Byta ut endast luckor och fronter på befintligt kök.', 'Replace only doors and fronts on existing kitchen.', 'kok', 'Renovering', 850, 'hourly', true, false, true, 52),
('kok-bankskiva', 'Installera bänkskiva', 'Install Countertop', 'Installera ny bänkskiva i kök - laminat, kompakt eller sten.', 'Install new kitchen countertop - laminate, compact or stone.', 'kok', 'Bänkskiva', 850, 'hourly', true, false, true, 53),

-- FÖNSTER & DÖRRAR (helt nya)
('fonster-byta', 'Byta fönster', 'Replace Windows', 'Byta ut befintliga fönster mot nya energieffektiva fönster.', 'Replace existing windows with new energy-efficient windows.', 'fonster-dorrar', 'Fönster', 8500, 'per_unit', true, false, true, 60),
('fonster-mala', 'Måla fönster', 'Paint Windows', 'Måla om träfönster - slipning, grundning och målning.', 'Repaint wooden windows - sanding, priming and painting.', 'fonster-dorrar', 'Fönster', 2500, 'per_unit', true, false, true, 61),
('dorr-inner', 'Byta innerdörr', 'Replace Interior Door', 'Byta ut innerdörr inklusive karm och beslag.', 'Replace interior door including frame and hardware.', 'fonster-dorrar', 'Dörrar', 6500, 'per_unit', true, false, true, 62),
('dorr-ytter', 'Byta ytterdörr', 'Replace Exterior Door', 'Byta ut ytterdörr inklusive karm och säkerhetslås.', 'Replace exterior door including frame and security lock.', 'fonster-dorrar', 'Dörrar', 15000, 'per_unit', true, false, true, 63),
('dorr-justera', 'Justera dörrar/fönster', 'Adjust Doors/Windows', 'Justera dörrar och fönster som inte stänger tätt eller kärvar.', 'Adjust doors and windows that don''t close properly or stick.', 'fonster-dorrar', 'Service', 850, 'hourly', true, false, true, 64),

-- AKUSTIK & INREDNING (helt nya)
('akustik-panel', 'Installera akustikpaneler', 'Install Acoustic Panels', 'Montera akustikpaneler på väggar för bättre ljudmiljö. Pris per timme.', 'Install acoustic panels on walls for better sound environment. Price per hour.', 'snickeri', 'Akustik', 850, 'hourly', true, false, true, 70),
('akustik-tak', 'Installera akustiktak', 'Install Acoustic Ceiling', 'Montera undertak med akustikplattor för ljuddämpning. Pris per kvm.', 'Install suspended ceiling with acoustic tiles for sound dampening. Price per sqm.', 'snickeri', 'Akustik', 650, 'per_sqm', true, false, true, 71),
('inredning-bokhylla', 'Platsbyggd bokhylla', 'Built-in Bookshelf', 'Bygg platsbyggd bokhylla efter mått - målad eller fanerad. Pris per timme.', 'Build custom bookshelf to measure - painted or veneered. Price per hour.', 'snickeri', 'Förvaring', 850, 'hourly', true, false, true, 72),
('inredning-tvbank', 'Platsbyggd TV-bänk', 'Built-in TV Unit', 'Bygg platsbyggd TV-bänk med förvaring efter mått. Pris per timme.', 'Build custom TV unit with storage to measure. Price per hour.', 'snickeri', 'Inredning', 850, 'hourly', true, false, true, 73),
('inredning-ribs', 'Ribsvägg/panelvägg', 'Slat Wall/Panel Wall', 'Montera dekorativ ribsvägg eller panelvägg i trä. Pris per kvm.', 'Install decorative slat wall or wood panel wall. Price per sqm.', 'snickeri', 'Inredning', 750, 'per_sqm', true, false, true, 74),

-- TAKARBETEN (helt nya)
('tak-pannor', 'Byta takpannor', 'Replace Roof Tiles', 'Byta ut skadade eller gamla takpannor. Pris per kvm.', 'Replace damaged or old roof tiles. Price per sqm.', 'takarbeten', 'Takläggning', 950, 'per_sqm', true, false, true, 80),
('tak-plat', 'Måla plåttak', 'Paint Metal Roof', 'Måla om plåttak - rengöring, rostskydd och målning. Pris per kvm.', 'Repaint metal roof - cleaning, rust protection and painting. Price per sqm.', 'takarbeten', 'Målning', 450, 'per_sqm', true, false, true, 81),
('tak-rannor', 'Rensa takrännor', 'Clean Gutters', 'Rensa takrännor och stuprör från löv och skräp. Pris per timme.', 'Clean gutters and downspouts from leaves and debris. Price per hour.', 'takarbeten', 'Underhåll', 850, 'hourly', true, false, true, 82),
('tak-isolera', 'Isolera vindsbjälklag', 'Insulate Attic', 'Tilläggsisolera vindsbjälklag för bättre energieffektivitet. Pris per kvm.', 'Add attic insulation for better energy efficiency. Price per sqm.', 'takarbeten', 'Isolering', 350, 'per_sqm', true, false, true, 83)
ON CONFLICT (id) DO NOTHING;