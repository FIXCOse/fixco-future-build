# SEO-förbättringar — Nästa steg

Ni har redan gjort extremt mycket: 16 400+ lokala sidor, strukturerad data, hreflang, sitemap-index, 60+ bloggartiklar, prerendering, HowTo-schema, FAQ-schema, internal linking. Här är de mest värdefulla förbättringarna som återstår:

---

## 1. Installera Google Analytics 4 (saknas helt)

**Problem**: `useSEO.tsx` refererar till `G-XXXXXXXXXX` — ett placeholder-ID. Det finns inget GA4-script i `index.html`. Ni samlar alltså **ingen trafikdata alls**.

**Fix**: Lägg till GA4-scriptet i `index.html` `<head>` med ert riktiga Measurement ID. Utan detta kan ni inte mäta vilka sidor som rankar, var besökare hoppar av, eller vilka sökord som driver trafik.

---

## 2. Förbättra 404-sidan för SEO-värde

**Problem**: Nuvarande `NotFound.tsx` är en generisk grå sida med "Oops! Page not found" — ingen branding, inga interna länkar, ingen hjälp att hitta rätt.

**Fix**: Redesigna till en användbar sida med:

- Fixco-branding och gradient-design
- Sökförslag ("Letar du efter dessa tjänster?")
- Länkar till populära tjänster och områden
- Kontaktinfo (telefon, offertknapp)
- Korrekt `<meta name="robots" content="noindex">` och 404-statuskod

---

## 3. Utöka prerendering till expanded slugs (de 131 nisch-tjänsterna)

**Problem**: Bara 20 base services prerenderas. De 131 expanded slugs (totalrenovering, renovering, hantverkare, etc.) returnerar generisk `index.html` utan SEO-data — Google ser dem som "Upptäckt – inte indexerad".

**Fix**: Utöka `vite-plugin-prerender-local.ts` till att inkludera åtminstone de **top 30-50 mest sökta expanded slugs** (totalrenovering, badrumsrenovering, köksrenovering, hantverkare, byggfirma etc.) för alla 54 områden. Batch-generera i grupper för att undvika timeout.

---

## 4. Lägg till `lastmod` dynamiskt i sitemap

**Problem**: Om alla sidor har samma `lastmod`-datum signalerar det till Google att inget har uppdaterats. 

**Fix**: Variera `lastmod` baserat på faktiskt uppdateringsdatum eller åtminstone per tjänstekategori, så Google prioriterar att crawla nyligen uppdaterade sidor.

---

## 5. Optimera Core Web Vitals — Hero-bilden

**Problem**: Fixco-loggan i hero (`HeroV3.tsx`) har `loading="lazy"` — detta är **fel** för LCP-elementet (Largest Contentful Paint). Lazy-loading av above-the-fold-bilder försämrar CWV-poängen.

**Fix**: Ändra hero-loggan till `loading="eager"` och `fetchPriority="high"`. Samma gäller alla bilder i viewport vid sidladdning.

---

## Prioritetsordning


| #   | Åtgärd                     | SEO-påverkan                    | Effort |
| --- | -------------------------- | ------------------------------- | ------ |
| 1   | Google Analytics 4         | Kritisk (mätning)               | Låg    |
| 2   | Förbättra 404-sidan        | Medel (UX + intern länkning)    | Låg    |
| 3   | Utöka prerendering         | Hög (indexering av 6000+ sidor) | Medel  |
| 4   | Dynamisk lastmod i sitemap | Medel (crawl-prioritering)      | Låg    |
| 5   | Core Web Vitals fix        | Medel (ranking-faktor)          | Låg    |


---

här är g4 koden: G-RY10121655  
  
Vill du att jag implementerar alla fem, eller ska vi börja med specifika punkter?  
  
IMPLEMTNERA ALLA PLANER

&nbsp;