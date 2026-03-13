

# Krav på fält + utökad filuppladdning i ServiceRequestModal

## Ändringar

### 1. `src/features/requests/bookingValidation.ts` — Gör adress, postnummer, ort och projektdetaljer obligatoriska

Nuläge: `address`, `postal_code`, `city` är alla `.optional().or(z.literal(''))` i schemat — inga krav.

Ändring:
- `address` → obligatoriskt (ta bort `.optional().or(z.literal(''))`)
- `postal_code` → obligatoriskt (ta bort `.optional().or(z.literal(''))`)
- `city` → obligatoriskt (ta bort `.optional().or(z.literal(''))`)
- Lägg till `beskrivning` i schemat som obligatoriskt fält (min 10 tecken, "Beskriv vad du behöver hjälp med")

### 2. `src/features/requests/ServiceRequestModal.tsx` — Utökad filuppladdning + validering

**Filuppladdning**: Ändra `accept: "image/*"` till `accept: "image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"` på alla ställen där file-fält skapas (rad 304, 315, 1296). Uppdatera label från "Bilder (valfritt)" till "Filer (valfritt)" i translations.

**Validering av beskrivning**: I `onSubmit()` (rad 428), lägg till validering av `values.beskrivning` — om tomt, sätt error och returnera.

**Obligatoriska fält-markeringar**: Lägg till `*` i placeholder för adress, postnummer och ort (rad 1090, 1109, 1122).

### 3. Translations-uppdatering
- `imagesOptional` → `'Filer (valfritt)'` / `'Files (optional)'`
- `uploadImages` → `'Ladda upp filer (valfritt)'` / `'Upload files (optional)'`
- `address` → `'Adress *'` / `'Address *'`
- `postalCode` → `'Postnummer (123 45) *'` / `'Postal code (123 45) *'`
- `city` → `'Ort *'` / `'City *'`
- `describeProject` → `'Beskriv ditt projekt *'`

| Fil | Ändring |
|-----|---------|
| `bookingValidation.ts` | Gör address/postal_code/city obligatoriska, lägg till beskrivning-schema |
| `ServiceRequestModal.tsx` | Bredare accept för filer, uppdaterade labels med *, validera beskrivning vid submit |

