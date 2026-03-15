

# Rotorsaksanalys: Varför Google misslyckas hämta sitemaps

## Vad jag hittade

Jag hämtade **alla** sitemap-filer live (sthlm-1 genom sthlm-9, uppsala-1 genom uppsala-5). **Alla returnerar giltig XML med korrekt innehåll.** Problemet är alltså inte att filerna saknas eller är för stora.

## Identifierade rotorsaker

### 1. SPA catch-all i `_redirects` fångar XML-förfrågningar

Rad 117 i `public/_redirects`:
```
/*    /index.html   200
```

Denna regel kan potentiellt servera `index.html` (HTML) istället för XML-filen om hostingplattformen inte prioriterar statiska filer korrekt. Google får då HTML med `Content-Type: text/html` och tolkar det som "hämtning misslyckades" eftersom det inte är giltig XML.

**Fix:** Lägg till explicit undantag för sitemap-filer **före** catch-all:
```
/sitemap*.xml    /sitemap*.xml   200!
```

### 2. Inga Content-Type headers för XML-filer

`public/_headers` saknar helt regler för `.xml`-filer. Med `X-Content-Type-Options: nosniff` (som redan finns) **måste** servern svara med rätt Content-Type. Om hostingen defaultar till `text/html` för okända filer → Google avvisar.

**Fix:** Lägg till i `_headers`:
```
/sitemap*.xml
  Content-Type: application/xml; charset=utf-8
  Cache-Control: public, max-age=3600
  X-Robots-Tag: noindex
```

### 3. Trailing-slash-redirect fångar `.xml`-filer

Rad 114 i `_redirects`:
```
/*/   /:splat   301!
```

Om Google (eller en proxy) lägger till trailing slash → `/sitemap-local-sthlm-2.xml/` → redirect till `/sitemap-local-sthlm-2.xml` → Google ser 301 istället för direkt svar → kan orsaka timeout-liknande fel vid kedjade redirects.

**Fix:** Flytta XML-undantaget ovanför trailing-slash-regeln.

## Plan: Tre ändringar i två filer

### Fil 1: `public/_headers`

Lägg till explicit Content-Type och caching för alla sitemap-XML-filer:

```
/sitemap.xml
  Content-Type: application/xml; charset=utf-8
  Cache-Control: public, max-age=3600

/sitemap-*.xml
  Content-Type: application/xml; charset=utf-8
  Cache-Control: public, max-age=3600
```

### Fil 2: `public/_redirects`

Lägg till **högst upp** (före alla andra regler) en explicit passthrough-regel för sitemap-filer så att de aldrig fångas av catch-all eller trailing-slash-redirects:

```
# Sitemap-filer ska ALLTID serveras direkt
/sitemap.xml          /sitemap.xml         200!
/sitemap-main.xml     /sitemap-main.xml    200!
/sitemap-hubs.xml     /sitemap-hubs.xml    200!
/sitemap-blog.xml     /sitemap-blog.xml    200!
/sitemap-local-*      /sitemap-local-:splat 200!
```

`!` (force) säkerställer att dessa regler alltid vinner, oavsett andra matchningar.

### Resultat

| Problem | Fix |
|---------|-----|
| SPA catch-all serverar HTML istället för XML | Explicit 200!-regler för sitemaps |
| Saknad Content-Type → nosniff blockerar | `application/xml` i `_headers` |
| Trailing-slash redirect → 301 loop | Sitemaps matchas före trailing-slash-regler |

Efter deploy: ta bort alla gamla sitemaps i GSC och skicka om enbart `/sitemap.xml`.

