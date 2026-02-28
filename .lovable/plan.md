

## Systematisk i18n-fix: Saknade engelska routes + hardkodad svensk text

### Problem
Tva separata men relaterade problem:

1. **Engelska routes saknas i App.tsx** -- 404 pa t.ex. `/en/services/plumbing/uppsala` eftersom lokala tjanstesidor, dorrlassidan, blogg m.m. aldrig registrerats som engelska routes
2. **30+ komponenter har hardkodad svensk text** som aldrig gar genom oversattningssystemet -- detta ar ohallbart att fixa komponent for komponent

### Strategi: Tva-stegsfix

---

### DEL 1: Lagg till alla saknade engelska routes i App.tsx

Foljande routes saknas under `/en`-blocket:

| Route | Komponent |
|-------|-----------|
| `services/:serviceSlug/:areaSlug` | LocalServicePage |
| `services/door-locks` | DoorLockLandingPage |
| `blog` | Blog |
| `blog/:slug` | BlogPost |
| English city pages (`areas/uppsala`, `areas/stockholm`) | LocationCityPage |
| `book/:slug` | BookingWizard |
| `insurance` | (om sidan finns) |

Detta loser 404-problemet direkt.

---

### DEL 2: Systematisk i18n for alla kvarvarande komponenter

Istallet for att lagga till hundratals copy-nycklar en i taget, anvander vi en **hybridstrategi**:

#### A) Komponenter som redan har `useCopy()` men fortfarande har hardkodad text

Dessa behover bara ersatta sina hardkodade strangar med `t()`:

| Komponent | Hardkodad text |
|-----------|---------------|
| `Home.tsx` | "Alla Tjanster med ROT & RUT-avdrag", FAQ-schema, SEO-meta, "Se alla tjanster och priser", hela "Tjanster i Ditt Omrade"-sektionen |
| `Services.tsx` | "Tjanster i Ditt Omrade", alla lokala lankar ("Elektriker Uppsala" etc.) |
| `ComparisonUltra.tsx` | Redan anvander `t()` for det mesta, men kontrollera kvarstaende |

#### B) Komponenter som INTE anvander `useCopy()` alls

| Komponent | Typ av hardkodning |
|-----------|-------------------|
| `HeroV3.tsx` | "Sveriges Ledande Hantverkare", "Bygg- & fastighetstjanster for privat, BRF & foretag", "Expertlosningar...", CTA-knappar, lankar |
| `TrustBar.tsx` | 12 trust-items alla pa svenska |
| `ServiceFinder.tsx` | Rubriker, beskrivningar, felmeddelanden |
| `DoorLockLandingPage.tsx` | Stor sida helt pa svenska |
| `ServiceComparisonCard.tsx` | CTA-text |
| `RUTCalculator.tsx` | CTA-knappar |
| `AnswerCapsule.tsx` | SEO-text |

#### C) Sidor med `isEnglish`-ternaries men saknad oversattning

Vissa sidor (ROTInfo, RUT, FAQ, Terms, Privacy) anvander redan `isEnglish ? '...' : '...'` monster -- dessa fungerar redan delvis men saknar copy-nycklar. Dessa later vi vara for nu da de ar funktionella.

---

### Implementation -- Nya copy-nycklar (~50 nya)

#### Gruppering:

**Home-sidan:**
- `home.allServices.title`, `home.allServices.subtitle`, `home.allServices.cta`
- `home.areaLinks.title`, `home.areaLinks.subtitle`
- FAQ-schema ska anvanda locale-medvetna fragor

**HeroV3:**
- `hero3.eyebrow`, `hero3.headline`, `hero3.subtitle`, `hero3.cta1`, `hero3.cta2`

**TrustBar:**
- `trustbar.quality`, `trustbar.startTime`, `trustbar.location`, `trustbar.google`, `trustbar.insured`, `trustbar.experience`, `trustbar.personal`, `trustbar.quickQuote`, `trustbar.rot`, `trustbar.freeVisit`, `trustbar.recommended`, `trustbar.satisfied`

**ServiceFinder:**
- `serviceFinder.title`, `serviceFinder.subtitle`, `serviceFinder.noResults`, `serviceFinder.noResultsDesc`, `serviceFinder.contactCta`

---

### Filer som andras

1. **`src/App.tsx`** -- Lagg till 6-8 saknade engelska routes
2. **`src/copy/keys.ts`** -- ~50 nya nycklar
3. **`src/copy/sv.ts`** -- ~50 nya svenska texter
4. **`src/copy/en.ts`** -- ~50 nya engelska texter
5. **`src/pages/Home.tsx`** -- Ersatt hardkodade sektioner med `t()`, locale-medvetna lankar
6. **`src/pages/Services.tsx`** -- Locale-medvetna omradeslankningar
7. **`src/components/v3/HeroV3.tsx`** -- Anvand `useCopy()` for all text
8. **`src/components/TrustBar.tsx`** -- Anvand `useCopy()` for alla trust-items
9. **`src/components/ServiceFinder.tsx`** -- Anvand `useCopy()`
10. **`src/components/ServiceComparisonCard.tsx`** -- Anvand `t()`
11. **`src/components/RUTCalculator.tsx`** -- CTA-knappar
12. **`src/components/AnswerCapsule.tsx`** -- Anvand `t()`

### Vad som INTE andras i denna omgang
- Admin-sidor (behover inte oversattas)
- Worker-sidor
- DoorLockLandingPage (extremt stor sida, separat projekt)
- Sidor som redan anvander `isEnglish`-ternaries (ROTInfo, RUT, FAQ, Terms, Privacy -- dessa fungerar redan)
- SEO-schema i Home.tsx -- dessa behover locale-medvetna FAQ:er men ar sekundara

### Framtidsakerhet
Med denna andring ar alla **centrala och synliga** komponenter i18n-medvetna. Nar nya sidor skapas ska de:
1. Alltid anvanda `useCopy()` for text
2. Alltid anvanda `locale`-medvetna lankar
3. Lagg till engelska routes i App.tsx parallellt med svenska

