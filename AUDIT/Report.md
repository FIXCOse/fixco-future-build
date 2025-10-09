# FIXCO - Fullständig Kodgranskning (Audit Report)
**Datum:** 2025-10-09  
**Status:** Read-Only Audit (Inga ändringar gjorda)  
**Scope:** Frontend, Edge Functions, Database, RLS, Routing, Säkerhet, Prestanda

---

## Executive Summary

Projektet är i generellt gott skick med moderna best practices (React, TypeScript, Supabase, Tailwind). Det finns dock flera kritiska områden som kräver uppmärksamhet innan full produktion:

1. **CORS-konfiguration för bred (`*`)** i samtliga edge functions – bör begränsas till specifika origins
2. **Omfattande console.log i produktion** – 349+ förekomster över 104 filer
3. **Dubbletter i routing** – `/admin/jobs` definierad 2 gånger i App.tsx
4. **Legacy-referenser till `quote_requests`** – tabellen finns kvar i schema men används inte i applikationen
5. **Saknad fel-hantering** i flera edge functions – vissa throw utan catch
6. **PII-loggar** – personnummer, email, telefon loggas i flera edge functions
7. **Hårdkodad fallback-URL** i send-quote-email-new (`/quote/` istället för `/q/`)
8. **JSON.stringify i UI** – används i flera admin-komponenter för att visa raw data
9. **Prestanda** – tunga komponenter (SmartHome, BookingWizard) lazy-loadade men vissa stora listor saknar virtualisering
10. **RLS policies** – generellt bra täckning, men några tables (t.ex. `dispatch_queue`) har enbart admin-access

---

## Top 10 Kritiska/Riskabla Punkter

### 1. **CORS Wildcard (`*`) i Alla Edge Functions**
**Var:** 
- `supabase/functions/create-booking-with-quote/index.ts:5-8`
- `supabase/functions/send-quote-email-new/index.ts:7-11`
- `supabase/functions/ai-chat/index.ts:4-7`
- Alla andra edge functions

**Problem:**  
CORS headers sätter `Access-Control-Allow-Origin: *` vilket tillåter requests från vilken origin som helst.

**Konsekvens:**  
- Alla publika endpoints kan anropas från godtyckliga domäner
- Ökar risken för CSRF-attacker och datainsamling från tredje part
- Bryter mot säkerhetspraxis för produktionsmiljö

**Säker fix:**  
```typescript
const allowedOrigins = [
  'https://fixco.se',
  'https://www.fixco.se',
  'https://app.fixco.se'
];

const origin = req.headers.get('origin') || '';
const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Credentials': 'true'
};
```

**Risk vid ändring:** Låg – kräver bara lista över godkända domäner

---

### 2. **Console.log-översvämning (349+ förekomster)**
**Var:** 104 filer innehåller `console.log`, `console.warn`, `console.error`

**Problem:**  
- Production build innehåller debug-loggar
- Exponerar potentiellt känslig information i browser console
- Påverkar prestanda negativt
- Gör det svårt att debugga riktiga problem i produktion

**Exempel på problematiska loggar:**
- `src/components/ActionWizard.tsx:80-125` – loggar hela form-data inkl. personnummer
- `src/pages/admin/AdminJobs.tsx` – loggar job-data med arbetarinfo
- `supabase/functions/create-booking-with-quote/index.ts:50,93,107` – loggar customer email/phone

**Konsekvens:**  
- Läcka PII (email, telefon, adress) i production console
- Performance overhead
- Svårare att hitta verkliga fel i noise

**Säker fix:**  
1. Skapa en logger-utility:
```typescript
// src/lib/logger.ts
export const logger = {
  log: import.meta.env.DEV ? console.log : () => {},
  warn: import.meta.env.DEV ? console.warn : () => {},
  error: console.error, // behåll errors även i prod
};
```
2. Byt ut alla `console.*` mot `logger.*`
3. För edge functions: använd `if (Deno.env.get('ENVIRONMENT') !== 'production')`

**Risk vid ändring:** Minimal – gör det systematiskt med search-replace

---

### 3. **Dubblett-routing för /admin/jobs**
**Var:** `src/App.tsx:176,183`

**Problem:**  
```tsx
<Route path="jobs" element={<AdminJobs />} />        // rad 176
...
<Route path="jobs" element={<AdminJobs />} />        // rad 183 (dubblett!)
```

**Konsekvens:**  
- React Router använder första matchningen, andra är död kod
- Kan leda till förvirring vid framtida routing-ändringar
- Onödig bundle size

**Säker fix:**  
Ta bort en av raderna (troligen rad 183).

