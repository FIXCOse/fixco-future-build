

## Fix: Lokala tjanstesidor helt pa svenska aven pa engelska routes

### Problem

Lokala tjanstesidor (`/en/services/vvs/uppsala`) visar ALLT innehall pa svenska. Det finns tva nivaer av hardkodning:

1. **UI-labels i `LocalServicePage.tsx`** (~30 hardkodade svenska strangar): "Lokala hantverkare i", "Begrar gratis offert", "4 enkla steg", "Vanliga fragor", "Fler tjanster i", "Redo att boka", "Relaterade sokningar", "Akut hjalp i", etc.

2. **Genererat innehall i datafiler** (hundratals svenska strangar):
   - `localServiceData.ts`: `generateLocalContent()` -- h1, title, description, FAQ:er, ROT/RUT-text, service items, quick facts, myter -- allt pa svenska
   - `localSeoData.ts`: `generateUniqueLocalContent()` -- intros, popular searches, local tips, nearby areas
   - `areaActivityData.ts`: `getHowToSteps()` och `getAreaReviews()` -- steg-beskrivningar och recensioner pa svenska
   - `CompactTrustBar.tsx`: "betyg", "Svar inom 2h", "Ansvarsforsakrade"

### Strategi: Locale-parameter genom hela kedjan

Istallet for att duplicera 900 rader data, gor vi alla content-genererande funktioner locale-medvetna genom att skicka `locale` som parameter. Varje funktion valjer ratt texttemplates baserat pa locale.

---

### Steg 1: `LocalServicePage.tsx` -- UI-labels via `t()` (~30 strangar)

Lagg till copy-nycklar for alla hardkodade UI-labels:

| Svensk text | Nyckel |
|-------------|--------|
| "Lokala hantverkare i {area}" | `local.heroBadge` |
| "Hitta kvalificerade {service} i {area}..." | `local.heroIntro` |
| "Svar 2h" | `local.response2h` |
| "Begar gratis offert" | `local.ctaQuote` |
| "Baserat pa efterfragan i {area}" | `local.demandBadge` |
| "Vanliga {service}-projekt i {area}" | `local.commonProjects` |
| "Tips for {service} i {area}" | `local.tipsFor` |
| "Om {service} i {area}" | `local.aboutServiceIn` |
| "4 enkla steg" | `local.fourSteps` |
| "Sa bokar du {service}" | `local.howToBook` |
| "Fran forfragan till fardigt jobb pa nolltid" | `local.fromRequestToDone` |
| "Allt du behover, samlat pa ett stalle" | `local.allYouNeed` |
| "Spara pengar" | `local.saveMoney` |
| "Kundrecensioner" | `local.reviews` |
| "Vad vara kunder i {area} sager" | `local.whatCustomersSay` |
| "Snabbfakta:" | `local.quickFacts` |
| "Visste du detta om {area}?" | `local.didYouKnow` |
| "Vanliga fragor" | `local.faq` |
| "FAQ om {service} i {area}" | `local.faqTitle` |
| "Fler tjanster i {area}" | `local.moreServices` |
| "Redo att boka {service}?" | `local.readyToBook` |
| "Fa ett fast pris fran lokala hantverkare..." | `local.fixedPrice` |
| "Alla tjanster" | `local.allServices` |
| "{service} i hela {area} och narliggande orter" | `local.nearbyTitle` |
| "Relaterade sokningar:" | `local.relatedSearches` |
| "Akut hjalp i {area}:" | `local.urgentHelp` |
| "Sidan hittades inte" | `local.notFound` |
| "Vi kunde inte hitta den tjanst eller ort du soker." | `local.notFoundDesc` |

### Steg 2: `generateLocalContent()` -- Locale-medvetet innehall

Andring i `localServiceData.ts`:
- `generateLocalContent(serviceSlug, area)` far en tredje parameter: `locale: 'sv' | 'en' = 'sv'`
- Alla template-strangar far en `sv`/`en` variant
- Service-namn far engelska mappningar: `{ snickare: "Carpenter", elektriker: "Electrician", vvs: "Plumbing", malare: "Painter", ... }`
- FAQ-fragor och svar genereras pa ratt sprak
- ROT/RUT-sektionen genereras pa ratt sprak
- Title/description-templates far engelska varianter

### Steg 3: `generateUniqueLocalContent()` -- Locale-medvetet

Andring i `localSeoData.ts`:
- Samma monster: locale-parameter
- Engelska varianter for popular searches, local tips, related searches, urgent services, project examples

### Steg 4: `getHowToSteps()` och `getAreaReviews()` -- Locale-medvetet

Andring i `areaActivityData.ts`:
- `getHowToSteps(serviceName, area, locale)` -- engelska steg-titlar och beskrivningar
- `getAreaReviews(area, serviceName, count, locale)` -- engelska recensionsmallar

### Steg 5: `CompactTrustBar.tsx` -- Locale-medvetet

- Importera `useCopy()`, anvand `locale` for trust-items text

### Steg 6: Copy-nycklar

Utoka `keys.ts`, `sv.ts`, `en.ts` med ~30 nya nycklar for lokala sidors UI-labels.

---

### Filer som andras

1. **`src/copy/keys.ts`** -- ~30 nya `local.*` nycklar
2. **`src/copy/sv.ts`** -- ~30 svenska oversattningar
3. **`src/copy/en.ts`** -- ~30 engelska oversattningar
4. **`src/pages/LocalServicePage.tsx`** -- Ersatt alla hardkodade strangar med `t()`, skicka `locale` till content-funktioner
5. **`src/data/localServiceData.ts`** -- `generateLocalContent()` far `locale`-parameter med engelska templates
6. **`src/data/localSeoData.ts`** -- `generateUniqueLocalContent()` far `locale`-parameter
7. **`src/data/areaActivityData.ts`** -- `getHowToSteps()` och `getAreaReviews()` far `locale`-parameter
8. **`src/components/local-service/CompactTrustBar.tsx`** -- Anvand `useCopy()` for trust-items

### Service-namn mappning (central)

```text
snickare     -> Carpenter
elektriker   -> Electrician
vvs          -> Plumbing
malare       -> Painter
tradgard     -> Gardening
stad         -> Cleaning
markarbeten  -> Groundwork
montering    -> Assembly
flytt        -> Moving
tekniska-installationer -> Technical Installation
```

### Vad detta loser

- Alla lokala tjanstesidor visar ratt sprak baserat pa URL (/en/ = engelska)
- Content-genereringen ar framtidssaker -- nya tjanster/orter far automatiskt bada spraken
- UI-labels ar centraliserade via copy-systemet
- SEO-schemat behaller svenska canonical-URL:er (bra for SEO)

### Vad som INTE andras

- Fun facts om orter -- dessa ar kulturfakta pa svenska och behover inte oversattas (sekundart innehall)
- Myter -- dessa ar SEO-tunga svenska texter, kan oversattas i framtida steg
- Admin/worker-sidor

