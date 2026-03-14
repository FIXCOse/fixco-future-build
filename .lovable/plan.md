

# Din idé: Specifika bokningsbara tjänster under /tjanster

## Analys

Din tanke är **utmärkt** och passar perfekt in i den befintliga arkitekturen. Här är varför:

**Ni har redan infrastrukturen på plats.** Systemet stödjer redan 151 tjänsteslugs som alla automatiskt genererar lokala sidor via `/tjanster/:slug/:area`. Att lägga till fler specifika tjänster som "montera-tv-pa-vagg", "platsbyggd-garderob", "installera-akustikpanel" osv. handlar bara om att utöka datalagren — ingen ny routing eller sidlogik behövs.

**Varför det fungerar SEO-mässigt:**
- Folk söker på exakt dessa termer: "montera tv på vägg stockholm", "platsbyggd garderob pris"
- Specifika sidor rankar bättre än generella för long-tail-sökningar
- Varje ny tjänst genererar automatiskt 53 lokala sidor (en per ort) × 2 språk = **106 nya indexerbara URL:er per tjänst**

## Vad som redan finns vs vad som saknas

Ni har redan generiska slugs som `tv-montering`, `garderobsmontering`, `hyllmontering` i `seoSlugsExpansion.ts`. Men de saknar:
1. **Detaljerat nischinnehåll** i `nicheServiceData.ts` (hero-text, FAQs, USPs, säljande intro)
2. **Fler specifika tjänster** som folk faktiskt söker på (akustikpanel, platsbyggd bokhylla, etc.)

## Plan

### 1. Definiera nya specifika tjänsteslugs

Lägga till ~15-25 nya hyperspecifika tjänster, t.ex.:
- `montera-tv-pa-vagg`, `installera-akustikpanel`, `platsbyggd-bokhylla`, `platsbyggd-garderob`, `montera-spotlights`, `installera-laddbox-hemma`, `bygga-altan`, `montera-koksflakt`, `installera-golvvarme`, `bygga-bastu`, `montera-markis`, `installera-varmepump`, `renovera-trapp`, `bygga-carport`, `montera-takfonstrer`

### 2. Lägg till nischinnehåll för varje tjänst

I `nicheServiceData.ts` / `nicheServiceDataExpanded.ts`:
- Säljande heroTitle ("Montera TV på Vägg — Snyggt, Säkert & Dolt Kablage")
- Meta title + description optimerad för sökning
- 3-4 USPs
- 3-4 FAQs (genererar FAQPage-schema automatiskt)
- Kort introText med säljande ton
- Koppling till rätt `parentCategory` och `serviceKey`

### 3. Uppdatera sitemap + prerendering

- Nya slugs läggs till i `ALL_SERVICE_SLUGS` i `vite-plugin-sitemap.ts`
- Prioriterade tjänster läggs till i prerenderingslistan

### 4. Visa på /tjanster-sidan

Lägg till de nya specifika tjänsterna som en sektion på huvudsidan `/tjanster` — t.ex. "Populära tjänster" med kort beskrivning och länk till respektive hubsida.

## Filer att ändra/skapa

| Fil | Åtgärd |
|-----|--------|
| `src/data/seoSlugsExpansion.ts` | Lägg till ~15-25 nya slugs |
| `src/data/nicheServiceDataExpanded.ts` | Nischinnehåll (hero, FAQs, USPs, intro) för varje ny tjänst |
| `src/data/blogSlugs.ts` | Uppdatera slug-listan |
| `vite-plugin-sitemap.ts` | Lägg till nya slugs i `ALL_SERVICE_SLUGS` |
| `src/pages/Services.tsx` | Ny sektion "Populära tjänster" med länkar |

Varje ny tjänst ger automatiskt: hubsida + 53 lokala sidor + hreflang + schema + sitemap-entry. Med 20 nya tjänster = **~2 100 nya indexerbara sidor**.

