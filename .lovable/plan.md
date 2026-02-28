

## Internationalisering: Hardkodad svensk text till oversattningssystemet

### Problem
Manga komponenter har hardkodad svensk text direkt i JSX istallet for att anvanda `useCopy()` / `t()` oversattningssystemet. Nar man byter till engelska med sprakswitcharen forblir stora delar av sajten pa svenska.

### Omfattning
Problemet finns i **~15 komponenter** uppdelade i tva kategorier:

**Kategori 1: v2-komponenter (HomeV2-sidan) -- helt utan oversattning**
Dessa komponenter anvander inte `useCopy()` alls och har all text hardkodad pa svenska:

| Komponent | Hardkodad text |
|-----------|---------------|
| `HeroV2.tsx` | "Vi bygger framtidens hem", "Boka gratis offert", trust badges, etc. |
| `CTAV2.tsx` | "Redo att borja ditt projekt?", "Boka gratis offert nu", trust badges |
| `BentoGrid.tsx` | Alla tjanstenamn och beskrivningar, "Vara tjanster", "Las mer" |
| `TestimonialsV2.tsx` | "Vad sager vara kunder?", alla omdomen |
| `StatisticsBar.tsx` | "Nojda kunder", "ROT-rabatt", "Kundbetyg", "Dagars starttid" |
| `HomeV2.tsx` | SEO-titlar, FeatureSplit-titlar och features |

**Kategori 2: Ovriga komponenter -- delvis hardkodade**

| Komponent | Problem |
|-----------|---------|
| `StickyCtaBar.tsx` | "Boka denna tjanst", "Ring direkt", "Begar offert", "Ring oss" |
| `GlobalStickyCTA.tsx` | "Boka denna tjanst", "Ring nu", "Begar offert" |
| `ProjectShowcase.tsx` | "Vill du se ditt hem har?", CTA-text, "Projekt 2024", "Nojda kunder", "Svarstid" |
| `MicroFAQ.tsx` | Alla fragor och svar ar hardkodade pa svenska |
| `FAQTeaser.tsx` | FAQ-fragor ar hardkodade i komponenten |
| `SmartIntegrations.tsx` | "Begar installationsoffert", "Begar komplett offert" |
| `ROTCalculator.tsx` | "Begar offert med ROT-priser", "Boka kostnadsfri konsultation" |
| `hero.trust_rot_desc` i sv.ts | Visar fortfarande "50% rabatt" (borde vara "30% rabatt") |

### Losning

**Steg 1: Lagg till nya copy-nycklar i `sv.ts` och `en.ts`**

Lagga till ~40 nya nycklar for v2-komponenterna och ovriga hardkodade texter:

```
// v2 Hero
'v2.hero.badge': 'Snabb service - 15 000+ nojda kunder' / 'Fast service - 15,000+ happy customers'
'v2.hero.title1': 'Vi bygger' / 'We build'  
'v2.hero.title2': 'framtidens hem' / 'the home of the future'
'v2.hero.subtitle': '...' / '...'
'v2.hero.cta': 'Boka gratis offert' / 'Book free quote'
'v2.hero.call': 'Ring: +46 79 335 02 28' / 'Call: +46 79 335 02 28'
'v2.hero.trust.rot': 'ROT & RUT-godkant' / 'ROT & RUT approved'
'v2.hero.trust.ftax': 'F-skattsedel' / 'F-tax certificate'
'v2.hero.trust.insured': 'Forsakrade hantverkare' / 'Insured craftsmen'
'v2.hero.trust.warranty': 'Garanti pa arbete' / 'Work guarantee'

// v2 CTA
'v2.cta.title1': 'Redo att borja' / 'Ready to start'
'v2.cta.title2': 'ditt projekt?' / 'your project?'
'v2.cta.subtitle': '...' / '...'
'v2.cta.button': 'Boka gratis offert nu' / 'Book free quote now'
'v2.cta.trust.quote': 'Snabb offert' / 'Quick quote'
'v2.cta.trust.rot': 'ROT & RUT-avdrag' / 'ROT & RUT deductions'
'v2.cta.trust.exp': 'Erfarna hantverkare' / 'Experienced craftsmen'
'v2.cta.trust.warranty': 'Garanti pa arbete' / 'Work guarantee'

// v2 BentoGrid - tjanster
'v2.services.title': 'Vara tjanster' / 'Our services'
'v2.services.subtitle': '...' / '...'
'v2.services.readMore': 'Las mer' / 'Read more'
'v2.services.electrician': 'Elmontor' / 'Electrician'
'v2.services.electrician.desc': '...' / '...'
... (6 tjanster totalt)

// v2 Testimonials
'v2.testimonials.title': 'Vad sager vara kunder?' / 'What do our customers say?'
'v2.testimonials.subtitle': '...' / '...'
... (3 omdomen med content och role)

// v2 Statistics  
'v2.stats.customers': 'Nojda kunder' / 'Happy customers'
'v2.stats.days': 'Dagars starttid' / 'Days to start'
'v2.stats.discount': 'ROT-rabatt' / 'ROT discount'
'v2.stats.rating': 'Kundbetyg' / 'Customer rating'

// HomeV2 FeatureSplit
'v2.whyFixco.title': 'Varfor valja Fixco?' / 'Why choose Fixco?'
... (features)
'v2.rotRut.title': 'ROT & RUT-avdrag - Vi skoter allt' / 'ROT & RUT - We handle everything'
... (features)

// Sticky CTAs
'sticky.bookService': 'Boka denna tjanst' / 'Book this service'
'sticky.callNow': 'Ring nu' / 'Call now'  
'sticky.requestQuote': 'Begar offert' / 'Request quote'
'sticky.callUs': 'Ring oss' / 'Call us'

// ProjectShowcase CTA
'projects.cta_title': 'Vill du se ditt hem har?' / 'Want to see your home here?'
'projects.cta_desc': '...' / '...'
'projects.stats.year': 'Projekt 2024' / 'Projects 2024'
'projects.stats.satisfied': 'Nojda kunder' / 'Happy customers'  
'projects.stats.response': 'Svarstid' / 'Response time'
```

