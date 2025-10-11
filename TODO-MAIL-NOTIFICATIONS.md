# TODO: Mail & Kontaktuppgifter

## ⚠️ Måste uppdateras innan produktion

### 1. Mail-avsändare
- [ ] Uppdatera "from" address i `supabase/functions/notify-job-status/index.ts`
  - Nuvarande: `"Fixco <onboarding@resend.dev>"`
  - Ändra till: `"Fixco <info@fixco.se>"` (eller annan validerad domän)

### 2. Kontaktuppgifter i mail-templates
Uppdatera i `supabase/functions/notify-job-status/index.ts`:

**Nuvarande tillfälliga värden:**
- Telefon: `08-123 456 78`
- Email: `info@fixco.se`
- Webb: `www.fixco.se`

**Vad som behöver verifieras/ändras:**
- [ ] Rätt telefonnummer
- [ ] Rätt email-adress
- [ ] Rätt webbadress
- [ ] Kanske lägga till organisationsnummer?
- [ ] Kanske lägga till fysisk adress?

### 3. Resend Domain Validation
- [ ] Validera domän på https://resend.com/domains
- [ ] Skapa ny API-nyckel för produktionsmiljö om behövs

### 4. Mail-innehåll/copy
- [ ] Granska och justera tonalitet i båda mail-templates
- [ ] Eventuellt lägga till företagslogotyp
- [ ] Eventuellt lägga till footer med länkar

---

## Relaterade filer
- `supabase/functions/notify-job-status/index.ts` - Mail-templates och avsändare
- `src/i18n/locales/sv.json` / `en.json` - Om mail-texter ska internationaliseras
