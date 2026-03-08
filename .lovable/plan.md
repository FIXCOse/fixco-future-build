

## Fix: "Begär offert"-knappen och logotypstorlek på NicheServiceLandingPage

### Problem
1. **"Begär offert"-knappen** ser konstig ut — `GradientButton` med `text-lg px-8 py-4` ger en annan stil än de lokala tjänstesidorna
2. **Fixco-loggan** har `max-h-16` — bör vara `max-h-20 md:max-h-28` som LocalServicePage

### Ändringar i `src/pages/NicheServiceLandingPage.tsx`

**Logotypen** (rad 125-129): Byt till samma storlek och wrapper som LocalServicePage:
```tsx
<div className="flex items-center justify-center pb-2 md:pb-4 shrink-0">
  <a href="/" className="inline-block transition-transform duration-300 hover:scale-105 no-underline">
    <img src={logoFixco} alt="Fixco" className="max-h-20 md:max-h-28 w-auto block" />
  </a>
</div>
```

**CTA-knapparna** (rad 142-163): Matcha LocalServicePage-stilen — båda knapparna som `GradientButton` med konsekvent storlek, och byt "Boka hembesök" till en andra `GradientButton` istället för en `ghost-premium` `Button`:
```tsx
<div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center mt-2">
  <GradientButton
    className="text-lg md:text-xl px-8 md:px-10 py-4 md:py-5"
    onClick={...}
  >
    {t('serviceDetail.requestQuote')}
  </GradientButton>
  <GradientButton
    className="text-lg md:text-xl px-8 md:px-10 py-4 md:py-5"
    onClick={...}
  >
    {t('footer.bookHomeVisit')}
  </GradientButton>
</div>
```

Detta ger identisk knapp- och logotypstil som de lokala tjänstesidorna.

