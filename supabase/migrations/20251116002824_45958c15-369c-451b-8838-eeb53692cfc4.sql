-- Add all 25 Snickeri service add-ons with CORRECT price_unit values
-- Only 'kr', 'kr/h', or 'kr/st' are allowed

-- 1. AKUSTIK-TAK (3 add-ons)
INSERT INTO service_addons (service_id, title_sv, description_sv, addon_price, price_unit, icon, is_active, sort_order, rot_eligible, rut_eligible) VALUES
('akustik-tak', 'Byggstäd efter installation', 'Professionell efterstädning efter montering av akustiktak', 1200, 'kr', 'sparkles', true, 2, true, false),
('akustik-tak', 'Bortforsling av rivningsmaterial', 'Transport och återvinning av allt rivningsmaterial', 800, 'kr', 'truck', true, 3, false, false),
('akustik-tak', 'LED-belysning i akustiktak', 'Installation av energieffektiv LED-belysning i akustiktak', 3500, 'kr', 'lightbulb', true, 4, true, false);

-- 2. AKUSTIK-PANEL (2 add-ons)
INSERT INTO service_addons (service_id, title_sv, description_sv, addon_price, price_unit, icon, is_active, sort_order, rot_eligible, rut_eligible) VALUES
('akustik-panel', 'Byggstäd efter installation', 'Professionell efterstädning efter montering av akustikpaneler', 800, 'kr', 'sparkles', true, 2, true, false),
('akustik-panel', 'Bortforsling av förpackningar', 'Bortforsling och återvinning av förpackningsmaterial', 300, 'kr', 'truck', true, 3, false, false);

-- 3. INREDNING-BOKHYLLA (4 add-ons)
INSERT INTO service_addons (service_id, title_sv, description_sv, addon_price, price_unit, icon, is_active, sort_order, rot_eligible, rut_eligible) VALUES
('inredning-bokhylla', 'Bortforsling av gammal bokhylla', 'Demontering och bortforsling av befintlig bokhylla', 600, 'kr/st', 'truck', true, 2, false, false),
('inredning-bokhylla', 'Byggstäd efter byggnation', 'Professionell efterstädning efter montering', 500, 'kr/st', 'sparkles', true, 3, true, false),
('inredning-bokhylla', 'LED-belysning i hyllor', 'Installation av LED-strips för belysning i bokhylla', 1800, 'kr/st', 'lightbulb', true, 4, true, false),
('inredning-bokhylla', 'Lackering/betsning', 'Professionell lackering eller betsning av bokhylla', 1500, 'kr/st', 'paintbrush', true, 5, true, false);

-- 4. INREDNING-TVBANK (4 add-ons)
INSERT INTO service_addons (service_id, title_sv, description_sv, addon_price, price_unit, icon, is_active, sort_order, rot_eligible, rut_eligible) VALUES
('inredning-tvbank', 'Bortforsling av gammal TV-bänk', 'Demontering och bortforsling av befintlig TV-bänk', 500, 'kr/st', 'truck', true, 2, false, false),
('inredning-tvbank', 'Byggstäd efter byggnation', 'Professionell efterstädning efter montering', 400, 'kr/st', 'sparkles', true, 3, true, false),
('inredning-tvbank', 'Kabeldragning för TV/media', 'Installation av kabelkanaler och kabeldragning för TV och mediautrustning', 1200, 'kr/st', 'cable', true, 4, true, false),
('inredning-tvbank', 'Lackering/betsning', 'Professionell lackering eller betsning av TV-bänk', 1200, 'kr/st', 'paintbrush', true, 5, true, false);

-- 5. INREDNING-RIBS (3 add-ons)
INSERT INTO service_addons (service_id, title_sv, description_sv, addon_price, price_unit, icon, is_active, sort_order, rot_eligible, rut_eligible) VALUES
('inredning-ribs', 'Byggstäd efter montering', 'Professionell efterstädning efter montering av ribbor', 800, 'kr', 'sparkles', true, 2, true, false),
('inredning-ribs', 'Bortforsling av förpackningar', 'Bortforsling och återvinning av förpackningsmaterial', 400, 'kr', 'truck', true, 3, false, false),
('inredning-ribs', 'LED-belysning bakom panel', 'Installation av LED-belysning bakom ribbpanel för dramatisk effekt', 2500, 'kr', 'lightbulb', true, 4, true, false);

-- 6. SNICKERI-3 (Inredning & hyllor) (2 add-ons)
INSERT INTO service_addons (service_id, title_sv, description_sv, addon_price, price_unit, icon, is_active, sort_order, rot_eligible, rut_eligible) VALUES
('snickeri-3', 'Bortforsling av gamla hyllor', 'Demontering och bortforsling av befintliga hyllor', 400, 'kr/st', 'truck', true, 2, false, false),
('snickeri-3', 'Byggstäd efter montering', 'Professionell efterstädning efter montering av hyllor', 300, 'kr/st', 'sparkles', true, 3, true, false);

-- 7. SNICKERI-4 (Dörrmontage) (3 add-ons)
INSERT INTO service_addons (service_id, title_sv, description_sv, addon_price, price_unit, icon, is_active, sort_order, rot_eligible, rut_eligible) VALUES
('snickeri-4', 'Bortforsling av gammal dörr', 'Demontering och bortforsling av befintlig dörr', 400, 'kr/st', 'truck', true, 2, false, false),
('snickeri-4', 'Byggstäd efter montering', 'Professionell efterstädning efter dörrmontage', 300, 'kr/st', 'sparkles', true, 3, true, false),
('snickeri-4', 'Soft-close för dörr', 'Installation av soft-close-system för tyst och mjuk dörrängning', 600, 'kr/st', 'volume-x', true, 4, true, false);

-- 8. SNICKERI-5 (Lister & finish) (2 add-ons)
INSERT INTO service_addons (service_id, title_sv, description_sv, addon_price, price_unit, icon, is_active, sort_order, rot_eligible, rut_eligible) VALUES
('snickeri-5', 'Byggstäd efter montering', 'Professionell efterstädning efter montering av lister', 400, 'kr', 'sparkles', true, 2, true, false),
('snickeri-5', 'Målning av lister', 'Professionell målning av lister i valfri färg', 800, 'kr', 'paintbrush', true, 3, true, false);