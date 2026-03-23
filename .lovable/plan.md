

# Plan: Ta bort seo-inline.js — eliminera metadata-konflikter

## Bakgrund
`seo-inline.js` sätter generiska titlar och dubbla JSON-LD-scheman som konfliktar med React Helmets rikare, mer CTR-vänliga metadata. Google renderar redan JS på sajten (bevisat av befintliga rankings), så pre-rendering-systemet är redundant och skapar instabilitet på alla 8 200+ lokala sidor.

## Åtgärder

### 1. Ta bort från build-processen
**Fil:** `package.json`
- Ta bort `&& node scripts/generate-seo-inline.mjs` från build-scriptet

### 2. Ta bort script-taggen
**Fil:** `index.html`
- Ta bort `<script src="/seo-inline.js"></script>` från `<body>`

### 3. Ta bort cleanup-koden
**Fil:** `src/main.tsx`
- Ta bort raden `document.getElementById('seo-root')?.remove();`

Skriptfilerna (`scripts/generate-seo-inline.mjs`, `scripts/seo-data.mjs`) behålls i repot men körs inte längre.

## Resultat
- Google ser EN konsekvent titel per sida (den rika pick3-versionen)
- Inga dubbla JSON-LD-scheman
- Ingen risk för title-flipping eller cloaking-signaler
- Alla lokala tjänstesidor behåller sin fulla SEO via React Helmet