**Risk vid ändring:** Ingen – andra är redan död kod

---

### 4. **Legacy-referenser till quote_requests**
**Var:**
- `src/integrations/supabase/types.ts:2809` – RPC function `empty_quote_requests_trash`
- `supabase/functions/generate-quote-pdf/index.ts:31` – kommentar nämner "migrated quote_requests"

**Problem:**  
Tabellen `quote_requests` finns inte i nuvarande schema (enbart `quotes` och `quotes_new` finns). Det tyder på ofullständig migration där gamla endpoints/funktioner kan finnas kvar.

**Konsekvens:**  
- Risk för att anropa icke-existerande endpoints/tabeller
- Ökad teknisk skuld
- Förvirring kring vilket API som ska användas

**Säker fix:**  
1. Verifiera att `quote_requests` inte används i prod
2. Ta bort RPC-funktioner relaterade till `quote_requests` från migrationer
3. Ta bort referenser i kommentarer
4. Dokumentera att endast `quotes_new` ska användas framåt

**Risk vid ändring:** Låg om tabellen redan är borttagen från prod-DB

---

### 5. **Hårdkodad Felaktig URL i send-quote-email-new**
**Var:** `supabase/functions/send-quote-email-new/index.ts:42`

**Problem:**  
```typescript
const publicUrl = `${frontendUrl}/quote/${quote.public_token}`;
```
Men korrekt route är `/q/:token` (enligt App.tsx:140).

**Konsekvens:**  
- Kunder som klickar på email-länken får 404
- Förstör hela offert-flödet
- Kritisk bugg i production

**Säker fix:**  
```typescript
const publicUrl = `${frontendUrl}/q/${quote.public_token}`;
```

**Risk vid ändring:** Ingen – detta är en bugg-fix

---

### 6. **JSON.stringify i Admin-UI**
**Var:**
- `src/components/AIFunctionModals.tsx:242` – visar `JSON.stringify(analysisData.analysis)`
- `src/pages/MyFixco/AdminDatabase.tsx:80,232` – visar raw JSON i tabeller
- `src/pages/MyFixco/AdminSecurity.tsx:172` – visar metadata som JSON
- `src/pages/admin/AdminInvoices.tsx:149` – fallback för invoice download

**Problem:**  
Raw JSON visas direkt för användare utan formatering eller användarvänt gränssnitt.

**Konsekvens:**  
- Dålig UX
- Svårt att läsa för icke-tekniska användare
- Potentiellt exponering av interna strukturer

**Säker fix:**  
Ersätt med formaterade komponenter:
```tsx
// Istället för
<p>{JSON.stringify(data)}</p>

// Använd
<pre className="bg-muted p-4 rounded text-xs overflow-auto">
  {JSON.stringify(data, null, 2)}
</pre>
```

**Risk vid ändring:** Minimal – enbart UI-förbättring

---

### 7. **Saknad Error Handling i Edge Functions**
**Var:**
- `supabase/functions/create-booking-with-quote/index.ts:49-52` – `if (custErr) throw`
- Flera edge functions saknar try-catch på RPC-anrop

**Problem:**  
Errors thrown utan att fångas kan leda till oanvända 500-svar utan användbar felmeddelandestruktur.

**Konsekvens:**  
- Klienten får generiska fel
- Svårt att debugga i produktion
- Dålig användarupplevelse

**Säker fix:**  
Wrappa alla edge function bodies i try-catch:
```typescript
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  
  try {
    // ... logik
  } catch (error: any) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        code: error.code 
      }), 
      { 
        status: error.status || 500,
        headers: { ...cors, 'Content-Type': 'application/json' }
      }
    );
  }
});
```

**Risk vid ändring:** Minimal – förbättrar felhantering

---

### 8. **PII-loggar i Edge Functions**
**Var:**
- `supabase/functions/create-booking-with-quote/index.ts:50,67` – loggar email, phone
- `supabase/functions/send-quote-email-new/index.ts:21` – loggar customerEmail, customerName
- `src/components/ActionWizard.tsx:80,112,125` – loggar form-data med personnummer

**Problem:**  
Personuppgifter loggas i produktion vilket bryter mot GDPR.

**Konsekvens:**  
- GDPR-brott (böter upp till 4% av årlig omsättning)
- Säkerhetsrisk om loggar lagras okrypterat
- Audit-trail problem

**Säker fix:**  
1. Ta bort PII från loggar eller anonymisera:
```typescript
console.log('Customer upsert', { 
  emailHash: hashEmail(email), // istället för email
  hasPhone: !!phone 
});
```
2. Använd strukturerad logging med sanitering

