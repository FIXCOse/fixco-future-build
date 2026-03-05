

## Plan: Lägg till noteringar vid Radposter (behåll Ytterligare information)

### Problem
`notes` sparas aldrig till databasen — det är bara ett lokalt state. Dessutom vill användaren ha ett separat noteringsfält direkt under radposterna (utöver det befintliga under "Ytterligare information").

### Lösning

Två separata noteringsfält:
1. **Nytt fält "Notering till kund"** — placeras direkt efter radposterna i Radposter-kortet. Sparas som `_meta` i items-arrayen och visas för kunden i publika vyn + PDF.
2. **Befintligt "Anteckningar"** under Ytterligare information — sparas också som `_meta` men markeras som intern (visas ej för kund).

### Filer som ändras

**1. `src/components/admin/QuoteFormModal.tsx`**
- Lägg till nytt state `customerNotes` för kundsynliga noteringar
- Lägg till Textarea direkt efter items-listan (rad 676, innan `</Card>`) med label "Notering till kund" och placeholder "Visas på offerten för kunden..."
- Spara som `{ type: '_meta', key: 'customer_notes', value: '...' }` i `itemsWithMeta`
- Spara befintliga `notes` som `{ type: '_meta', key: 'internal_notes', value: '...' }` i `itemsWithMeta`
- Vid edit: läs ut båda metadata-fälten och återställ state

**2. `src/pages/QuotePublic.tsx`**
- Läs `customer_notes` från items-metadata
- Visa texten under radposterna (efter "Vad ingår"-sektionen) med en enkel stil

**3. `src/lib/generateQuotePdf.ts`**
- Läs `customer_notes` från items-metadata
- Visa texten i PDF:en under radposterna

### Resultat
- Kundnoteringar visas på offerten (publik + PDF)
- Interna anteckningar sparas men visas bara i admin
- Befintligt "Ytterligare information"-kort behålls oförändrat

