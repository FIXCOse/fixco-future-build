

# Fix: Kontaktformulär och Boka Hembesök i Admin

## Problem identifierat

**1. Kontaktformuläret (`/kontakt`) sparar ingenting**
Formuläret är fejk — det gör bara en `setTimeout` och visar en toast. Ingen data skickas till databasen. Allt folk skickat via kontaktsidan har gått förlorat.

**2. Boka Hembesök (`/boka-hembesok`) fungerar tekniskt**
Den anropar edge-funktionen `create-booking-with-quote` som sparar till `bookings`-tabellen. MEN: det finns 0 bokningar med `mode='home_visit'` i databasen — alla 41 bokningar har `mode='quote'`. Det kan bero på att telefonnummervalideringen i edge-funktionen kräver exakt format (`/^(\+46|0)[-\s]?7[0-9]...$/`) och BookVisit-sidan inte validerar innan den skickar, så användaren får ett kryptiskt fel.

**3. Admin-panelen visar data på fel flik**
Du är på `?tab=active&status=draft` som filtrerar offerter med draft-status. Nya bokningsförfrågningar syns under `?tab=requests`.

## Befintlig data i databasen
- **41 bokningar** i `bookings`-tabellen (alla `mode='quote'`, alla `status='new'`)
- **7 leads** i `leads`-tabellen (från AI Lab och AI Concierge)
- **0 kontaktformulärsmeddelanden** — de har aldrig sparats

## Plan

### 1. Kontaktformuläret → Spara som bokning
**Fil: `src/pages/Contact.tsx`**
- Ersätt den fejkade `setTimeout`-logiken med ett riktigt anrop till edge-funktionen `create-booking-with-quote`
- Skicka med `mode: 'quote'`, `service_slug: formData.service || 'kontakt'`
- Inkludera meddelande och adress i `fields`
- Resultatet syns direkt i admin under "Förfrågningar"

### 2. BookVisit telefonnummer-validering
**Fil: `src/pages/BookVisit.tsx`**
- Lägg till grundläggande klient-validering av telefonnummer innan formuläret skickas
- Visa tydligt felmeddelande om formatet är fel

### 3. Kontaktformuläret som alternativ: Spara till `leads`-tabellen
Istället för att gå via edge-funktionen kan kontaktformuläret skriva direkt till `leads`-tabellen (som redan har `INSERT`-policy för `public`). Detta separerar "kontaktförfrågningar" från "offertförfrågningar" och ger admin en tydligare bild.

Rekommendation: **Spara kontaktformuläret till `leads`-tabellen** med `source: 'contact_form'` — det finns redan en admin-sida (`/admin/leads`) som visar leads. Och se till att admin-dashboard-sidan och navigationen lyfter fram detta.

| Fil | Ändring |
|-----|---------|
| `src/pages/Contact.tsx` | Ersätt fejk-submit med insert till `leads`-tabellen |
| `src/pages/BookVisit.tsx` | Lägg till telefonnummer-validering före submit |
| `src/components/AdminDashboardContent.tsx` | Lägg till räknare för nya leads + bokningar |

