

## Fix: Ta bort ikoner från bottom CTA-knapparna

Bottom CTA-sektionen (rad 335-354) använder fortfarande `<FileText />` och `<Calendar />` ikoner samt `Button variant="outline"` — ska matcha hero-stilen med två `GradientButton` utan ikoner.

### Ändring i `src/pages/NicheServiceLandingPage.tsx` (rad 335-354)

Byt ut hela knapp-diven till:
```tsx
<div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
  <GradientButton
    onClick={() => openServiceRequestModal({
      serviceSlug: niche.slug,
      prefill: { service_name: title }
    })}
    className="text-lg md:text-xl px-8 md:px-10 py-4 md:py-5"
  >
    {t('local.ctaQuote')}
  </GradientButton>
  <GradientButton
    className="text-lg md:text-xl px-8 md:px-10 py-4 md:py-5"
    href={servicePrefix}
  >
    {t('local.allServices')}
  </GradientButton>
</div>
```

Tar bort ikonerna och gör knapparna identiska med hero-sektionen. Oanvända imports (`FileText`, `Calendar`) kan också tas bort.

