

## Analys

### Bokningar från /boka-hembesok
Bokningar via `/boka-hembesok` **fungerar redan korrekt** — de skickas via `create-booking-with-quote` edge function som:
1. Skapar en rad i `bookings`-tabellen med `mode: 'home_visit'`, `status: 'new'`
2. Skickar admin-notifiering via e-post
3. Skickar kundbekräftelse

Admin-sidan (`AdminQuotesUnified`) visar redan dessa under "Förfrågningar"-fliken med filtret "🏠 Hembesök". Så bokningarna hamnar redan hos admin.

### Det faktiska problemet: Build-timeout
Felet `deadline_exceeded: context deadline exceeded` beror på att **prerender-pluginet genererar ~16,000 HTML-filer** vid build. Dist-mappen blir för stor att ladda upp till Lovable's R2-storage inom tidsgränsen.

### Lösning
Minska antalet prerenderade filer drastiskt. Istället för att generera alla 151 × 53 × 2 = ~16,000 filer, begränsa till de **viktigaste sidorna** (de 20 bastjänsterna × 53 områden × 2 språk = ~2,120 filer). De 131 expanderade SEO-sluggarna behöver inte prerenderas — de har lägre sökvolym och kan förlita sig på sitemapen för indexering.

### Ändringar

**`vite-plugin-prerender-local.ts`**
- Ta bort `EXPANDED_SERVICES` från prerendering
- Behåll bara `BASE_SERVICES` (20 tjänster) → ~2,120 filer istället för ~16,000
- Detta minskar dist-storleken med ~85% och bör lösa timeout-problemet

