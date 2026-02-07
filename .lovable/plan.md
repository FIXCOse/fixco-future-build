

## Uppdatera ROT och RUT till 30% -- Komplett guide

### Bakgrund

Sedan 1 januari 2026 har ROT-avdraget sänkts tillbaka till **30%** (från den tillfälliga höjningen till 50% under 2024-2025). RUT-avdraget ska också uppdateras till **30%**. Detta påverkar priskalkylerna, visningstexterna och alla AI-filer som beskriver avdragsnivåerna.

**OBS:** Vissa filer (blogginläggen, PlumberActionSection, GroundworkActionSection) har redan korrekta 30%-värden, medan resten av hemsidan fortfarande visar 50%.

---

### Vad som ändras

Ändringen berör **4 kategorier**:

1. **Priskalkyler (beräkningslogik)** -- 0.50 byts till 0.30
2. **Komponenter och sidor (visningstexterna)** -- "50%" byts till "30%"
3. **Översättningsfiler (sv.ts och en.ts)** -- alla "50%" i ROT/RUT-kontext
4. **Publika AI-filer och SEO** -- llms.txt, context.json, knowledge-base osv.

---

### DEL 1: Prisberäkningslogik (6 filer)

Alla `ROT_RATE` och `RUT_RATE` konstanter ändras från `0.50` till `0.30`:

| Fil | Rad | Nuvarande | Nytt |
|-----|-----|-----------|------|
| `src/utils/priceCalculation.ts` | 15-16 | `ROT_RATE = 0.50`, `RUT_RATE = 0.50` | `ROT_RATE = 0.30`, `RUT_RATE = 0.30` |
| `src/utils/priceFormatter.ts` | 29-30 | `ROT_RATE = 0.50`, `RUT_RATE = 0.50` | `ROT_RATE = 0.30`, `RUT_RATE = 0.30` |
| `src/components/ServiceCardV3.tsx` | 11-12 | `ROT_RATE = 0.50`, `RUT_RATE = 0.50` | `ROT_RATE = 0.30`, `RUT_RATE = 0.30` |
| `src/components/PriceSummary.tsx` | 8-9 | `ROT_RATE = 0.50`, `RUT_RATE = 0.50` | `ROT_RATE = 0.30`, `RUT_RATE = 0.30` |
| `src/features/ai/tools/estimateQuote.ts` | 44 | `workInclVat * 0.50` | `workInclVat * 0.30` |
| `src/lib/admin.ts` | 223 | `laborShare * 0.50` (RUT) | `laborShare * 0.30` |

**OBS:** `src/lib/admin.ts` rad 221 har redan korrekt `0.30` for ROT. Rad 223 (RUT) behöver ändras.

Kommentarer i koden som nämner "50%" uppdateras också.

---

### DEL 2: RUT-beräknaren (1 fil)

`src/components/RUTCalculator.tsx`:
- Rad 11: Kommentar "50% av arbetskostnad" till "30%"
- Rad 16: `rutPercentage = 50` till `rutPercentage = 30`
- Rad 60: Text "50% rabatt" till "30% rabatt"
- Rad 136: Text "minst X kr" (omberäknas med 30%-faktor)
- Rad 152: "RUT-avdrag (50%)" till "RUT-avdrag (30%)"

---

### DEL 3: ROT-beräknaren

`src/components/ROTCalculator.tsx`:
- Kommentar "50% av arbetskostnad" till "30%"

---

### DEL 4: Sidor och komponenter (~15 filer)

| Fil | Vad ändras |
|-----|-----------|
| `src/pages/DoorLockLandingPage.tsx` | Meta title "50% ROT" -> "30% ROT", texten "50% ROT-avdrag" -> "30% ROT-avdrag" |
| `src/pages/LocalServicePage.tsx` | Badge "50% ROT/RUT", stora "50%" texten, CTA-sektionen |
| `src/pages/locations/ServiceCityDetail.tsx` | Texten "50% av arbetskostnaden", "50%" siffran, ROT/RUT-hantering text |
| `src/pages/HomeV2.tsx` | "50% ROT-avdrag direkt", "50% rabatt" subtitle |
| `src/pages/ROTInfo.tsx` | Meta title och description med "50%" |
| `src/pages/RUT.tsx` | Meta title och description med "50%" |
| `src/pages/FAQ.tsx` | FAQ-svar om ROT och RUT med "50%" |
| `src/pages/SmartHome.tsx` | Stor "50%" siffra i statistik |
| `src/pages/MyFixco/RotRutPage.tsx` | "50% avdrag" text |
| `src/components/AnswerCapsule.tsx` | "50% rabatt" text |
| `src/components/SEOSchema.tsx` | FAQ "50% rabatt", default meta description |
| `src/components/SEOSchemaEnhanced.tsx` | "50% ROT/RUT-avdrag", "50% of labor cost" |
| `src/components/Project3DVisualizer.tsx` | "50% ROT-avdrag" text |
| `src/components/local-service/CompactTrustBar.tsx` | "50% ROT/RUT-avdrag" |
| `src/components/local-service/GardenActionSection.tsx` | "RUT-avdrag 50%" |
| `src/components/AIChat/KnowledgeBase.ts` | "50% avdrag" i ROT/RUT-regler och FAQ |
| `src/components/AIChat/IntentEngine.ts` | Regex pattern `50%` |

