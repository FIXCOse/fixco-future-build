

## Plan: Konfetti ovanpå dialogen + email-splitting fix

### 1. Konfetti syns "bakom" — skuggade av dialog-overlayen

**Orsak**: Canvasen renderas korrekt med `z-index: 99999`, MEN Radix Dialog har en overlay med `bg-black/80` (80% svart). Overlayen ligger MELLAN canvasen och användaren — eller snarare, canvasen renderas i vanliga DOM-flödet medan Radix Dialog Portal skapar en ny stacking context. Konfettin syns genom den mörka overlayen och ser därför "skuggad" ut.

**Fix i `src/pages/QuotePublic.tsx`**:
- Flytta `<canvas>`-elementet till INUTI dialogen (efter dialog-content), eller bättre: rendera canvasen via en React Portal direkt till `document.body` EFTER alla andra element
- Enklaste lösningen: istället för att placera canvas i JSX, skapa canvasen dynamiskt i `fireConfetti` via `document.createElement('canvas')`, appenda den till `document.body`, och sätt `z-index: 2147483647` (max). Ta bort canvasen efter animationen. Detta garanterar att den ligger ovanpå allt, inklusive Radix-portaler.

### 2. Email bryts fortfarande i två delar

**Orsak**: Tabellen med `<td width="4" style="background:#16a34a">` tolkas fortfarande som en visuell "citat"-markör av iOS Mail. Problemet är inte `border-left` specifikt — det är mönstret av en smal färgad kolumn bredvid text som iOS tolkar som blockquote.

**Fix i `supabase/functions/accept-quote-public/index.ts`**:
- Byt ut den smala gröna `<td width="4">` mot en helt annan design: lägg en grön linje OVANFÖR rutan istället (top-border), eller använd en fullbredd grön bakgrund med padding
- Konkret: ersätt `<table><tr><td width="4" bg green/><td>innehåll</td></tr></table>` med en enkel `<table width="100%"><tr><td style="background:#f0fdf4;padding:16px;border-top:4px solid #16a34a;border-radius:8px;">innehåll</td></tr></table>`
- Detta ger samma gröna accent men utan den vertikala vänster-linje som iOS tolkar som citat
- Samma ändring i både `buildAdminHtml` och `sendCustomerConfirmation`

### Filändringar

| Fil | Ändring |
|-----|---------|
| `src/pages/QuotePublic.tsx` | Dynamiskt canvas via `document.createElement` i `fireConfetti`, ta bort statisk `<canvas>` från JSX |
| `supabase/functions/accept-quote-public/index.ts` | Byt vertikal grön linje → `border-top: 4px solid` i båda mailtemplates |

