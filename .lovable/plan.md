

## Plan: Lägg till "Arbetets omfattning" under Offerttitel

### Vad
Ett nytt fritextfält **"Arbetets omfattning"** placeras direkt efter Offerttitel-fältet i admin-formuläret. Kort beskrivning av arbetet som visas för kunden i publika vyn och PDF.

### Lagring
Samma mönster som `customer_notes` — sparas som `{ type: '_meta', key: 'scope_description', value: '...' }` i items-arrayen. Ingen databasändring behövs.

### Filer som ändras

**1. `src/components/admin/QuoteFormModal.tsx`**
- Nytt state `scopeDescription`
- Textarea efter Offerttitel (rad ~522, före "Giltig till") med label "Arbetets omfattning" och placeholder "Kort beskrivning av arbetet..."
- Spara som `_meta` key `scope_description` i `itemsWithMeta`
- Vid edit: läs ut metadata och sätt state
- Vid reset: nollställ

**2. `src/pages/QuotePublic.tsx`**
- Läs `scope_description` från items-metadata
- Visa direkt under offerttiteln, före radposterna

**3. `src/lib/generateQuotePdf.ts`**
- Läs `scope_description` från items-metadata
- Visa under titeln i PDF:en

