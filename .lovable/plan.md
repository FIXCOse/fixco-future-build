

## Felsökning & Fix: Konfetti + Email

### Problem identifierade via Edge Function logs

**1. Inga mail skickas** — Loggen visar:
```
Failed to create project: Key (customer_id)=(b1ceee12-...) is not present in table "profiles"
```
Projektskapandet misslyckas med FK-constraint. I den kodvägen (`project_creation_failed`, rad 199-209 i edge function) anropas **varken** `notifyAdmin()` eller `sendCustomerConfirmation()` — de finns bara i den normala success-vägen (rad 212-219). Kunden landar i `project_creation_failed`-grenen och inga mail skickas.

**2. Konfetti syns inte** — Koden ser korrekt ut med `zIndex: 9999`, men Radix Dialog skapar en overlay-portal. Problemet är sannolikt att:
- Confetti-partiklarna faller för snabbt (standard gravity=1, ~2 sek livslängd)
- Dialog-overlayen (halvtransparent bakgrund) gör dem svåra att se
- Behöver skapa ett dedikerat canvas INUTI dialog-portalen, eller öka `ticks` och `gravity` för att partiklarna hänger kvar längre

### Ändringar

**1. `supabase/functions/accept-quote-public/index.ts`** — Flytta email-anropen
- Flytta `notifyAdmin()` och `sendCustomerConfirmation()` till INNAN projektskapandet (rad ~188, efter offert-uppdateringen lyckats)
- Alternativt: lägg till email-anrop även i `project_creation_failed`-grenen (rad 200-209)
- Bäst: skicka mailen direkt efter offerten uppdaterats till `accepted` (rad 187), oavsett om projektet skapas eller inte

**2. `src/pages/QuotePublic.tsx`** — Fixa konfetti-synlighet
- Öka `ticks` till 300 (standard 200) för längre livstid
- Sänk `gravity` till 0.6 för att partiklar faller långsammare
- Öka `startVelocity` till 45 för högre kast
- Lägg till `scalar: 1.2` för större partiklar
- Öka delay till 500ms så dialogen hunnit rendera och övergångsanimationen är klar
- Lägg till ytterligare vågor vid 1000ms och 1500ms för en mer utdragen effekt

