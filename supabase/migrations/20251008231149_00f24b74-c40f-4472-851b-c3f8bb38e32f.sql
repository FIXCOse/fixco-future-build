-- Lägg till Altan och utomhusarbeten
INSERT INTO services (id, title_sv, title_en, description_sv, description_en, category, sub_category, base_price, price_type, rot_eligible, rut_eligible, is_active, sort_order) VALUES
('altan-1', 'Bygga altan/trädäck', 'Build Deck/Terrace', 'Bygga ny altan eller trädäck i trä eller komposit. Pris per kvm.', 'Build new wooden or composite deck/terrace. Price per sqm.', 'markarbeten', 'Altan', 3500, 'per_sqm', true, false, true, 10),
('altan-2', 'Renovera befintlig altan', 'Renovate Existing Deck', 'Renovering av befintlig altan - slipning, målning, bytes av skadade delar.', 'Renovation of existing deck - sanding, painting, replacement of damaged parts.', 'markarbeten', 'Altan', 1200, 'per_sqm', true, false, true, 11),
('altan-3', 'Staket & räcke till altan', 'Deck Railing & Fence', 'Montera staket och räcke runt altan för säkerhet och stil.', 'Install fence and railing around deck for safety and style.', 'markarbeten', 'Altan', 850, 'hourly', true, false, true, 12),

-- Målning
('malning-1', 'Måla innerväggar', 'Paint Interior Walls', 'Måla om innerväggar - spackling, grundning och målning. Pris per kvm vägg.', 'Repaint interior walls - spackling, priming and painting. Price per sqm wall.', 'malning', 'Innerväggar', 180, 'per_sqm', true, false, true, 20),
('malning-2', 'Måla tak', 'Paint Ceiling', 'Måla om tak - spackling, grundning och målning. Pris per kvm tak.', 'Repaint ceiling - spackling, priming and painting. Price per sqm ceiling.', 'malning', 'Tak', 200, 'per_sqm', true, false, true, 21),
('malning-3', 'Måla dörrar & karmar', 'Paint Doors & Frames', 'Måla om dörrar och karmar - slipning, grundning och målning.', 'Repaint doors and frames - sanding, priming and painting.', 'malning', 'Dörrar', 850, 'per_unit', true, false, true, 22),
('malning-4', 'Tapetsera', 'Wallpaper Installation', 'Ta bort gammal tapet och sätta upp ny tapet. Pris per kvm.', 'Remove old wallpaper and install new. Price per sqm.', 'malning', 'Tapetsering', 250, 'per_sqm', true, false, true, 23),
('malning-5', 'Måla fasad', 'Paint Exterior', 'Måla om fasad utvändigt - rengöring, grundning och målning.', 'Repaint exterior facade - cleaning, priming and painting.', 'malning', 'Fasad', 350, 'per_sqm', true, false, true, 24),

-- Golv
('golv-1', 'Lägga laminat/vinylgolv', 'Install Laminate/Vinyl Flooring', 'Lägga laminat eller vinylgolv inklusive underlag. Pris per kvm.', 'Install laminate or vinyl flooring including underlay. Price per sqm.', 'golv', 'Laminat/Vinyl', 450, 'per_sqm', true, false, true, 30),
('golv-2', 'Lägga parkettgolv', 'Install Parquet Flooring', 'Lägga massiv eller flerskiktsparkett. Pris per kvm.', 'Install solid or engineered parquet flooring. Price per sqm.', 'golv', 'Parkett', 650, 'per_sqm', true, false, true, 31),
('golv-3', 'Slipa och lacka parkett', 'Sand & Lacquer Parquet', 'Slipa och lacka befintligt parkettgolv. Pris per kvm.', 'Sand and lacquer existing parquet flooring. Price per sqm.', 'golv', 'Parkett', 380, 'per_sqm', true, false, true, 32),
('golv-4', 'Lägga klinkergolv', 'Install Tile Flooring', 'Lägga klinkerplattor på golv i kök, hall eller badrum.', 'Install ceramic tile flooring in kitchen, hallway or bathroom.', 'golv', 'Klinker', 550, 'per_sqm', true, false, true, 33),
('golv-5', 'Lägga mattgolv/heltäckande', 'Install Carpet', 'Lägga heltäckningsmatta eller mattgolv. Pris per kvm.', 'Install wall-to-wall carpet or carpet flooring. Price per sqm.', 'golv', 'Matta', 320, 'per_sqm', true, false, true, 34),

