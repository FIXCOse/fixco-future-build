

# SEO-plan: Öka trafik och Google-ranking

## Nuläge
Ni har redan en stark teknisk SEO-grund:
- 16 000+ sidor med unika titlar, meta, schema (prerenderade)
- Sitemap med 151 tjänster × 53 områden
- Breadcrumbs, FAQ-schema, HowTo-schema, LocalBusiness
- 80+ bloggartiklar med Article-schema
- Hreflang sv/en på alla sidor

**Men det finns tydliga luckor som hindrar er från att ranka högre och få fler klick.**

---

## 1. Bloggartiklar saknas i sitemap

Alla 80+ bloggartiklar (`/blogg/slug`) genereras dynamiskt men finns **inte i sitemap.xml**. Google hittar dem långsammare utan sitemap-entry.

**Åtgärd:** Lägg till `sitemap-blog.xml` i `vite-plugin-sitemap.ts` som listar alla blogginlägg med `lastmod`, `changefreq: monthly`, `priority: 0.65`. Importera slug-listan från `blogData.ts`.

---

## 2. Intern länkning mellan lokala sidor och blogg

Google värderar intern länkning högt. Idag finns `ExpandableAreaLinks` (områdeslänkar) och `relatedSearches` på lokala sidor, men **ingen koppling mellan lokala tjänstesidor och relevanta bloggartiklar** — och blogginlägg länkas inte heller till lokala sidor.

**Åtgärd:**
- **LocalServicePage.tsx**: Lägg till en "Läs mer"-sektion med 2-3 relevanta bloggartiklar baserat på tjänstekategori (mappning tjänst→bloggkategori).
- **BlogPost.tsx**: Lägg till en "Boka tjänsten"-sektion med 2-3 lokala tjänstlänkar baserat på artikelns kategori.

---

## 3. Relaterade tjänster på lokala sidor

Varje lokal sida (`/tjanster/snickare/uppsala`) har område-länkar men **inga korsreferenser till relaterade tjänster** i samma ort (t.ex. "Söker du även målare i Uppsala?"). Detta bygger intern topical authority.

**Åtgärd:** Ny komponent `RelatedServicesSection` som visar 3-5 relaterade tjänster i samma ort. Mappning baserat på tjänstekategori (bygg→el+vvs+målning, kök→köksluckor+diskbänk, etc). Renderas i LocalServicePage.

---

## 4. Prerendera bloggartiklar (statisk HTML)

Precis som lokala sidor hade "Upptäckt – ej indexerad"-problem innan prerendering, riskerar bloggen samma öde. De 80+ artiklarna bör få statiska HTML-filer med unika `<title>`, `<meta>`, canonical.

**Åtgärd:** Utöka `vite-plugin-prerender-local.ts` med blogg-slugs (80 extra filer — ryms inom build-budget).

---

## 5. FAQ-sidor per tjänstekategori

Ni har en generell `/faq` men **inga dedikerade FAQ-sidor per tjänst** (t.ex. `/faq/badrumsrenovering`). Dessa rankar på long-tail-sökningar som "vad kostar badrumsrenovering med ROT".

**Åtgärd:** Ny route `/faq/:category` + sida som filtrerar FAQ:er per kategori med FAQPage-schema. Data finns redan delvis i `blogData.ts` (faqs per artikel).

---

## Sammanfattning

| # | Åtgärd | Effekt | Filer |
|---|--------|--------|-------|
| 1 | Blogg i sitemap | Google indexerar 80+ artiklar snabbare | `vite-plugin-sitemap.ts` |
| 2 | Intern länkning blogg↔tjänster | Starkare topical authority, lägre bounce | `LocalServicePage.tsx`, `BlogPost.tsx` |
| 3 | Relaterade tjänster per ort | Intern länkvävning, längre sessioner | Ny `RelatedServicesSection.tsx`, `LocalServicePage.tsx` |
| 4 | Prerendera blogg | Löser potentiellt "ej indexerad"-problem | `vite-plugin-prerender-local.ts` |
| 5 | FAQ per kategori | Rankar long-tail sökord, rich snippets | Ny route + sida |

Alla åtgärder stärker Googles förmåga att crawla, indexera och ranka ert innehåll — dvs ren SEO, inte CRO.

