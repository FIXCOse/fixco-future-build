

## Plan: Lokala tjänstesidor — maximal konvertering

### Nuvarande layout (10+ sektioner, konvertering utspädd)

```text
1. Hero + CTA
2. TrustBar
3. "Vanliga projekt i Knivsta"    ← SEO-filler, kunden bryr sig inte
4. "Om snickare i Knivsta"       ← Wikipedia-text, ingen konverterar
5. How to Book (4 steg)           ← Bra men för tidigt
6. Nearby Areas                   ← SEO-intern länkning
7. Tjänster vi erbjuder           ← Borde vara högre
8. ROT/RUT 30%                    ← Konverteringsdriver, borde vara högre
9. Testimonials                   ← Social proof, borde vara DIREKT efter hero
10. Quick Facts + Fun Facts       ← "Visste du om Knivsta?" — onödigt
11. FAQ + Myter
12. Andra tjänster i området
13. Final CTA
14. SEO-zon (nearby, related searches, urgent)
```

### Ny layout — konverteringstratt

```text
─── KONVERTERINGSZON (ovan fold) ───────────────────
1. HERO — Ny design, tydligare landing page-känsla
   • Stor H1 med gradient
   • 1 rad value prop (ej Wikipedia om orten)
   • 2 CTA-knappar (Begär offert + Ring oss)
   • 3 trust-badges inline (★ 5/5, 30% ROT, Svar <2h)
   
2. SOCIAL PROOF — Testimonials direkt under hero
   • Karusell med omdömen, bygger förtroende omedelbart

3. TJÄNSTER — Vad vi gör (kompakt grid)
   • "Vi hjälper dig med allt inom [tjänst] i [ort]"
   • Checkmark-lista

4. ROT/RUT — Prisincitament
   • "Spara 30% med ROT-avdrag" — konverteringsdriver

5. HOW TO BOOK — 4 steg (enkel process)
   • Visar att det är lätt att komma igång

6. ANDRA TJÄNSTER — Korsförsäljning
   • Kompakt grid med andra tjänster i området

7. FINAL CTA — Stark avslutning
   • "Redo att boka?" + CTA-knappar

─── SEO-ZON (långt ner, diskret) ──────────────────
8. FAQ + Myter (accordion, bra för schema)
9. "Vanliga projekt" (popular searches)
10. "Om tjänst i ort" (unique intro text)
11. Quick Facts
12. Fun Facts
13. Nearby Areas / Related Searches / Urgent / Area Links
```

### Hero-design — landing page-inspirerad men unik

Heroon behåller bildbaserad/gradient-bakgrund som idag, men blir mer **fokuserad och ren**:

- **Ta bort** location badge ("Professionella hantverkare i Knivsta") — onödig, orten finns i H1
- **Starkare value prop** — istället för generisk "Fast pris, försäkrade hantverkare" → mer säljande: "Topprankade i Uppsala län — gratis offert inom 24h"
- **Trust badges flyttas in i hero** som kompakta pills (inte separat CompactTrustBar-sektion)
- **Skillnad mot landing page**: Heroon har bakgrundsbild/gradient per tjänst (snickare = foto, el = foto), landing page har inte det. Behåller den visuella identiteten per tjänst.

### Tekniska ändringar

**1. `src/pages/LocalServicePage.tsx`** — Omordna sektioner

Flytta sektioner i JSX:
- Hero (behålls position 1, men förfinas)
- CompactTrustBar **tas bort** (badges integreras i hero)
- Testimonials **flyttas upp** till position 2 (direkt efter hero)
- Services **flyttas upp** till position 3
- ROT/RUT **flyttas upp** till position 4
- How to Book **flyttas** till position 5
- Other Services **behålls** position 6
- Final CTA **behålls** position 7
- **Allt annat pushas till SEO-zon**: FAQ, Vanliga projekt, Om-text, Quick Facts, Fun Facts, NearbyAreas

**2. Hero-förändringar i samma fil**
- Ta bort location badge (`<span className="inline-flex items-center gap-2 px-4 py-2...">`)
- Uppdatera intro-text till starkare value prop
- Integrera trust badges tightare (ta bort CompactTrustBar som separat komponent)
- Behåll bakgrundsbildslogik (heroImage) — det är det som skiljer från landing page

**3. SEO-zon styling**
- Alla SEO-sektioner längst ner får dämpad styling (`text-muted-foreground`, mindre padding)
- Behåll all schema.org-markup (FAQ, HowTo, etc) — den funkar oavsett visuell position

### Sammanfattning

Inga nya komponenter behövs. Inga dataändringar. Enbart **omordning av sektioner** i `LocalServicePage.tsx` + förfining av hero-text. En fil ändras.

