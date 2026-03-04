

## Plan: Fetare hero-text på lokala tjänstesidor — landing page-stil

### Vad som ändras

Heroon i `src/pages/LocalServicePage.tsx` uppgraderas med samma textstorlekar och typografi som landing page (HeroUltra):

### Specifika ändringar

**H1 (rad 351-356):**
- Nuvarande: `text-3xl md:text-5xl lg:text-6xl`
- Ny: `text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl` — matchar HeroUltra exakt
- Lägg till `leading-tight` för tätare radavstånd

**Value prop / subtitle (rad 359-367):**
- Nuvarande: `text-base md:text-xl lg:text-2xl`
- Ny: `text-base sm:text-lg md:text-xl lg:text-2xl` — smooth scaling
- Öka `max-w-3xl` eventuellt, behåll `leading-relaxed`

**Hero padding (rad 334):**
- Nuvarande: `pt-12 pb-16 md:pt-20 md:pb-24`
- Ny: `pt-16 pb-20 md:pt-24 md:pb-28` — mer andrum, hero känns större/mer dominant

**Trust badges (rad 401):**
- Nuvarande: `text-sm`
- Ny: `text-sm md:text-base` — lite fetare badges på desktop

**CTA-knappar:**
- Lägg till `className="text-lg md:text-xl px-8 md:px-10 py-4 md:py-5"` på GradientButton — större, mer dominanta knappar

### En fil ändras
`src/pages/LocalServicePage.tsx` — enbart CSS-klasser, ingen strukturändring.

