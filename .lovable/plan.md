

## Analys: Matten stämmer inte — Timprisrabatt räknas inte med

### Vad som händer

Från skärmdumpen syns:
- **Arbetskostnad: 766 kr**
- **Överstruket (visas som rabatt): 516 kr** (= startavgift 500 + timprisrabatt 16)
- **Delsumma: 766 kr** (timprisrabatten påverkar inte)

Problemet: Både startavgiften (500 kr) och timprisrabatten (16 kr) är markerade som **strikethrough**, vilket betyder att de **helt exkluderas från beräkningen**. Strikethrough-funktionen är designad för att visa "bortskänkta" poster — de syns men räknas inte.

Timprisrabatten borde istället vara en **negativ avgift (-16 kr)** som faktiskt dras av från totalen, utan strikethrough.

### Lösning

Problemet är delvis UX — det är för lätt att förväxla "strikethrough" (visuell gåva, exkluderas) med "rabatt" (ska minska priset). Jag föreslår:

**1. Ändra snabbknappen "Timprisrabatt"** — säkerställ att den alltid skapar en rad med **negativt pris** och tydlig beskrivning:
- `{ type: 'fee', description: 'Timprisrabatt', quantity: 1, unit: 'kr', price: -100 }` (redan korrekt)

**2. Lägg till validering/varning** — om en `fee`-rad med negativt pris markeras som strikethrough, visa en varning: "Obs: Denna rabatt kommer inte att dras av från totalen om den är överstruken"

**3. Förbättra sammanfattningen** — separera negativa fees (rabatter) och positiva fees (avgifter) visuellt:
- Avgifter: visas som vanligt
- Rabatter (negativt belopp): visas i grönt med minus-tecken
- Genomstrukna poster: visas som idag (line-through)

### Filer som ändras

| Fil | Ändring |
|-----|---------|
| `src/components/admin/QuoteFormModal.tsx` | Varning vid strikethrough på negativ fee, förbättrad sammanfattning med separat rabatt-rad |

### Vad du behöver göra nu

Dina befintliga poster på den offerten behöver korrigeras manuellt:
- **Startavgift 500 kr**: behåll strikethrough (korrekt — visas som bortskänkt)
- **Timprisrabatt**: ta bort strikethrough, ändra priset till **-16** (negativt) — då dras 16 kr av från delsumman

Resultatet blir: Delsumma = 766 - 16 = 750, Moms = 187.5, Totalt = 937.5 kr

