

## Plan: Tillägg av "Startavgift" och "Timprisrabatt" med överstrykningsfunktion i offertformuläret

### Vad vi bygger

Utöka `QuoteFormModal` och den publika offertvyn med tre nya funktioner:

1. **Timprisrabatt / Timprisavdrag** — en ny radtyp `fee` i LineItem som kan användas för att lägga till avgifter eller rabatter (t.ex. "Timprisrabatt -100 kr/h")
2. **Startavgift** — en snabbknapp som lägger till en `fee`-rad med "Startavgift 500 kr"
3. **Överstrykningsfunktion** — en toggle per rad som markerar raden som "genomstruken" (`strikethrough: true`), visuellt med `line-through` CSS. Beloppet räknas bort från totalen men visas kvar som en "rabatt" kunden ser

### Teknisk design

**LineItem-typen utökas:**
```typescript
type LineItem = {
  type: 'work' | 'material' | 'fee';
  description: string;
  quantity: number;
  unit?: string;
  price: number;
  productUrl?: string;
  imageUrl?: string;
  supplierName?: string;
  strikethrough?: boolean;  // NY: visuellt genomstruken rad (0 kr i beräkning)
};
```

**Ändringar i `QuoteFormModal.tsx`:**

1. **Typ-dropdown**: Lägg till `fee` som val ("Avgift/Rabatt") i Select-listan (rad ~698)
2. **Snabbknappar**: Under "Lägg till rad"-knappen, lägg till:
   - "＋ Startavgift 500 kr" — skapar en `fee`-rad med description "Startavgift", quantity 1, price 500
   - "＋ Timprisrabatt" — skapar en `fee`-rad med description "Timprisrabatt", quantity 1, price -100 (negativt = rabatt)
3. **Strikethrough-toggle**: En liten knapp (ikon: `Strikethrough` från lucide) på varje rad som togglar `item.strikethrough`
4. **Beräkningslogik**: `calculateSubtotalWork` och `calculateSubtotalMaterial` ska ignorera rader med `strikethrough: true`. En ny `calculateFees()` summerar `fee`-rader (ej strikethrough). Genomstrukna rader summeras separat som "Rabatt/Avdrag" i sammanfattningen
5. **Visuell feedback**: Rader med `strikethrough: true` får `line-through` och `opacity-50` styling

**Ändringar i `QuotePublic.tsx`:**

- Rendera `fee`-rader som vanliga rader i offertsammanställningen
- Rader med `strikethrough: true` visas med `line-through`-styling och ett litet "RABATT"-badge, så kunden ser originalpriset genomstruket = upplever att de "sparar"

**Ändringar i PDF-generatorn (om relevant):**

- Samma logik: visa genomstrukna rader med strikethrough-text

### Filer som ändras

| Fil | Ändring |
|-----|---------|
| `src/components/admin/QuoteFormModal.tsx` | Ny `fee`-typ, snabbknappar, strikethrough-toggle, uppdaterad beräkningslogik |
| `src/pages/QuotePublic.tsx` | Rendera fee-rader och strikethrough-styling i publika vyn |

### Ingen databasändring behövs
`items` är redan en JSONB-kolumn som lagrar godtyckliga radobjekt. De nya fälten (`type: 'fee'`, `strikethrough: boolean`) sparas direkt i JSONB utan schemaändring.

