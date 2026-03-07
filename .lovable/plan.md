

## Plan: Skicka testmail — bekräftelse efter accepterad offert

### Vad vi gör

Skapar en enkel edge function `send-test-accept-email` som skickar ett exempelmail till `imedashviliomar@gmail.com` som visar exakt hur bekräftelsemailet ser ut när en kund accepterar en offert.

### Nuläge

Det nuvarande bekräftelsemailet (i `accept-quote-public/index.ts`, rad 193-200) är extremt enkelt — bara några `<p>`-taggar utan styling:

```html
<h2>Offert accepterad!</h2>
<p><strong>Offert:</strong> Q-2026-042 – Badrumsrenovering</p>
<p><strong>Kund:</strong> Test Kund</p>
<p><strong>Signatur:</strong> Test Kund</p>
<p><strong>Tidpunkt:</strong> 2026-03-07 01:30</p>
<p>Projekt har skapats automatiskt.</p>
```

### Åtgärd

1. **Skapa `supabase/functions/send-test-accept-email/index.ts`** — en engångs-edge function som:
   - Skickar ett styled bekräftelsemail via Resend till `imedashviliomar@gmail.com`
   - Använder samma design som offertmailens template (header med gradient, card-layout, Fixco-branding)
   - Visar exempeldata (offertnummer, kundnamn, signatur, tidpunkt, projektinfo)

2. **Deploya och anropa** funktionen en gång för att skicka testet

3. **Ta bort** funktionen efteråt (eller behåll för framtida tester)

### Alternativ fråga

Vill du att jag också **uppgraderar det riktiga bekräftelsemailet** i `accept-quote-public` till samma snygga design? Just nu är det väldigt basic jämfört med offertmailens template.