-- Badrum
('badrum-1', 'Totalrenovering badrum', 'Complete Bathroom Renovation', 'Helrenovering av badrum - kakel, golv, rör, elinstallationer, montering.', 'Complete bathroom renovation - tiles, flooring, plumbing, electrical, installation.', 'badrum', 'Totalrenovering', 5500, 'per_sqm', true, false, true, 40),
('badrum-2', 'Kakla badrum', 'Tile Bathroom', 'Lägga kakel på väggar och golv i badrum. Pris per kvm.', 'Install tiles on bathroom walls and floors. Price per sqm.', 'badrum', 'Kakel', 850, 'per_sqm', true, false, true, 41),
('badrum-3', 'Byta badkar/duschkabin', 'Replace Bathtub/Shower', 'Demontera och byta ut befintligt badkar eller duschkabin.', 'Remove and replace existing bathtub or shower cabin.', 'badrum', 'Sanitetsarbeten', 12500, 'fixed', true, false, true, 42),
('badrum-4', 'Byta toalett/handfat', 'Replace Toilet/Sink', 'Byta ut toalett och/eller handfat inklusive anslutningar.', 'Replace toilet and/or sink including connections.', 'badrum', 'Sanitetsarbeten', 6500, 'fixed', true, false, true, 43),

-- Kök
('kok-1', 'Montera IKEA-kök', 'Install IKEA Kitchen', 'Montera komplett IKEA-kök inklusive stommar, luckor, bänkskiva och vitvaror.', 'Install complete IKEA kitchen including cabinets, doors, countertop and appliances.', 'kok', 'Montering', 45000, 'fixed', true, false, true, 50),
('kok-2', 'Lägga kakel köksvägg', 'Install Kitchen Backsplash', 'Lägga kakel/klinker på köksvägg bakom spis och diskbänk.', 'Install tiles on kitchen wall behind stove and sink.', 'kok', 'Kakel', 850, 'per_sqm', true, false, true, 51),
('kok-3', 'Byta köksluckor', 'Replace Kitchen Doors', 'Byta ut endast luckor och fronter på befintligt kök.', 'Replace only doors and fronts on existing kitchen.', 'kok', 'Renovering', 850, 'hourly', true, false, true, 52),
('kok-4', 'Installera bänkskiva', 'Install Countertop', 'Installera ny bänkskiva i kök - laminat, kompakt eller sten.', 'Install new kitchen countertop - laminate, compact or stone.', 'kok', 'Bänkskiva', 850, 'hourly', true, false, true, 53),

-- Fönster & Dörrar
('fonster-1', 'Byta fönster', 'Replace Windows', 'Byta ut befintliga fönster mot nya energieffektiva fönster.', 'Replace existing windows with new energy-efficient windows.', 'fonster-dorrar', 'Fönster', 8500, 'per_unit', true, false, true, 60),
('fonster-2', 'Måla fönster', 'Paint Windows', 'Måla om träfönster - slipning, grundning och målning.', 'Repaint wooden windows - sanding, priming and painting.', 'fonster-dorrar', 'Fönster', 2500, 'per_unit', true, false, true, 61),
('fonster-3', 'Byta innerdörr', 'Replace Interior Door', 'Byta ut innerdörr inklusive karm och beslag.', 'Replace interior door including frame and hardware.', 'fonster-dorrar', 'Dörrar', 6500, 'per_unit', true, false, true, 62),
('fonster-4', 'Byta ytterdörr', 'Replace Exterior Door', 'Byta ut ytterdörr inklusive karm och säkerhetslås.', 'Replace exterior door including frame and security lock.', 'fonster-dorrar', 'Dörrar', 15000, 'per_unit', true, false, true, 63),
('fonster-5', 'Justera dörrar/fönster', 'Adjust Doors/Windows', 'Justera dörrar och fönster som inte stänger tätt eller kärvar.', 'Adjust doors and windows that don''t close properly or stick.', 'fonster-dorrar', 'Service', 850, 'hourly', true, false, true, 64),