---

### DEL 5: Översättningsfiler (2 filer)

**`src/copy/sv.ts`** -- Cirka 25+ ställen som nämner "50%":
- `chips.rot_50` -> `chips.rot_30`
- `chips.rut_50` -> `chips.rut_30`
- Alla ROT/RUT-relaterade texter: "Spara 50%" -> "Spara 30%", "50% rabatt" -> "30% rabatt", osv.

**`src/copy/en.ts`** -- Cirka 25+ ställen:
- Motsvarande engelska texter: "Save 50%" -> "Save 30%", "50% discount" -> "30% discount"

---

### DEL 6: Data-filer (3 filer)

| Fil | Vad ändras |
|-----|-----------|
| `src/data/doorLockData.ts` | FAQ-svar "50% ROT" -> "30%", rotInfo-text "50%", Schema.org description |
| `src/data/serviceCityData.ts` | Alla title-taggar "ROT 50%" -> "ROT 30%", descriptions, "ROT-avdrag ger 50%" etc |
| `src/data/serviceCityContent.ts` | "Du sparar 50%" -> "du sparar 30%" |
| `src/data/localSeoData.ts` | Alla SEO-titlar "ROT 50%/RUT 50%" -> "30%", fallback-text "50%" |
| `src/data/cityData.ts` | FAQ-svar "50%", stad-descriptions |

---

### DEL 7: Publika AI-filer (8+ filer)

Alla publika filer som AI-modeller läser måste synkroniseras:

| Fil | Vad ändras |
|-----|-----------|
| `public/llms.txt` | "50% rabatt" -> "30% rabatt", FAQ-svar |
| `public/llms-ctx.txt` | Alla "ROT (50%)" -> "ROT (30%)", "50% rabatt", price-after-deduction (omräknas) |
| `public/llms-full.txt` | Alla "50%" -> "30%", "After ROT deduction (50%)" -> "(30%)", prisomräkningar |
| `public/context.json` | USP "50% rabatt", FAQ-svar |
| `public/knowledge-base.json` | Schema "50% of labor cost" |
| `public/knowledge-base.yaml` | USP "50% rabatt", FAQ-svar |
| `public/.well-known/llms.txt` | Alla "ROT (50%)", "RUT (50%)", "50% discount" |
| `public/.well-known/ai.txt` | Alla "ROT (50%)", discount: 50% |
| `public/.well-known/ai-plugin.json` | Description "50% rabatt" |
| `public/.well-known/openapi.yaml` | "50% rabatt", example "50%" |
| `public/services.csv` | `tax_deduction_percent` kolumnen: 50 -> 30, samt omberäkning av `price_after_deduction_min/max` |

**Prisomräkningar i AI-filerna:**
- Snickare 958 kr/h: efter 30% ROT = **671 kr/h** (inte 479)
- Målning 958 kr/h: efter 30% ROT = **671 kr/h**
- Golv 958 kr/h: efter 30% ROT = **671 kr/h**
- Flytt 559 kr/h: efter 30% RUT = **391 kr/h** (inte 280)
- El ~1059 kr/h: efter 30% ROT = **~741 kr/h** (inte 530)

---

### DEL 8: Supabase-funktion

`create_draft_quote_for_booking` i databasen har redan `rot_deduction := work_total * 0.30` -- detta stämmer redan.

---

### Sammanfattning av filer att ändra

Totalt **~35-40 filer** som behöver uppdateras:

- 6 filer med beräkningslogik
- ~15 React-komponenter/sidor
- 2 översättningsfiler (sv.ts, en.ts)
- 5 data-filer
- 10+ publika AI/SEO-filer
- 1 CSV-fil (services.csv)

### Ordningsföljd

1. Beräkningslogiken (viktigast -- påverkar alla prisvisningar)
2. Komponenter och sidor
3. Översättningsfiler
4. Data-filer
5. AI-filer och CSV