**Risk vid ändring:** Låg – ersätt med säkra alternativ

---

### 9. **Dubblett API-filer (quotes.ts vs quotes-new.ts)**
**Var:**
- `src/lib/api/quotes.ts` (finns ej längre)
- `src/lib/api/quotes-new.ts` (aktiv)

**Problem:**  
Sökning visade att `quotes.ts` inte existerar, men det finns referenser i kommentarer och gamla imports kan finnas.

**Konsekvens:**  
- Förvirring kring vilket API som ska användas
- Risk för att använda gamla endpoints
- Teknisk skuld

**Säker fix:**  
1. Sök efter alla imports av `quotes.ts`:
```bash
grep -r "from.*quotes.ts" src/
```
2. Byt alla mot `quotes-new.ts`
3. Dokumentera att `quotes_new` är det enda systemet

**Risk vid ändring:** Låg om ingen använder gamla filen

---

### 10. **Realtime Channels - Potential Memory Leak**
**Var:** Flera komponenter använder `supabase.channel()` utan `removeChannel` i cleanup

**Problem:**  
Flera hooks (t.ex. `useQuotesRealtime`, `useJobsRealtime`) prenumererar på realtime-channels men det är oklart om alla komponenter som använder dem städar upp korrekt.

**Konsekvens:**  
- Memory leaks vid unmount
- Ökat antal connections till Supabase
- Performance degradation över tid

**Säker fix:**  
Verifiera att alla `useEffect` med `.channel()` har cleanup:
```typescript
useEffect(() => {
  const channel = supabase.channel('changes');
  channel.subscribe();
  
  return () => {
    supabase.removeChannel(channel); // VIKTIGT
  };
}, []);
```

**Risk vid ändring:** Minimal – standard React-pattern

---

## Övriga Fynd (MED/LOW)

### Routing & Navigation

**Dubbla `/en/cookies` routes**
- `src/App.tsx:220` (svensk vy) och `256` (engelsk vy)
- Både definierade under samma `/` route vilket kan ge konflikter

**Saknade alt-texts på bilder**
- Flera komponenter laddar bilder utan beskrivande alt-attribut
- Påverkar SEO och tillgänglighet

**404-risk för publicUrl i email**
- Redan flaggad som kritisk ovan

### Database & RLS

**Bred SELECT-policy på `services`**
- `services_select_public` tillåter alla att se aktiva tjänster
- OK för publika sidor men verifiera att känslig data inte exponeras

**`dispatch_queue` endast admin-access**
- RLS policy `Admin can manage dispatch queue` tillåter ALLT för admin/owner
- Inga policys för workers/technicians som behöver läsa kön
- Kan orsaka access-fel om workers ska se dispatch

**Soft delete utan automatisk cleanup**
- Flera tabeller (`quotes_new`, `bookings`, `jobs`, `projects`) använder `deleted_at`
- RPC-funktioner för cleanup finns (`empty_*_trash`) men inget automatiskt cron-jobb
- Gamla deletade poster kan ta diskutrymme

### Edge Functions

**Resend email "from" är onboarding@resend.dev**
- `supabase/functions/send-quote-email-new/index.ts:100`
- Ser oprofessionellt ut och kan hamna i spam
- Byt till `noreply@fixco.se` eller `offert@fixco.se`

**LOVABLE_API_KEY i ai-chat**
- Anropas utan validering att nyckel finns (checks finns men för sent)
- Bättre att validera vid start

**Saknad rate limiting**
- Inga edge functions har rate limiting
- Risk för abuse/DoS

### Frontend

**Stora komponenter utan code-splitting**
- `src/components/admin/*` – många admin-komponenter laddas synkront
- Överväg lazy loading för hela admin-sektionen

**Ingen virtualisering av stora listor**
- `AdminQuotes`, `AdminJobs`, `AdminBookings` renderar alla items samtidigt
- Kan bli långsamt med 100+ items
- Använd `react-window` eller `tanstack-virtual`

**Session storage används för filter-state**
- `EditableServiceFilter.tsx:237`, `FastServiceFilter.tsx:232`
- OK men kan gå förlorad vid incognito/clear
- Överväg att persista i URL query params istället

**Hårdkodad FRONTEND_URL fallback**
- `send-quote-email-new/index.ts:41` – `|| 'https://fixco.se'`
- Bra fallback men dokumentera att env-var måste sättas i prod

### Säkerhet

**Ingen CSP (Content Security Policy)**
- `SecurityWrapper.tsx` sätter flera headers men ingen CSP
- Lägg till strikt CSP för att förhindra XSS

