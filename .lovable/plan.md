

## Plan: Fix konfetti på mobil

### Problem
På mobilen kan flera saker blockera konfettin:
1. CSS-regeln `body:has([role="dialog"]) { position: fixed !important; }` i `index.css` kan förstöra `position: fixed` på canvasen i vissa mobilwebbläsare (Safari)
2. Canvas-elementet saknar explicita `width`/`height`-attribut — bara CSS-storlek. På mobil kan detta ge en 0×0 renderingsyta
3. `startVelocity: 45` skjuter partiklar utanför den lilla mobilskärmen

### Fix i `src/pages/QuotePublic.tsx`
- Sätt `canvas.width = window.innerWidth` och `canvas.height = window.innerHeight` explicit (pixelstorlek, inte bara CSS)
- Skala ner `startVelocity` och `particleCount` på mobil (`window.innerWidth < 768`)
- Lägg till `canvas.setAttribute('aria-hidden', 'true')` för tillgänglighet

### Fix i `src/index.css`
- Ändra `body:has([role="dialog"]) { position: fixed !important; }` till att INTE appliceras på quote-sidan, genom att undanta `body[data-page-type="quote"]` — eller ta bort `position: fixed` helt och ersätt med `overflow: hidden` (som redan finns)

| Fil | Ändring |
|-----|---------|
| `src/pages/QuotePublic.tsx` | Explicit canvas-dimensioner + mobilanpassade partikelparametrar |
| `src/index.css` | Ta bort `position: fixed` från body-modal-regeln (bryter fixed-positionering på mobil) |

