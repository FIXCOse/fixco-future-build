

# Nya köksartiklar — utöka blogginnehållet

## Nuläge
Befintliga köksrelaterade artiklar (5 st):
- `koksrenovering-guide-2026` — generell guide
- `ikea-koksmontage-guide` — IKEA-montage
- `koksbelysning-design-guide` — belysning
- `grovkok-planering-guide` — grovkök
- `kok-oppen-planlosning-guide` — öppen planlösning

## Nya artiklar (5 st) — fångar högvolym-sökningar

1. **`vad-kostar-nytt-kok-2026`** — "Vad kostar ett nytt kök 2026? Prisguide från budget till premium"
   - Fångar: "vad kostar nytt kök", "nytt kök pris", "köksrenovering kostnad"
   - Innehåll: prisjämförelse IKEA vs Ballingslöv vs Marbodal, materialkostnader, ROT-avdrag beräkning

2. **`koksrenovering-steg-for-steg-guide`** — "Köksrenovering steg för steg — Komplett planering 2026"
   - Fångar: "köksrenovering steg för steg", "planera köksrenovering", "renovera kök själv"
   - Innehåll: tidsplan (1–2 veckor), ordningen el→VVS→golv→montering, vanliga misstag

3. **`byta-koksluckor-bankskiva-guide`** — "Byta köksluckor och bänkskiva — Spara 50% på köksrenoveringen"
   - Fångar: "byta köksluckor", "byta bänkskiva", "billig köksrenovering"
   - Innehåll: material (laminat vs trä vs sten), ROT-avdrag, DIY vs hantverkare

4. **`koksinspiration-trender-2026`** — "Kökstrender 2026 — Färger, material och smarta lösningar"
   - Fångar: "köksinspiration 2026", "köks trender", "modernt kök"
   - Innehåll: färgpaletter, materialval, smarta förvaring, hållbara material

5. **`installera-nytt-kok-rot-avdrag`** — "Installera nytt kök med ROT-avdrag — Så sparar du tiotusentals kronor"
   - Fångar: "installera nytt kök", "köksmontering rot-avdrag", "montera kök"
   - Innehåll: vad som ger ROT (arbete), beräkningsexempel, checklista innan montering

## Teknisk plan

### Filer som ändras

1. **`src/data/blogDataNew2026Part2.ts`** — Lägg till 5 nya BlogPost-objekt (id 81–85) med fullständigt innehåll (aiSummary, keyFacts, faqs, sources, statistics, quotableStatements, entityMentions, expertise). Varje artikel 800–1200 ord med info-boxes, warning-boxes, stats, tabeller och CTA.

2. **`src/data/blogSlugs.ts`** — Lägg till 5 nya slugs med updatedAt mars 2026, category 'renovering'.

3. **`public/llms-blog.txt`** — Lägg till AI-optimerade sammanfattningar för de 5 nya artiklarna (AI Summary, Key Facts, FAQ).

4. **`src/data/blogSlugs.ts`** (BLOG_CATEGORY_TO_SERVICES) — Verifiera att 'renovering' redan mappar till köksrelaterade tjänster (den gör det).

## Innehållsriktlinjer
- Alla priser och regler verifierade mot Skatteverket, Konsumentverket
- Tidsuppskattningar: köksrenovering max 1–2 veckor
- ROT-avdrag 30%, max 50 000 kr/person/år
- Inga uppskattningar — bara verifierbara fakta
- Intern länkning till lokala kökstjänster + relaterade artiklar

