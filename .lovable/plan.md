

# Kontaktformulär → Bokningsförfrågan via edge function

## Nuläge
Kontaktformuläret sparar till `leads`-tabellen. Du vill att det istället ska gå via samma flöde som offert/hembesök — dvs via `create-booking-with-quote` edge-funktionen — så allt hamnar i `bookings`-tabellen och syns på samma ställe i admin.

## Ändring

### `src/pages/Contact.tsx`
Ersätt `supabase.from('leads').insert(...)` (rad 47-58) med ett `fetch`-anrop till edge-funktionen `create-booking-with-quote`:

- `mode: 'quote'`
- `service_slug: formData.service || 'kontakt'`
- `fields: { description: formData.message, service_name: formData.service || 'Kontaktformulär' }`
- Skicka `name`, `email`, `phone`, `address` som vanligt

Detta gör att kontaktförfrågningar hamnar i `bookings`-tabellen med `service_slug: 'kontakt'` och `mode: 'quote'`, och syns direkt bland alla andra bokningsförfrågningar i admin-panelen.

