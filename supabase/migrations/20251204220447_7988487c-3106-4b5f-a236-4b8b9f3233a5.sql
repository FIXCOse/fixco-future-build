-- Fix incorrect search_keywords assignment

-- 1. Set correct keywords for "Lister & finish" (snickeri-5)
UPDATE services 
SET search_keywords = 'lister, list, golvlist, golvlister, taklist, taklister, dörrfoder, foder, finish, karm, karmar, smygbräda'
WHERE id = 'snickeri-5';

-- 2. Set correct keywords for "Tavlor och speglar" (montering-3)
UPDATE services 
SET search_keywords = 'tavla, tavlor, spegel, speglar, väggprydnad, upphängning, konst, ramar, ram, dekoration, poster, affisch'
WHERE id = 'montering-3';