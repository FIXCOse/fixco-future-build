

# Plan: Rensa bort engelska från HTML-sitemap

## Problem
HTML-sitemapen (`/webbkarta`) stödjer idag engelska via `/en/sitemap`. Även om sidan har `noindex`, vill vi inte att Googlebot följer engelska länkar därifrån.

## Åtgärd

### 1. Ta bort engelska routen
- I `App.tsx`: ta bort `<Route path="sitemap" element={lazyElement(HtmlSitemap)} />` under `/en/`-gruppen

### 2. Förenkla HtmlSitemap.tsx — bara svenska
- Ta bort all `isEn`-logik, `locale`-check, `prefix`-variabel
- Hårdkoda alla länkar som svenska (`/tjanster/...`, `/kontakt`, `/om-oss` etc.)
- Hårdkoda titlar och rubriker på svenska
- Behåll `noindex,follow` (Google följer länkarna men indexerar inte sidan)

### Resultat
- `/webbkarta` renderar enbart svenska länkar → Googlebot hittar alla 8000+ svenska tjänste-URL:er
- Ingen engelsk version av sitemapen existerar

