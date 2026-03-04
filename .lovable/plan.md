

## Plan: Lokala tjänstesidor — Landing Page Hero med maximal konvertering

### Koncept

Varje lokal tjänstesida blir en **mini-landing page** som fångar kunden direkt. Heroon inspireras av HeroV3 (lila gradient-bakgrund, centrerad text, GradientButton) men anpassas för lokal kontext. Ingen bild, ingen filler — ren konverteringskraft.

### Ny Hero-design

```text
┌─────────────────────────────────────────────┐
│  [Gradient bakgrund — tjänstespecifik färg] │
│                                             │
│         ★★★★★ 4.9 betyg                    │
│                                             │
│    Snickare i Uppsala                       │
│    (H1, stor, gradient-rainbow text)        │
│                                             │
│  Topprankade i Uppsala län —                │
│  gratis offert inom 24h                     │
│                                             │
│  ┌──────────────────┐  ┌────────────────┐   │
│  │ ✨ BEGÄR OFFERT  │  │ SE TJÄNSTER    │   │
│  │ (GradientButton) │  │ (GradientBtn)  │   │
│  └──────────────────┘  └────────────────┘   │
│                                             │
│  ✓ 30% ROT  ✓ F-skatt  ✓ Försäkrade       │
│                                             │
└─────────────────────────────────────────────┘
```

**Skillnad mot HeroV3:** Använder tjänstespecifik gradient-färg (blå för VVS, gul för el, amber för snickare etc) istället för lila. Ingen logotyp, inga klient-logos. Visar service+ort i H1.

### Ny sidlayout (7 sektioner → sedan SEO-zon)

```text
1. HERO — Gradient-bakgrund, centrerad, GradientButton CTA
2. SOCIAL PROOF — Testimonials (behålls som idag)  
3. HOW TO BOOK — 4 steg (flyttas upp)
4. TJÄNSTER — Checkmark-grid (behålls)
5. ROT/RUT — 30% sparning (behålls)
6. ANDRA TJÄNSTER — Korsförsäljning (behålls)
7. FINAL CTA — GradientButton igen
─── SEO ZONE ───
8-13. FAQ, Vanliga projekt, Om-text, Facts, Nearby, etc
```

### Tekniska ändringar i `src/pages/LocalServicePage.tsx`

**Hero-sektion (rad 330-418) ersätts helt:**
- Ta bort `heroImage`-logik (ingen bakgrundsbild)
- Gradient-bakgrund per tjänst med `getGradientForService()` — men med fasta CSS-gradienter istället (likt HeroV3-stilen, inte Tailwind utility-klasser)
- Centrerad layout istället för vänsterställd
- Stjärnor + betyg ovanför H1 (som HeroV3)
- GradientButton för "Begär offert" (öppnar ServiceRequestModal)
- GradientButton för "Se tjänster" (länk till /tjanster)
- Trust-badges under knappar (kompakta, vita mot gradient)
- **Ta bort telefonnummer-knappen** från hero

**Sektionsordning ändras:**
- How to Book flyttas upp till position 3 (direkt efter testimonials)
- Resten behålls i ordning

**Final CTA (rad 656-705) uppgraderas:**
- Byt från vanlig Button till GradientButton
- Ta bort telefonnummer, bara "Begär offert" + "Se alla tjänster"

**Nya gradient-färger per tjänst** (i hero-bakgrunden):
- Snickare: amber/orange toner
- VVS: blå/cyan
- El: gul/orange
- Målare: turkos/rosa
- Trädgård: grön/lime
- Markarbeten: brun/amber
- Städ: rosa/rose
- Montering: lila/violet
- Flytt: röd/rosa
- Tekniska: grå/silver

Mappningen finns redan i `serviceGradients.ts` men hero-bakgrunden behöver fullständiga CSS-gradienter (med `backgroundImage` inline style, likt HeroV3).

### Sammanfattning

En fil ändras: `LocalServicePage.tsx`. Hero blir centrerad gradient-landing page med GradientButton. Telefonnummer tas bort från CTA. How to Book flyttas upp. Allt annat behålls.

