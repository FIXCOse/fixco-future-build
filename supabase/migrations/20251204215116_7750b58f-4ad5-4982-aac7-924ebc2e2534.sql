-- Lägg till search_keywords-kolumn för intelligent sökning
ALTER TABLE services ADD COLUMN IF NOT EXISTS search_keywords text;

-- Populera keywords för befintliga tjänster
UPDATE services SET search_keywords = 'tavla, tavlor, spegel, speglar, väggprydnad, upphängning, konst, ramar, ram, dekoration' WHERE id = 'snickeri-5';
UPDATE services SET search_keywords = 'hylla, hyllor, förvaring, väggmonterad, bokhylla, hyllplan, montera' WHERE id = 'snickeri-4';
UPDATE services SET search_keywords = 'lampa, lampor, belysning, ljus, taklampa, pendel, armatur' WHERE title_sv ILIKE '%armatur%' OR title_sv ILIKE '%lampa%';
UPDATE services SET search_keywords = 'måla, målare, målning, färg, färga, vägg, väggar, tak, rum, roller, pensel' WHERE category = 'malare';
UPDATE services SET search_keywords = 'spegel, speglar, spegelskåp, badrum, badrumsskåp, väggskåp' WHERE id = 'vvs-montera-spegelskap';
UPDATE services SET search_keywords = 'persienn, persienner, gardin, gardiner, rullgardin, fönster, solskydd, mörkläggning' WHERE title_sv ILIKE '%persienn%' OR title_sv ILIKE '%gardin%';
UPDATE services SET search_keywords = 'tv, television, väggfäste, väggmontering, skärm, fäste' WHERE title_sv ILIKE '%tv%' OR title_sv ILIKE '%väggfäste%';
UPDATE services SET search_keywords = 'kran, kranar, blandare, vatten, diskbänk, kök, badrum' WHERE title_sv ILIKE '%kran%' OR title_sv ILIKE '%blandare%';
UPDATE services SET search_keywords = 'wc, toalett, toaletter, toa, dass, sanitet' WHERE title_sv ILIKE '%wc%' OR title_sv ILIKE '%toalett%';
UPDATE services SET search_keywords = 'dusch, duschar, duschkabin, duschhörna, badkar, bad' WHERE title_sv ILIKE '%dusch%' OR title_sv ILIKE '%badkar%';
UPDATE services SET search_keywords = 'golv, golvläggning, parkett, laminat, vinyl, trägolv, golvslipning' WHERE title_sv ILIKE '%golv%' OR title_sv ILIKE '%parkett%';
UPDATE services SET search_keywords = 'dörr, dörrar, innerdörr, ytterdörr, dörrhandtag, lås' WHERE title_sv ILIKE '%dörr%';
UPDATE services SET search_keywords = 'fönster, fönsterbyte, glas, ruta, rutor, fönsterputsning' WHERE title_sv ILIKE '%fönster%';
UPDATE services SET search_keywords = 'el, elektriker, eluttag, uttag, strömbrytare, elarbete, elinstallation' WHERE category = 'el';
UPDATE services SET search_keywords = 'städ, städning, städa, hemstäd, storstäd, flyttstäd, rengöring, rent' WHERE category = 'stad';
UPDATE services SET search_keywords = 'flytt, flytthjälp, flytta, transport, bära, lastning' WHERE category = 'flytt';
UPDATE services SET search_keywords = 'trädgård, gräs, gräsklippning, häck, buskar, plantering, ogräs, rabatt' WHERE category = 'tradgard';