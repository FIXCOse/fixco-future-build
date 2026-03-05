

## Plan: Realtids-notifieringar till admin vid kundaktivitet

### Vad vi gör
Lägger till ett Resend-mail till `imedashviliomar@gmail.com` i varje edge function som hanterar kundinteraktion med en offert. Mailet skickas direkt (fire-and-forget) efter att kundaktionen registrerats.

### Edge functions som ändras

| Funktion | Händelse | Ämnesrad |
|----------|----------|----------|
| `get-quote-public` | Kund öppnar offert | 👁️ Offert [nummer] öppnad av [kundnamn] |
| `accept-quote-public` | Kund accepterar | ✅ Offert [nummer] accepterad av [kundnamn] |
| `reject-quote-public` | Kund avböjer | ❌ Offert [nummer] avböjd av [kundnamn] |
| `request-change-quote-public` | Kund begär ändring | ✏️ Ändring begärd på offert [nummer] |
| `ask-question-quote` | Kund ställer fråga | ❓ Ny fråga om offert [nummer] |

### Teknisk approach per funktion

1. Importera Resend SDK
2. Hämta offertnummer + kundinfo (via JOIN på `customers`) — de flesta har redan quote-data tillgänglig
3. Skicka mail via Resend (fire-and-forget, `catch` loggar fel men blockerar inte)
4. Mailet innehåller: offertnamn, kundnamn, tidpunkt, och en kort beskrivning av vad som hände

### Inga nya filer, inga databasändringar
Resend + `RESEND_API_KEY` är redan konfigurerat. Avsändare: `Fixco <info@fixco.se>`.

