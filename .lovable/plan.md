

## Tema-fix: Hardkodade dark-mode farger overallt

### Problem
Nastan alla sidor och komponenter har hardkodade morklagsfarger (t.ex. `bg-white/[0.04]`, `border-white/10`, `from-[hsl(260,12%,10%)]`) istallet for CSS-variabelbaserade klasser (`bg-card`, `border-border`, `bg-muted`). I ljust tema blir text osynlig, bakgrunder felaktiga och korten ser helt trasiga ut -- precis som pa skarmbilden.

### Omfattning
Problemet finns i **minst 10 filer**. Har ar en fullstandig genomgang:

### Filer som behover andras

#### 1. `src/pages/LocalServicePage.tsx` (STORSTA PROBLEMET)
Hardkodade bakgrunder pa **varje sektion**:
- Rad 258: `bg-gradient-to-br from-[hsl(260,20%,14%)]...` (hero utan bild)
- Rad 270: `bg-white/[0.1]`, `border-white/15` (badge)
- Rad 303: `bg-white/[0.08]`, `border-white/15` (trust badges)
- Rad 353: `bg-gradient-to-br from-[hsl(260,12%,10%)]...` (Vanliga projekt sektion)
- Rad 378-389: `bg-white/[0.04]`, `border-white/10` (projektkort)
- Rad 448: `bg-gradient-to-br from-[hsl(35,15%,9%)]...` (How to book sektion)
- Rad 492: `bg-gradient-to-br from-white/[0.06]...` (stegkort)
- Rad 521: `bg-white/[0.02]` (tjanstersektioner)
- Rad 546: `bg-gradient-to-br from-white/[0.06]...` (tjanstkort)
- Rad 567: `bg-gradient-to-br from-[hsl(165,18%,9%)]...` (ROT-sektion)
- Rad 648: `bg-gradient-to-br from-[hsl(260,12%,10%)]...` (fakta-sektion)
- Rad 669: `bg-white/[0.04]`, `border-white/5` (faktakort)
- Rad 730: `bg-gradient-to-br from-white/[0.04]...`, `border-white/10` (FAQ-items)
- Rad 750: `bg-gradient-to-br from-[hsl(260,12%,10%)]...` (andra tjanster sektion)
- Rad 778: `bg-white/[0.04]`, `border-white/10` (tjanstlankar)
- Rad 797: `bg-gradient-to-b from-[hsl(260,15%,10%)]...` (CTA sektion)
- Rad 807: `bg-gradient-to-br from-white/[0.08]...`, `border-white/15` (CTA-kort)
- Rad 831: `border-white/20` (outline-knapp)
- Rad 852: `border-white/5` (SEO-sektion borders)
- Rad 907: `bg-zinc-800` (akut-tjanster)

**Losning:** Ersatta ALLA hardkodade farger med temamedvetna CSS-klasser:
- `bg-white/[0.04]` -> `bg-muted/50`
- `border-white/10` -> `border-border`
- `bg-gradient-to-br from-[hsl(260,12%,10%)]...` -> `bg-muted/30`
- `bg-white/[0.08]` -> `bg-card`
- Sektionsbakgrunder: alternera mellan `bg-background` och `bg-muted/30`

#### 2. `src/components/local-service/NearbyAreasSection.tsx`
- Rad 60: `bg-gradient-to-b from-[hsl(240,10%,8%)]...` -> `bg-muted/30`
- Rad 94: `bg-gradient-to-r from-white/[0.06]...`, `border-white/10` -> `bg-card border-border`

#### 3. `src/components/local-service/TestimonialCarouselLocal.tsx`
- Rad 51: `bg-gradient-to-br from-white/[0.08]...`, `border-white/10` -> `bg-card border-border`

#### 4. `src/components/local-service/ExpandableAreaLinks.tsx`
- Rad 48: `bg-[hsl(240,8%,5%)]` -> `bg-muted/30`
- Rad 82, 133: `bg-white/[0.03]`, `border-white/5` -> `bg-muted/50 border-border`

#### 5. `src/components/local-service/CompactTrustBar.tsx`
- Rad 26: `bg-gradient-to-r from-transparent via-white/[0.03]` -> `bg-muted/20`

#### 6. `src/components/v2/HeroV2.tsx`
- Rad 13: `bg-gradient-to-b from-[hsl(222,47%,8%)]...` -> anvand `hero-background` CSS-klass
- Rad 57: `bg-white/5`, `border-white/10` -> `bg-muted/50 border-border`
- Rad 104: `border-white/20`, `hover:bg-white/10` -> `border-border hover:bg-muted`

#### 7. `src/components/v2/GlassCard.tsx`
- Rad 28: `bg-white/10`, `border-white/10` -> `bg-card/80 border-border`
- Rad 29: `hover:bg-white/[0.12]`, `hover:border-white/30` -> `hover:bg-muted hover:border-primary/30`

#### 8. `src/components/v2/TestimonialsV2.tsx`
- Rad 73: `border-white/10` -> `border-border`

#### 9. `src/components/v2/CTAV2.tsx`
- Rad 50: `bg-white text-background` -> dessa far behallas for CTA-kontrast men verifieras

#### 10. `src/components/v2/BentoGrid.tsx`
- Rad 94: `bg-white/10` -> `bg-primary/10`

### Steg-for-steg

1. **Borja med LocalServicePage.tsx** -- det ar den storsta och mest trasiga sidan
2. **Fixa local-service/ subkomponenter** (4 filer)
3. **Fixa v2/ komponenter** (GlassCard, HeroV2, TestimonialsV2, BentoGrid, CTAV2)
4. **Verifiera ovriga sidor** (Contact, FAQ, AboutUs, Services -- dessa anvander redan mestadels CSS-klasser som `card-premium`, `hero-background`, `gradient-primary-subtle` som ar temamedvetna)

### Principer for fixarna
- Anvand befintliga CSS-klasser: `bg-card`, `bg-muted`, `border-border`, `bg-background`, `card-premium`
- Sektions-alternering: `bg-background` och `bg-muted/30` (eller `bg-muted/5`)
- Kort: `bg-card border border-border` (eller `card-premium`)
- Badges/chips: `bg-muted/50 border-border` istallet for `bg-white/[0.08] border-white/15`
- Inga hardkodade `hsl()` sektionsbakgrunder
- Hero-sektioner med bild behallar sin morklagning (overlay pa foto ar OK)
- `stepColors` i LocalServicePage far behallas da de ar dekorativa accentfarger

### Vad som INTE andras
- Hero-overlayen pa bilder (`from-black/85 via-black/60` pa foton) -- det ar korrekt
- Gradient-accentfarger pa stegikoner (dekorativa, inte bakgrunder)
- ROT-sektionens grona accentfarg (dekorativ)
- `gradient-text` och `GradientText` -- dessa har redan ljust-tema-stod i CSS
- Sidor som redan anvander CSS-klasser korrekt (Contact, FAQ, Services)