-- Akustik & Inredning
('akustik-1', 'Installera akustikpaneler', 'Install Acoustic Panels', 'Montera akustikpaneler på väggar för bättre ljudmiljö.', 'Install acoustic panels on walls for better sound environment.', 'snickeri', 'Akustik', 850, 'hourly', true, false, true, 70),
('akustik-2', 'Installera akustiktak', 'Install Acoustic Ceiling', 'Montera undertak med akustikplattor för ljuddämpning.', 'Install suspended ceiling with acoustic tiles for sound dampening.', 'snickeri', 'Akustik', 650, 'per_sqm', true, false, true, 71),
('inredning-1', 'Platsbyggd bokhylla', 'Built-in Bookshelf', 'Bygg platsbyggd bokhylla efter mått - målad eller fanerad.', 'Build custom bookshelf to measure - painted or veneered.', 'snickeri', 'Förvaring', 850, 'hourly', true, false, true, 72),
('inredning-2', 'Platsbyggd TV-bänk', 'Built-in TV Unit', 'Bygg platsbyggd TV-bänk med förvaring efter mått.', 'Build custom TV unit with storage to measure.', 'snickeri', 'Inredning', 850, 'hourly', true, false, true, 73),
('inredning-3', 'Ribsvägg/panelvägg', 'Slat Wall/Panel Wall', 'Montera dekorativ ribsvägg eller panelvägg i trä.', 'Install decorative slat wall or wood panel wall.', 'snickeri', 'Inredning', 750, 'per_sqm', true, false, true, 74),

-- Takarbeten
('tak-1', 'Byta takpannor', 'Replace Roof Tiles', 'Byta ut skadade eller gamla takpannor. Pris per kvm.', 'Replace damaged or old roof tiles. Price per sqm.', 'takarbeten', 'Takläggning', 950, 'per_sqm', true, false, true, 80),
('tak-2', 'Måla plåttak', 'Paint Metal Roof', 'Måla om plåttak - rengöring, rostskydd och målning.', 'Repaint metal roof - cleaning, rust protection and painting.', 'takarbeten', 'Målning', 450, 'per_sqm', true, false, true, 81),
('tak-3', 'Rensa takrännor', 'Clean Gutters', 'Rensa takrännor och stuprör från löv och skräp.', 'Clean gutters and downspouts from leaves and debris.', 'takarbeten', 'Underhåll', 850, 'hourly', true, false, true, 82),
('tak-4', 'Isolera vindsbjälklag', 'Insulate Attic', 'Tilläggsisolera vindsbjälklag för bättre energieffektivitet.', 'Add attic insulation for better energy efficiency.', 'takarbeten', 'Isolering', 350, 'per_sqm', true, false, true, 83),

-- VVS (hoppar över vvs-1 som redan finns)
('vvs-2', 'Byta badrumsblandare', 'Replace Bathroom Faucet', 'Byta ut handfatsblandare eller duschblandare.', 'Replace sink faucet or shower mixer.', 'vvs', 'Kranar', 2500, 'fixed', true, false, true, 91),
('vvs-3', 'Åtgärda vattenläcka', 'Fix Water Leak', 'Laga vattenläcka i rör, kranar eller anslutningar.', 'Fix water leak in pipes, faucets or connections.', 'vvs', 'Akut', 1200, 'hourly', true, false, true, 92),
('vvs-4', 'Installera diskmaskin', 'Install Dishwasher', 'Installera ny diskmaskin inklusive vatten- och avloppsanslutning.', 'Install new dishwasher including water and drain connections.', 'vvs', 'Installation', 3500, 'fixed', true, false, true, 93),

