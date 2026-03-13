

# Add Sales-Oriented Intro Section Below Hero

## What
Add a short, persuasive intro paragraph between the hero section and the content sections on both **niche pages** (`NicheServiceLandingPage.tsx`) and **local pages** (`LocalServicePage.tsx`). Each intro should be unique per service/area, written in a conversational sales tone.

## Examples of the tone
- **Niche (altanbygge):** "Går du i tankarna kring att bygga din drömaltan som du kan förgylla sommarkvällarna på? Då är Fixco det rätta valet. Våra erfarna snickare hjälper dig hela vägen – från idé till färdig altan med ROT-avdrag."
- **Local (altanbygge + Bromma):** "Går du i tankarna kring att bygga din drömaltan i Bromma? Våra erfarna hantverkare i Bromma hjälper dig hela vägen – från ritning till färdig altan med 30% ROT-avdrag."

## Implementation

### 1. Add intro text templates to `nicheServiceDataExpanded.ts`
New template maps `INTRO_TEXT_SV` and `INTRO_TEXT_EN` per category, each a function `(serviceName: string) => string` that generates a unique, conversational sales pitch. Also add `introText` / `introTextEn` fields to the `NicheServiceMeta` interface.

For hand-crafted niches in `nicheServiceData.ts`, add bespoke `introText`/`introTextEn` strings (completely unique per service).

**Template examples per category:**
- **snickeri:** `"Funderar du på ${name.toLowerCase()}? Fixcos erfarna snickare tar hand om hela projektet – från planering till färdigt resultat. Med fast pris och 30% ROT-avdrag kan du känna dig trygg."`
- **el:** `"Behöver du hjälp med ${name.toLowerCase()}? Våra auktoriserade elektriker utför arbetet säkert och professionellt. Alltid med besiktningsprotokoll och 30% ROT-avdrag."`
- **malning:** `"Dags att fräscha upp hemmet med ${name.toLowerCase()}? Vi på Fixco har professionella målare som levererar ett hållbart resultat. Fast pris och ROT-avdrag ingår."`
- etc. (one per category, ~12 templates)

### 2. Add local intro text generator to `localSeoData.ts`
New function `generateLocalIntroText(serviceSlug, area, locale)` that creates area-specific intro text by combining service-specific sales copy with the area name. Uses existing category/service data.

**Pattern:** `"Funderar du på ${serviceName} i ${area}? Fixcos erfarna hantverkare i ${area} hjälper dig hela vägen..."`

### 3. Add intro section to `NicheServiceLandingPage.tsx`
Insert a styled section between hero (line ~211) and related services (line ~214):
```tsx
<section className="py-12 md:py-16">
  <div className="container mx-auto px-4 max-w-3xl text-center">
    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
      {introText}
    </p>
  </div>
</section>
```

### 4. Add intro section to `LocalServicePage.tsx`
Insert between hero (line ~437) and social proof (line ~442):
```tsx
<section className="py-12 md:py-16">
  <div className="container mx-auto px-4 max-w-3xl text-center">
    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
      {localIntroText}
    </p>
  </div>
</section>
```

### Files to modify
1. **`src/data/nicheServiceData.ts`** — Add `introText`/`introTextEn` to interface + 9 hand-crafted intros
2. **`src/data/nicheServiceDataExpanded.ts`** — Add `INTRO_TEXT_SV`/`INTRO_TEXT_EN` template maps per category
3. **`src/data/localSeoData.ts`** — Add `generateLocalIntroText()` function
4. **`src/pages/NicheServiceLandingPage.tsx`** — Render intro section after hero
5. **`src/pages/LocalServicePage.tsx`** — Render intro section after hero