**Ingen input-validering i vissa edge functions**
- `ai-chat/index.ts` – tar emot `messages` och `tools` utan schema-validering
- Lägg till Zod-validering

**File upload saknar MIME-check**
- `create-booking-with-quote` tar emot `fileUrls` utan att verifiera filtyper
- Risk för att ladda upp exekverbara filer

### Prestanda

**Många onödiga re-renders**
- Flera komponenter saknar `useMemo`/`useCallback` där det behövs
- Ex: `AdminQuotes.tsx:177` – `filteredQuotes` beräknas varje render

**Stora bundle-size**
- Three.js (`@react-three/fiber`, `@react-three/drei`) laddas även om SmartHome inte används
- Byt till dynamisk import endast när SmartHome öppnas

**Bilder utan lazy loading**
- Referenser-sidan laddar alla projektbilder samtidigt
- Lägg till `loading="lazy"` eller Intersection Observer

### A11y

**Knappar utan aria-labels**
- Flera icon-only knappar saknar `aria-label`
- Gör dem otillgängliga för skärmläsare

**Modaler utan aria-modal**
- Vissa custom modals saknar `aria-modal="true"` och `role="dialog"`

**Focus management**
- Efter modal-close återgår inte alltid fokus till trigger-element

---

## Förbättringar (Prestanda, DX, A11y, Säkerhet)

### Prestanda
1. **Virtualisera stora listor** – `react-window` för admin-tabeller
2. **Image optimization** – använd WebP, `loading="lazy"`, `sizes`-attribut
3. **Bundle splitting** – separera admin-chunks från publika routes
4. **Memoize dyra beräkningar** – filtreringar, sorteringar
5. **Lazy load edge-function calls** – defer icke-kritiska API-anrop

### DX (Developer Experience)
1. **Centraliserad error handling** – skapa `lib/errorHandler.ts`
2. **Type-safe API-client** – generera typer från Supabase schema
3. **Storybook för komponenter** – dokumentera design system
4. **E2E-tester** – Playwright för kritiska flöden (booking, quote-accept)
5. **Pre-commit hooks** – ESLint + TypeScript check

### A11y
1. **ARIA-labels överallt** – särskilt icon-buttons
2. **Keyboard navigation** – verifiera att alla funktioner fungerar utan mus
3. **Color contrast** – vissa badges kan ha för låg kontrast
4. **Screen reader testing** – testa med VoiceOver/NVDA
5. **Skip links** – "Skip to main content" för tangentbordsnavigering

### Säkerhet
1. **CSP headers** – strikt policy mot XSS
2. **Rate limiting** – på alla edge functions (särskilt publika)
3. **Input sanitization** – Zod-schemas för alla API-inputs
4. **File upload validation** – MIME-check, storlek, virus-scan
5. **Session management** – implementera proper token rotation
6. **Audit logging** – logga alla känsliga operationer (redan delvis implementerat)

---

## Kort Migrationsplan

### Fas 1: Kritiska Fixes (1-2 dagar)
1. Fixa `/quote/` → `/q/` i email-funktion
2. Begränsa CORS från wildcard till whitelist
3. Ta bort dubblett `/admin/jobs` route
4. Lägg till error handling i alla edge functions

### Fas 2: Säkerhet & GDPR (3-5 dagar)
1. Ersätt alla `console.log` med conditional logger
2. Ta bort PII från loggar
3. Implementera CSP headers
4. Lägg till input-validering med Zod

### Fas 3: Prestanda (1 vecka)
1. Implementera virtualisering för admin-listor
2. Lazy load tunga komponenter
3. Optimera bilder (WebP, lazy loading)
4. Bundle splitting för admin-routes

### Fas 4: Städning (1 vecka)
1. Ta bort legacy `quote_requests` referenser
2. Ersätt JSON.stringify med formaterade komponenter
3. Dokumentera API-endpoints
4. Uppdatera README med deployment-guide

### Fas 5: A11y & Polish (3-5 dagar)
1. Lägg till aria-labels
2. Fixa focus management
3. Color contrast audit
4. Screen reader testing

---

## Slutsats

Projektet har en solid grund men kräver uppmärksamhet på:
- **Säkerhet** (CORS, PII, input-validering)
- **GDPR-compliance** (anonymisera loggar)
- **Prestanda** (virtualisering, lazy loading)
- **Användarupplevelse** (fixa kritisk URL-bugg, förbättra error messages)

**Rekommendation:** Prioritera Fas 1-2 innan production launch. Fas 3-5 kan göras iterativt efter lansering.

**Total estimerad tid:** 3-4 veckor för alla faser.
