
Ja, skärmdumpen säger mycket: den pekar främst på en **validator-bugg**, inte på att din sitemap är trasig.

## Vad bilden faktiskt visar

- Felet `Failed to parse XML resource '/var/www/wspstage.mentorvpn.com/.../custom.xsd'` refererar till **validatorns egen serverfil** (`websiteplanet`), inte din domän.
- Felet `XML declaration allowed only at the start of the document` uppstår ofta som följdfel när just den validatorn parserar fel (eller läser via en intern wrapper), även när sitemapen i sig är korrekt.
- I vår kod genereras XML-deklarationen exakt en gång i början (`vite-plugin-sitemap.ts`), så dubbel deklaration i källkoden är osannolik.

## Plan (robust, så vi eliminerar även “edge cases”)

1. **Gör sitemap-output ännu mer tolerant mot tredjepartsverktyg**
   - Ta bort XML-deklarationen (`<?xml ...?>`) från alla sitemap-filer (den är valfri enligt XML och Google klarar detta).
   - Säkerställ att dokumentet alltid börjar direkt med `<sitemapindex>` eller `<urlset>`.

2. **Inför build-validering av sitemapfiler**
   - Lägg till ett valideringsscript som körs efter build och kontrollerar:
     - exakt en rot-tag,
     - inga ledande tecken/BOM,
     - korrekt namespace,
     - inga dubbletter i `<loc>`.
   - Build ska faila om valideringen failar.

3. **Inför “sitemap health check” för drift**
   - Kontrollera samtliga sitemap-URL:er för:
     - HTTP 200,
     - `Content-Type` innehåller `xml`,
     - rimlig storlek,
     - parsbar struktur.
   - Dokumentera detta som standardkontroll före GSC-resubmit.

4. **Verifiera mot rätt källa (Google, inte tredjepartsvalidatorn)**
   - Resubmit endast `/sitemap.xml` i Search Console.
   - Följ upp index-/hämtningsstatus på child-sitemaps där, inte i websiteplanet.

## Tekniska detaljer (implementation)

- Filer att ändra:
  - `vite-plugin-sitemap.ts` (output-normalisering + ev. borttagning av XML-deklaration)
  - `package.json` (nytt script för sitemap-validering)
  - ny fil: `scripts/validate-sitemaps.mjs` (build/delivery checks)
- Befintliga robusta delar (`public/_headers` + `public/_redirects`) behålls som de är.

## Förväntat resultat

- Du slipper falska parserfel från mindre tillförlitliga validatorer.
- Du får en deterministisk kvalitetskontroll i build.
- Google får stabil och konsekvent sitemapleverans, vilket är det som påverkar SEO i praktiken.
