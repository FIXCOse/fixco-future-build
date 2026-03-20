
Mina fynd just nu:

- Den live-publicerade filen `https://fixco.se/sitemap-local-sthlm-2.xml` går att hämta från min sida.
- Slug-felet verkar redan vara fixat i generatorerna: `bygga-utekok` används i koden.
- Det som fortfarande ser fel ut är att sitemap-leveransen är inkonsekvent mellan kodbas, genererade filer och routing:
  - `public/_redirects` pekar fortfarande bara på gamla `/sitemap-local-sthlm.xml`
  - de nya `sitemap-local-sthlm-1.xml` och `sitemap-local-sthlm-2.xml` är inte explicit definierade där
  - repo:t innehåller dessutom stale genererade sitemap-filer, t.ex. `public/sitemap-services.xml` med gamla `bygga-utekök`

Det gör att Google kan få en annan/stale variant än den som ser rätt ut i koden.

Plan:

1. Rensa upp sitemap-arkitekturen så det finns en enda sann källa
- Antingen sluta checka in genererade sitemap-filer i `public/`
- Eller regenerera alla sitemap-filer konsekvent så repo:t alltid matchar build-output

2. Fixa routing för sitemaps explicit
- Lägg till `200!`-regler i `public/_redirects` för:
  - `/sitemap-local-sthlm-1.xml`
  - `/sitemap-local-sthlm-2.xml`
- Ersätt gamla regeln för `/sitemap-local-sthlm.xml`
- Lägg gärna en legacy-redirect från gamla stockholm-filen till `sitemap.xml` eller rätt ny struktur

3. Regenerera alla sitemap-filer
- Säkerställ att alla sex child-sitemaps faktiskt skrivs ut
- Säkerställ att inga genererade filer längre innehåller `å/ä/ö` i URL-slugs

4. Lägg till validering i build
- Kontrollera att alla filer som refereras i `sitemap.xml` verkligen genereras
- Kontrollera att sitemap-URL:er är ASCII-säkra
- Kontrollera att inga gamla sitemap-namn lever kvar i `public/` eller `_redirects`

5. Deploy + verifiering
- Publicera om
- Begär ny hämtning i Search Console för:
  - `sitemap-local-sthlm-2.xml`
  - `sitemap.xml`

Tekniska detaljer:
- Jag ser inte längre huvudproblemet i själva sluggen.
- Jag ser i stället en deploy/routing-mismatch:
  - generatorerna är uppdaterade
  - men statiska filer och `_redirects` är inte helt synkade
- Det är den mest sannolika orsaken till att Google fortfarande markerar just den filen som misslyckad.

Vad jag skulle bygga nu:
- en liten “sitemap sanity check” i builden
- uppdaterade `_redirects`
- full regenerering av alla sitemap-filer så Search Console alltid möter exakt samma version som koden producerar
