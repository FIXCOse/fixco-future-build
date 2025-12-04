-- Complete fix for all search_keywords - unique keywords per service

-- EL-TJÄNSTER
UPDATE services SET search_keywords = 'eluttag, uttag, vägguttag, strömuttag, kontakt, stickkontakt' WHERE id = 'el-1';
UPDATE services SET search_keywords = 'strömbrytare, brytare, dimmer, ljusbrytare, vippbrytare, omkopplare' WHERE id = 'el-2';
UPDATE services SET search_keywords = 'lampa, lampor, taklampa, taklampor, pendel, pendlar, armatur, belysning, ljus, takbelysning, takarmatur' WHERE id = 'el-3';
UPDATE services SET search_keywords = 'spotlight, spotlights, spot, spotar, downlight, downlights, infälld belysning, takspottar, led spot' WHERE id = 'el-4';
UPDATE services SET search_keywords = 'utebelysning, utomhusbelysning, trädgårdsbelysning, fasadbelysning, pollare, markbelysning, utomhuslampa' WHERE id = 'el-5';
UPDATE services SET search_keywords = 'jordfelsbrytare, jordfels, säkring, elsäkerhet, skydd, elcentral' WHERE id = 'el-6';
UPDATE services SET search_keywords = 'felsökning, elfel, strömavbrott, elproblem, elektriker, elservice, kortslutning' WHERE id = 'el-7';
UPDATE services SET search_keywords = 'elpunkt, eldragning, kabel, ledning, ny punkt, kabeldragning, elinstallation' WHERE id = 'el-8';
UPDATE services SET search_keywords = 'tv-fäste, väggfäste, tv montering, kabelkanal, kabeldold, tv vägg' WHERE id = 'el-9';
UPDATE services SET search_keywords = 'köksö, kök el, köksuttag, matlagning, köksel, arbetsbelysning kök' WHERE id = 'el-10';
UPDATE services SET search_keywords = 'elgrupp, säkringsgrupp, elcentral, ny grupp, säkring, gruppcentral' WHERE id = 'el-11';

-- VVS-TJÄNSTER
UPDATE services SET search_keywords = 'kran, kranar, blandare, vattenkran, köks­kran, diskbänksblandare, engreppsblandare' WHERE id = 'vvs-1';
UPDATE services SET search_keywords = 'diskmaskin, diskmaskinskoppling, koppling, vatten, avlopp, vitvaror' WHERE id = 'vvs-2';
UPDATE services SET search_keywords = 'tvättmaskin, tvättmaskinkoppling, koppling, tvätt, tvättstuga, vitvaror' WHERE id = 'vvs-3';
UPDATE services SET search_keywords = 'toalett, toa, wc, toalettstol, vägghängd, golvstående, spolknapp' WHERE id = 'vvs-4';
UPDATE services SET search_keywords = 'handfat, tvättställ, kommod, badrum, badrumsmöbel, underskåp' WHERE id = 'vvs-5';
UPDATE services SET search_keywords = 'dusch, duschhörna, duschkabin, duschvägg, duschdörr, badrum' WHERE id = 'vvs-6';
UPDATE services SET search_keywords = 'badkar, bad, karbad, badkarsblandare, badrum, avkoppling' WHERE id = 'vvs-7';
UPDATE services SET search_keywords = 'vattenburen, golvvärme, värmeslingor, termostat, uppvärmning' WHERE id = 'vvs-8';
UPDATE services SET search_keywords = 'radiator, element, värmeelement, värme, uppvärmning, termostat' WHERE id = 'vvs-9';
UPDATE services SET search_keywords = 'avlopp, stopp, propplösning, avloppsstopp, rensning, vattenlås' WHERE id = 'vvs-10';
UPDATE services SET search_keywords = 'varmvattenberedare, vvb, varmvatten, beredare, installation' WHERE id = 'vvs-11';
UPDATE services SET search_keywords = 'spegelskåp, badrumsskåp, spegelvägg, badrum, förvaring, belysning' WHERE id = 'vvs-spegelskap';

-- SNICKERI-TJÄNSTER
UPDATE services SET search_keywords = 'dörr, innerdörr, dörrbyte, dörrmontering, rumsdörr, passage' WHERE id = 'snickeri-1';
UPDATE services SET search_keywords = 'fönster, fönsterbyte, fönstermontering, glas, isolering, energi' WHERE id = 'snickeri-2';
UPDATE services SET search_keywords = 'kök, köksluckor, köksskåp, köksrenovering, bänkskiva, köksmontering' WHERE id = 'snickeri-3';
UPDATE services SET search_keywords = 'garderob, garderobsinredning, förvaring, skjutdörrar, walk-in, klädförvaring' WHERE id = 'snickeri-4';
UPDATE services SET search_keywords = 'lister, list, golvlist, golvlister, taklist, taklister, dörrfoder, foder, finish, karm' WHERE id = 'snickeri-5';
UPDATE services SET search_keywords = 'trappa, trappräcke, räcke, ledstång, trappsteg, trapprenovering' WHERE id = 'snickeri-6';
UPDATE services SET search_keywords = 'altan, altanbygge, trädäck, uteplats, däck, utemiljö, altanräcke' WHERE id = 'snickeri-7';
UPDATE services SET search_keywords = 'staket, staketsättning, spaljé, plank, inhägnad, grind, trädgård' WHERE id = 'snickeri-8';
UPDATE services SET search_keywords = 'bänkskiva, köksö, arbetsyta, kök, montering' WHERE id = 'snickeri-bankskiva';

