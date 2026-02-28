

## Fix: Lokala tjanstesidor fungerar inte pa engelska

### Rotorsak

Tva problem:

1. **`convertPath()` i `routeMapping.ts`** -- Nar man byter sprak pa t.ex. `/tjanster/vvs/uppsala` finns ingen exakt match i lookup-tabellen, sa fallback-logiken gor bara `"/en/" + "tjanster/vvs/uppsala"` = `/en/tjanster/vvs/uppsala`. Den routen finns inte -- den engelska versionen ar `/en/services/vvs/uppsala`. Samma problem at andra hallet.

2. **Hardkodade `/tjanster/`-lankar** i alla lokala komponentfiler -- `LocalServicePage.tsx`, `NearbyAreasSection.tsx`, `ExpandableAreaLinks.tsx` har alla lankar som alltid pekar till `/tjanster/...` oavsett sprak.

### Losning

#### Steg 1: Fix `convertPath()` for dynamiska sokvagar

Uppdatera `src/utils/routeMapping.ts` sa att `convertPath` hanterar dynamiska lokala routes:

- Om stigen borjar med `/tjanster/` och inte finns i lookup-tabellen --> byt prefix till `/en/services/`
- Om stigen borjar med `/en/services/` och inte finns i lookup --> byt till `/tjanster/`
- Lika for `/boka/` <-> `/en/book/`

Detta loser problemet for **alla** nuvarande och framtida dynamiska sidor utan att behova lagga till varje kombination i tabellen.

#### Steg 2: Locale-medvetna lankar i lokala komponenter

Skapa en liten hjalpfunktion, t.ex. `useServicePath()`, som returnerar ratt prefix baserat pa locale:

```
locale === 'en' ? '/en/services' : '/tjanster'
```

Uppdatera foljande filer att anvanda den:

- `src/pages/LocalServicePage.tsx` -- alla interna lankar (grannorter, andra tjanster)
- `src/components/local-service/NearbyAreasSection.tsx` -- omradeslankarna
- `src/components/local-service/ExpandableAreaLinks.tsx` -- omradeslankarna

#### Steg 3: Locale-medveten SEO-data i LocalServicePage

SEO-schemat (canonical, og:url, LocalBusiness, BreadcrumbList) anvander hardkodad `fixco.se/tjanster/...`. Dessa ska fortsatta peka pa svenska URL:er (canonical) men fa korrekt `hreflang`-alternativ.

### Filer som andras

1. **`src/utils/routeMapping.ts`** -- Dynamisk prefix-konvertering i `convertPath()`
2. **`src/pages/LocalServicePage.tsx`** -- Locale-medvetna interna lankar
3. **`src/components/local-service/NearbyAreasSection.tsx`** -- Anvand locale-prefix
4. **`src/components/local-service/ExpandableAreaLinks.tsx`** -- Anvand locale-prefix

### Vad detta loser

- Sprakswitchern pa lokala sidor navigerar till ratt engelsk URL (`/en/services/vvs/uppsala`)
- Nar man ar pa engelska versionen fungerar alla omrades- och tjanstelankar inom sidan
- Losningen ar **framtidssaker** -- nya tjanster och omraden behover inga extra mappningar
