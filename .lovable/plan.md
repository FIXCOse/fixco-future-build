

# Fix: Differentiera huvudort från delområde i titlar

## Problemanalys

Google rankar "Snickare Gamla Uppsala" istället för "Snickare Uppsala" vid sökning på "snickare uppsala" eftersom:

1. **Titlarna är nästan identiska** — `Snickare Uppsala ★ Kök, garderob...` vs `Snickare Gamla Uppsala ★ Kök, garderob...`
2. **Saknar preposition "i"** — Google kan inte parse:a att "Uppsala" är en plats utan kontext
3. **Ingen hierarkisk signal** — Sub-områden nämner inte sin överordnade stad
4. **Samma innehållsstruktur** — inget skiljer en huvudstad (248 000 inv) från en liten ort (2 500 inv)

## Lösning: Tre nivåer av titlar

Definiera vilka som är "huvudorter" (Stockholm, Uppsala) och vilka som är sub-områden. Ge dem olika titelmönster:

### Huvudort (Stockholm, Uppsala)
```
Boka Snickare i Uppsala ★ Hela Uppsala län · ROT 30% · Fri offert
```
- Action-ord "Boka"
- Preposition "i"
- **"Hela Uppsala län"** — bredare signal, visar att detta är HUB-sidan

### Stora kommuner (Nacka, Solna, Täby, Knivsta etc.)
```
Boka Snickare i Nacka ★ Alla byggtjänster · ROT 30% · Fri offert
```
- Samma action-mönster
- "Alla byggtjänster" — visar bredd

### Sub-områden (Gamla Uppsala, Sävja, Ultuna etc.)
```
Snickare i Gamla Uppsala · Nära dig i Uppsala · ROT 30%
```
- **"Nära dig i Uppsala"** — kopplar till föräldern, men gör det tydligt att detta INTE är Uppsala-huvudsidan
- Kortare, mindre dominant titel

### Metabeskrivningar — samma princip

**Huvudort:**
```
Snickare i Uppsala ★ 5/5 betyg ✓ Alla byggtjänster i hela Uppsala län ✓ 30% ROT-avdrag ✓ Fast pris. Få offert inom 24h!
```

**Sub-område:**
```
Snickare i Gamla Uppsala ★ 5/5 betyg ✓ Lokal hantverkare nära dig ✓ 30% ROT-avdrag. Boka idag!
```

## Teknisk implementation

### Steg 1: Definiera ortshierarki

Lägg till en lista `MAIN_CITIES` i båda filerna:
```typescript
const MAIN_CITIES = ['Stockholm', 'Uppsala'];
const LARGE_AREAS = ['Nacka', 'Solna', 'Täby', 'Huddinge', 'Sundbyberg', 'Sollentuna', 'Knivsta', 'Enköping', ...];
```

### Steg 2: Uppdatera titelmallarna

Istället för en enda template per tjänst, välj template baserat på ortsnivå:

```typescript
// Pseudokod
if (MAIN_CITIES.includes(area)) {
  title = `Boka Snickare i ${area} ★ Hela ${area} län · ROT 30% · Fri offert`
} else if (LARGE_AREAS.includes(area)) {
  title = `Boka Snickare i ${area} ★ Alla byggtjänster · ROT 30% · Fri offert`
} else {
  const parent = getRegion(area); // "Uppsala" eller "Stockholm"
  title = `Snickare i ${area} · Nära dig i ${parent} · ROT 30%`
}
```

### Steg 3: Säljande titlar (från föregående plan)

Samtidigt byter vi till mer säljande formuleringar:
- "Alla byggtjänster" istället för "Kök, garderob & altan"
- "Boka" som action-ord
- RUT korrigerat till 50% för städ/flytt
- "5/5 betyg" som förtroende-signal

## Filer att ändra

| Fil | Vad |
|-----|-----|
| `src/data/localServiceData.ts` | Uppdatera `titleTemplatesBase` + `descriptionTemplatesBase` med 3-nivå-logik (rad 660–750) |
| `vite-plugin-prerender-local.ts` | Uppdatera `getTitle()` + `getDescription()` med samma 3-nivå-logik (rad 219–310) |

Resultat: Google ser tydlig skillnad mellan "Snickare i Uppsala" (HUB, hela länet) och "Snickare i Gamla Uppsala" (lokal, nära dig i Uppsala). Huvudorten rankas för breda sökningar, sub-områden fångar nischade lokala sökningar.