-- Städning (RUT-berättigade)
('stad-1', 'Balkongstädning', 'Balcony Cleaning', 'Grundlig städning av balkong eller uteplats.', 'Thorough cleaning of balcony or patio.', 'stadning', 'Utomhus', 450, 'hourly', false, true, true, 100),
('stad-2', 'Fönsterputs invändigt', 'Interior Window Cleaning', 'Putsa fönster invändigt - inkl karmar och fönsterbleck.', 'Clean windows interior - including frames and sills.', 'stadning', 'Fönster', 450, 'hourly', false, true, true, 101),

-- Trädgård (hoppar över tradgard-1 som redan finns)
('tradgard-2', 'Häckklippning', 'Hedge Trimming', 'Klippa och forma häckar, pris per timme.', 'Trim and shape hedges, price per hour.', 'tradgard', 'Beskärning', 450, 'hourly', false, true, true, 111),
('tradgard-3', 'Ogräsrensning', 'Weed Removal', 'Rensa ogräs i rabatter och gångar.', 'Remove weeds from flower beds and paths.', 'tradgard', 'Rensning', 450, 'hourly', false, true, true, 112),
('tradgard-4', 'Plantera blommor/buskar', 'Plant Flowers/Shrubs', 'Plantera blommor, buskar och perenner.', 'Plant flowers, shrubs and perennials.', 'tradgard', 'Plantering', 450, 'hourly', false, true, true, 113),

-- Info-kort för kategorier
('info-malning', '📢 Målning - ROT 30%', 'Painting Services', 'Vi utför all typ av målningsarbeten både inomhus och utomhus. ROT-avdrag på 30% gäller.', 'We perform all types of painting work both indoors and outdoors. ROT deduction of 30% applies.', 'malning', 'Info', 0, 'hourly', true, false, true, 0),
('info-golv', '📢 Golvläggning - ROT 30%', 'Flooring Services', 'Vi lägger alla typer av golv - laminat, parkett, klinker och vinyl. ROT-avdrag på 30% gäller.', 'We install all types of flooring - laminate, parquet, tiles and vinyl. ROT deduction of 30% applies.', 'golv', 'Info', 0, 'hourly', true, false, true, 0),
('info-badrum', '📢 Badrumsrenovering - ROT 30%', 'Bathroom Renovation', 'Helrenovering eller delrenovering av badrum. ROT-avdrag på 30% gäller arbetskostnad.', 'Complete or partial bathroom renovation. ROT deduction of 30% applies to labor costs.', 'badrum', 'Info', 0, 'hourly', true, false, true, 0),
('info-kok', '📢 Köksrenovering - ROT 30%', 'Kitchen Renovation', 'Montering och renovering av kök. ROT-avdrag på 30% gäller arbetskostnad.', 'Installation and renovation of kitchens. ROT deduction of 30% applies to labor costs.', 'kok', 'Info', 0, 'hourly', true, false, true, 0),
('info-fonster', '📢 Fönster & Dörrar - ROT 30%', 'Windows & Doors', 'Byte och renovering av fönster och dörrar. ROT-avdrag på 30% gäller.', 'Replacement and renovation of windows and doors. ROT deduction of 30% applies.', 'fonster-dorrar', 'Info', 0, 'hourly', true, false, true, 0),
('info-tak', '📢 Takarbeten - ROT 30%', 'Roofing Work', 'Takläggning, reparationer och underhåll av tak. ROT-avdrag på 30% gäller.', 'Roofing, repairs and maintenance. ROT deduction of 30% applies.', 'takarbeten', 'Info', 0, 'hourly', true, false, true, 0),
('info-vvs', '📢 VVS-arbeten - ROT 30%', 'Plumbing Services', 'Installation och reparation av VVS. ROT-avdrag på 30% gäller arbetskostnad.', 'Installation and repair of plumbing. ROT deduction of 30% applies to labor costs.', 'vvs', 'Info', 0, 'hourly', true, false, true, 0),
('info-tradgard', '📢 Trädgård - RUT 50%', 'Garden Services', 'Trädgårdsarbete med RUT-avdrag på 50%. Max 75 000 kr/person/år.', 'Garden work with RUT deduction of 50%. Max 75,000 SEK/person/year.', 'tradgard', 'Info', 0, 'hourly', false, true, true, 0)
ON CONFLICT (id) DO NOTHING;