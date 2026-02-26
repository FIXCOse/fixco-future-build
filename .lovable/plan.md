

## Fix: Uppdatera alla ROT/RUT-procenttal fran 50% till 30%

### Problem
ROT/RUT-avdraget andrades fran 50% till 30% den 1 januari 2026. Berakningslogiken (`priceCalculation.ts`, `ROTCalculator.tsx`) ar redan uppdaterad till 30%, men hardkodad text, SEO-titlar, meta-beskrivningar, FAQ-svar och AI-filer visar fortfarande "50%" overallt pa sajten.

Bilden visar tydligt: "50%" star kvar i den stora visuella displayen, i brödtexten ("50% av arbetskostnaden"), i exemplet ("ROT-avdrag (50%): -15 000 kr") och i CTA-texten.

### Omfattning
Totalt **~20 filer** behover uppdateras. Alla forandringar ar text/copy -- ingen berakningslogik andras (den ar redan korrekt pa 30%).

---

### Filer att andra

#### Kundsynliga sidor och komponenter

| Fil | Andring |
|-----|---------|
| `src/pages/LocalServicePage.tsx` | Rad 582: `50%` -> `30%` i stor visuell display. Rad 812: `50%` -> `30%` i CTA-text |
| `src/data/localServiceData.ts` | Alla 50%-referenser i titlar (rad 552-561), meta-beskrivningar (rad 566-575), intro-text (rad 590), CTA-text (rad 615), ROT-sektion (rad 627-640), FAQ-svar (rad 646-660), quickFacts (rad 681). Fallback-varden (rad 581, 583). Totalt ~30+ forekomster |
| `src/data/serviceCityData.ts` | Alla titlar, beskrivningar och quickFacts for alla stader (Uppsala, Stockholm etc.) -- typ 20+ forekomster av "ROT 50%", "50% rabatt" etc. |
| `src/data/serviceCityContent.ts` | Rad 122, 211: "du sparar 50% på arbetskostnaden" -> "30%" |
| `src/components/GlobalStickyCTA.tsx` | Rad 137: "ROT-avdrag 50%" -> "ROT-avdrag 30%" |
| `src/components/MicroFAQ.tsx` | Rad 45: "50% avdrag" -> "30% avdrag" |
| `src/components/InteractiveToggle.tsx` | Rad 74: "50% rabatt" -> "30% rabatt" |
| `src/components/PricingToggle.tsx` | Rad 15-16: "50% avdrag" -> "30% avdrag" for bade ROT och RUT |
| `src/components/FAQTeaser.tsx` | Rad 19: "50% ROT deduction" -> "30%" |
| `src/components/ComparisonUltra.tsx` | Rad 307: "50% ROT-besparing" -> "30%" |
| `src/components/EnhancedServiceCard.tsx` | Rad 47: `laborCost * 0.5` -> `laborCost * 0.3` (berakningsfel) |
| `src/pages/Home.tsx` | Rad 85, 97, 131, 180: Alla "50%" -> "30%" i FAQ och meta-beskrivning. Rad 97 har ocksa felaktigt maxtak "75 000 kr" for ROT (ska vara 50 000 kr) |
| `src/pages/locations/LocationCityPage.tsx` | Rad 166: Titel "ROT 50%" -> "ROT 30%". Rad 235: Badge "ROT/RUT 50%" -> "ROT/RUT 30%" |
| `src/pages/locations/ServiceCityPage.tsx` | Rad 98: "ROT/RUT 50%" -> "ROT/RUT 30%" |
| `src/pages/locations/ServiceCityDetail.tsx` | Rad 627: "50% på arbetskostnaden" -> "30%" |

#### Copy-filer (svenska och engelska)

| Fil | Andring |
|-----|---------|
| `src/copy/sv.ts` | ~25 forekomster av "50%" -> "30%" (ROT-sidan, RUT-sidan, hero, comparison, serviceDetail). Texten "hälften" -> "70%" eller "bara 70% av arbetskostnaden" |
| `src/copy/en.ts` | ~25 forekomster, samma andringar pa engelska. "half" -> "70%" |

#### Admin-verktyg

| Fil | Andring |
|-----|---------|
| `src/components/admin/QuoteFormModal.tsx` | Rad 71: `setRotRate(50)` -> `setRotRate(30)`. Rad 73: `setRutRate(50)` -> `setRutRate(30)`. Alla kommentarer och defaults (rad 69, 158, 173, 198, 200, 305) |

#### Publika AI/SEO-filer

| Fil | Andring |
|-----|---------|
| `public/knowledge-base.json` | Alla "50%" -> "30%" i ROT/RUT-beskrivningar, priser efter avdrag, FAQ-svar, USP:er |
| `public/context.json` | "50%" -> "30%" i USP:er och FAQ |
| `public/llms-ctx.txt` | Alla "50%" -> "30%" i ROT/RUT-sektioner, priser, FAQ |
| `public/llms-full.txt` | Alla "50%" -> "30%" |
| `public/humans.txt` | Rad 66: "50% off" -> "30% off" |
| `public/services.csv` | Kolumnen `tax_deduction_percent`: alla "50" -> "30" |

#### Edge Functions

| Fil | Andring |
|-----|---------|
| `supabase/functions/ai-info/index.ts` | Rad 100, 106: `"50%"` -> `"30%"` |
| `supabase/functions/ai-smart-analysis/index.ts` | Rad 340: "50%" -> "30%" |
| `supabase/functions/generate-quote-pdf/index.ts` | Rad 185: "50%" -> "30%" |

#### Specialfall: cityServiceTemplates.ts
Rad 12 har redan delvis korrekt logik (`rot ? '30%'`) men RUT-fallet sager fortfarande `'50%'`. Andras till `'30%'` for alla.

### Vad som INTE andras
- `priceCalculation.ts` -- redan korrekt (30%)
- `ROTCalculator.tsx` -- redan korrekt (30%)
- `useGlobalROT.ts` -- ingen procentsats hardkodad
- Max-beloppet 50 000 kr per person -- det ar fortfarande korrekt
- RUT max 75 000 kr -- det ar korrekt for RUT-sidan (RUT har hoger tak)
- Bloggartiklar som specifikt diskuterar forandringen 50% -> 30% (historisk kontext)

### Koppling till berakningslogik
Texterna "halva arbetskostnaden" och "du betalar bara hälften" maste ocksa andras -- med 30% avdrag betalar kunden 70% av arbetskostnaden, inte halften.

Exempel-berakningar i texten maste uppdateras:
- Gammalt: "Arbetskostnad 30 000 kr, avdrag 15 000 kr, du betalar 15 000 kr"
- Nytt: "Arbetskostnad 30 000 kr, avdrag 9 000 kr, du betalar 21 000 kr"
