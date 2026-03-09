

## Plan: Spåra kundens språk genom hela flödet (bokning → offert → mail)

### Problem
När en kund bokar via `/en`-sidan sparas inget språk. Alla mail (bekräftelse, offert, acceptans) skickas på svenska oavsett.

### Lösning — 4 steg

**1. Databas: Lägg till `locale`-kolumn på `bookings` och `customers`**
- `ALTER TABLE bookings ADD COLUMN locale text DEFAULT 'sv';`
- `ALTER TABLE customers ADD COLUMN preferred_locale text DEFAULT 'sv';`
- Offerten (`quotes_new`) har redan `payload`-stöd, men vi lägger till `locale` där också: `ALTER TABLE quotes_new ADD COLUMN locale text DEFAULT 'sv';`

**2. Frontend: Skicka `locale` från ServiceRequestModal**
- I `ServiceRequestModal.tsx` (rad ~471): lägg till `locale: modalLang` i `jsonPayload`

**3. Edge function `create-booking-with-quote`: Spara och vidarebefordra locale**
- Acceptera `locale` i request schema (default `'sv'`)
- Spara `locale` på `bookings`-raden
- Uppdatera `customers.preferred_locale` vid upsert
- Skicka `locale` vidare till `notify-admin-booking` och `send-customer-confirmation`

**4. Edge function `send-customer-confirmation`: Tvåspråkig mail**
- Ta emot `locale` parameter
- Skapa engelska versioner av alla textsträngar (subject, modeLabel, urgencyText, brödtext)
- Välj rätt språk baserat på `locale`

**5. Edge function `send-quote-email-new`: Tvåspråkig offertmail**
- Hämta `locale` från `quotes_new`-raden
- Skapa engelska versioner av subject, brödtext, CTA-knappar
- "Visa och acceptera offert" → "View and accept quote"

**6. Edge function `accept-quote-public`: Tvåspråkig kundbekräftelse**
- Hämta `locale` från `quotes_new`-raden
- Kundbekräftelsemailet (`sendCustomerConfirmation`) anpassas till rätt språk

**7. Offertskapa-flöde i admin**
- När admin skapar offert från en bokning, kopiera `locale` från bokningen till `quotes_new.locale`

### Filer som ändras
| Fil | Ändring |
|-----|---------|
| DB migration | 3 ADD COLUMN |
| `src/features/requests/ServiceRequestModal.tsx` | Lägg till `locale: modalLang` i payload |
| `supabase/functions/create-booking-with-quote/index.ts` | Spara locale, vidarebefordra |
| `supabase/functions/send-customer-confirmation/index.ts` | Tvåspråkig mailtemplate |
| `supabase/functions/send-quote-email-new/index.ts` | Tvåspråkig offertmail |
| `supabase/functions/accept-quote-public/index.ts` | Tvåspråkig bekräftelsemail |

### Inga nya edge functions behövs
All logik läggs till i befintliga funktioner.

