

# Plan: Tillåt alla filtyper vid bokning

## Problem
De flesta tjänster i `serviceConfig.ts` har `accept: "image/*"` på file-fältet — kunder kan alltså bara ladda upp bilder, inte PDF:er, Word-dokument eller andra filer. Bara fallback-tjänsten (okänd tjänst) har den bredare accept-strängen.

## Åtgärd

### 1. Uppdatera alla file-fält i `serviceConfig.ts`
Ändra `accept: "image/*"` till `accept: "image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.heic"` på ALLA tjänster (ca 15 ställen).

### 2. Uppdatera fallback i `ServiceRequestModal.tsx`
Säkerställ att fallback-accept och den automatiskt tillagda file-fältet (rad 314-320) också har samma breda accept-sträng inklusive `.heic`.

### 3. Uppdatera label
Ändra "Bilder (valfritt)" → "Bilder & filer (valfritt)" på alla ställen, så att kunden förstår att de kan ladda upp mer än bara bilder.

## Filer som ändras

| Fil | Ändring |
|---|---|
| `src/features/requests/serviceConfig.ts` | Uppdatera `accept` på alla ~15 file-fält |
| `src/features/requests/ServiceRequestModal.tsx` | Uppdatera fallback accept + label |