-- MONTERING-TJÄNSTER  
UPDATE services SET search_keywords = 'möbler, möbelmontering, ikea, flatpack, ihopsättning, skåp, byrå' WHERE id = 'montering-1';
UPDATE services SET search_keywords = 'hylla, hyllor, bokhylla, vägghylla, förvaring, montering' WHERE id = 'montering-2';
UPDATE services SET search_keywords = 'tavla, tavlor, spegel, speglar, väggprydnad, upphängning, konst, ramar' WHERE id = 'montering-3';
UPDATE services SET search_keywords = 'vitvaror, vitvara, kyl, kylskåp, frys, frysskåp, ugn, spis, diskmaskin, tvättmaskin, torktumlare' WHERE id = 'montering-4';
UPDATE services SET search_keywords = 'markis, markismontering, solskydd, uterum, balkong, terass' WHERE id = 'montering-5';
UPDATE services SET search_keywords = 'persienner, rullgardiner, gardiner, solskydd, fönsterskydd, mörkläggning' WHERE id = 'montering-6';

-- DÖRR-TJÄNSTER
UPDATE services SET search_keywords = 'dörr justering, kärvar, kikar, gångjärn, låskolv, dörrproblem, justering' WHERE id = 'dorr-justera';
UPDATE services SET search_keywords = 'lås, låsbyte, cylinder, säkerhet, inbrottsskydd, nycklar' WHERE id = 'dorr-las';
UPDATE services SET search_keywords = 'brevinkast, postlucka, dörrtillbehör, brevlåda' WHERE id = 'dorr-brevinkast';
UPDATE services SET search_keywords = 'dörrhandtag, handtag, trycke, dörrknopp, byte' WHERE id = 'dorr-handtag';
UPDATE services SET search_keywords = 'dörrstopp, dörrspärr, gummistopp, väggskydd' WHERE id = 'dorr-dorrstopp';

-- FÖNSTER-TJÄNSTER
UPDATE services SET search_keywords = 'fönsterfilm, solfilm, insynsskydd, värmereducering, uv-skydd' WHERE id = 'fonster-film';
UPDATE services SET search_keywords = 'fönsterbåge, glaslister, fönsterrenovering, tätning' WHERE id = 'fonster-bage';

-- BADRUM-TJÄNSTER
UPDATE services SET search_keywords = 'kommod, toalettmöbel, wc, blandare, tvättställ, badrumsmöbel, handfatsskåp' WHERE id = 'badrum-toalett';
UPDATE services SET search_keywords = 'handdukstork, handduksvärmare, värme, badrum, uppvärmning' WHERE id = 'badrum-handdukstork';
UPDATE services SET search_keywords = 'badrumsskåp, spegelskåp, förvaring, badrum, spegel, belysning' WHERE id = 'badrum-skap';
UPDATE services SET search_keywords = 'badrumstillbehör, krok, hållare, toalettpappershållare, badrum' WHERE id = 'badrum-tillbehor';

-- KÖK-TJÄNSTER
UPDATE services SET search_keywords = 'köksfläkt, fläkt, ventilation, spiskåpa, imkanal, köksventilation' WHERE id = 'kok-flakt';
UPDATE services SET search_keywords = 'köksarmatur, lampa kök, arbetsbelysning, underskåpsbelysning, led, belysning kök' WHERE id = 'kok-armatur';

-- GOLV-TJÄNSTER
UPDATE services SET search_keywords = 'golvsockel, sockel, golvlist, kantlist, avslutning' WHERE id = 'golv-sockel';

-- MARKARBETEN
UPDATE services SET search_keywords = 'altan tvätt, trädäck, högtryckstvätt, rengöring, altanrengöring, träskydd' WHERE id = 'markarbeten-tvatta-altan';
UPDATE services SET search_keywords = 'utekök, utomhuskök, grillplats, matlagning utomhus' WHERE id = 'markarbeten-utomhuskok';
UPDATE services SET search_keywords = 'sandlåda, lekplats, trädgård, barn, utomhus' WHERE id = 'markarbeten-sandlada';
UPDATE services SET search_keywords = 'bänk, trädgårdsbänk, sittplats, utomhus, park' WHERE id = 'markarbeten-bank';
UPDATE services SET search_keywords = 'kompost, kompostlåda, trädgård, odling, återvinning' WHERE id = 'markarbeten-kompost';

-- TAKARBETEN
UPDATE services SET search_keywords = 'takfönster, fönster tak, ljusinsläpp, velux' WHERE id = 'tak-takfonster';
UPDATE services SET search_keywords = 'vindslucka, vind, åtkomst, lucka, tak' WHERE id = 'tak-vindslucka';