**Steg 2: Uppdatera `keys.ts`**

Lagga till alla nya nycklar i CopyKey-typen.

**Steg 3: Uppdatera v2-komponenterna att anvanda `useCopy()`**

For varje v2-komponent:
1. Importera `useCopy` fran `@/copy/CopyProvider`
2. Kalla `const { t, locale } = useCopy()`
3. Ersatt alla hardkodade textstrangar med `t('nyckel')`
4. For lankar: anvand locale-medvetna sokvagar (t.ex. `locale === 'en' ? '/en/...' : '/...'`)

**Steg 4: Uppdatera ovriga hardkodade komponenter**

- `StickyCtaBar.tsx`: Importera `useCopy`, ersatt CTA-texter
- `GlobalStickyCTA.tsx`: Ersatt CTA-texter med t()-anrop
- `ProjectShowcase.tsx`: Ersatt CTA-sektion och stats
- `MicroFAQ.tsx`: Antingen anvand copy-nycklar eller gora locale-medveten med `useCopy()`
- `FAQTeaser.tsx`: FAQ-fragorna ar hardkodade -- flytta till copy-systemet

**Steg 5: Fixa kvarvarande 50%-text**

- `hero.trust_rot_desc` i `sv.ts` rad 676: "50% rabatt" -> "30% rabatt"
- `comparison.price_rot_desc` i `sv.ts` rad 690: "Med 50% ROT-avdrag" -> "Med 30% ROT-avdrag"
- Motsvarande i `en.ts`
- `StatisticsBar.tsx` rad 8: `value: 50` -> `value: 30` for ROT-rabatt

### Tekniska detaljer

- Alla v2-komponenter maste wrappas inne i `CopyProvider` -- de ar det redan via `AppLayout`
- `HomeV2.tsx` renderas via routes inuti `AppLayout`, sa `useCopy()` fungerar
- Copy-nycklarna kravs i `keys.ts` for typ-sakerhet -- detta ar en union type av alla giltiga nycklar
- `StatisticsBar` behover inte oversatta siffror, bara labels
- For `MicroFAQ` ar det enklast att ha tva arrayer (sv/en) och valja baserat pa locale, istallet for 15+ individuella copy-nycklar

### Filer som andras

1. `src/copy/keys.ts` -- lagg till ~40 nya nycklar
2. `src/copy/sv.ts` -- lagg till ~40 nya svenska texter + fixa 50% -> 30%
3. `src/copy/en.ts` -- lagg till ~40 nya engelska texter + fixa 50% -> 30%
4. `src/components/v2/HeroV2.tsx` -- anvand t()
5. `src/components/v2/CTAV2.tsx` -- anvand t()
6. `src/components/v2/BentoGrid.tsx` -- anvand t()
7. `src/components/v2/TestimonialsV2.tsx` -- anvand t()
8. `src/components/v2/StatisticsBar.tsx` -- anvand t() + fixa 50 -> 30
9. `src/pages/HomeV2.tsx` -- anvand t() for FeatureSplit-props och SEO
10. `src/components/StickyCtaBar.tsx` -- anvand t()
11. `src/components/GlobalStickyCTA.tsx` -- anvand t()
12. `src/components/ProjectShowcase.tsx` -- anvand t()
13. `src/components/MicroFAQ.tsx` -- locale-medveten
14. `src/components/FAQTeaser.tsx` -- flytta fragor till copy

### Vad som INTE andras
- Admin-komponenter (behover inte oversattas)
- Worker-komponenter
- Komponenter som redan anvander `useCopy()` korrekt (Hero.tsx, Navigation, etc.)

