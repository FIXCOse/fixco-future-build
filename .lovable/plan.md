

## Plan: Ta bort telefonnummer + kundbekräftelsemail + konfetti-popup

### 1. Ta bort telefonnummer från alla mail-templates och PDF

**10 filer, ~20 rader:**

| Fil | Rad | Ändring |
|-----|-----|---------|
| `supabase/functions/send-test-accept-email/index.ts` | 60 | `Fixco · info@fixco.se · 079-335 02 28` → `Fixco · info@fixco.se` |
| `supabase/functions/send-quote-email/index.ts` | 157 | Ta bort `<li>Telefon: 079-335 02 28</li>` |
| `supabase/functions/send-reaccept-email/index.ts` | 113 | Ta bort `eller ring 079-335 02 28` |
| `supabase/functions/send-followup-email/index.ts` | 84 | Ta bort `📞 079-335 02 28` |
| `supabase/functions/notify-job-status/index.ts` | 88-91, 97, 138, 146 | Ta bort alla 4 telefon-referenser (båda templates) |
| `supabase/functions/send-invoice-email/index.ts` | 79, 129 | Ta bort `079-335 02 28` från header + footer |
| `supabase/functions/send-customer-confirmation/index.ts` | 184-186 | Ta bort `08-123 456 78` länk |
| `supabase/functions/generate-quote-pdf/index.ts` | 112, 207 | Ta bort `Telefon: 08-123 456 78` |
| `supabase/functions/_shared/pdf-html-templates.ts` | 1189, 1266 | Ta bort `08-123 45 67` |
| `src/pages/QuotePublic.tsx` | 1016-1023 | Ta bort telefon-länk från success dialog |

### 2. Lägg till kundbekräftelsemail i `accept-quote-public`

I `supabase/functions/accept-quote-public/index.ts`, lägg till en `sendCustomerConfirmation()` funktion som skickar ett snyggt mail till `quote.customer.email` efter lyckad accept:

- **Ämne:** "Tack! Din offert från Fixco är bekräftad"
- **Design:** Samma card-layout som admin-notifieringen (grön gradient-header, checkmark, Fixco-branding)
- **Innehåll:** Offertnummer, titel, signaturnamn, nästa steg ("Vi kontaktar dig inom kort"), kontakt: info@fixco.se (ingen telefon)
- **Anropas** efter `notifyAdmin()` — för både normal accept och re-accept
- **Felsäkert:** `try/catch` runt, misslyckat mail stoppar inte flödet

### 3. Uppgradera konfetti-popup efter accepterad offert

I `src/pages/QuotePublic.tsx`:

- **Konfetti-effekten** — gör den mer dramatisk med flera vågor:
  - Första burst: 150 partiklar, spread 100, guld/gröna färger
  - Andra burst (300ms delay): 100 partiklar från vänster
  - Tredje burst (500ms delay): 100 partiklar från höger
  - Använd `canvas-confetti` (redan installerat)

- **Success Dialog** — uppgradera till en mer festlig design:
  - Animerad grön checkmark med `framer-motion` (scale + fade in)
  - Rubrik: **"Stort tack för ditt förtroende!"**
  - Text: *"Vi ser fram emot att köra igång med projektet. Vårt team kontaktar dig inom kort för att planera nästa steg."*
  - Ta bort telefonnumret från kontaktsektionen (bara info@fixco.se)
  - Snygga animationer med staggered fade-in för "Vad händer nu?"-listan

