

## Redesign: ServiceDetail hero med LocalServicePage-stil

Uppdatera `src/pages/ServiceDetail.tsx` hero-sektionen för att matcha LocalServicePage:s gradient-hero med vit logga, GradientButton och pill-badges.

### Ändringar i `src/pages/ServiceDetail.tsx`

**1. Imports — lägg till, ta bort**
- Lägg till: `GradientButton`, `logoFixco`, `getHeroGradientStyle`, `motion`, `CheckCircle` (redan importerad)
- Ta bort: `FixcoFIcon`, oanvända ikoner (`Phone`, `FileText`, `Calendar`, `Shield`, `Clock`, `Star`)

**2. Hero-sektion (rad 164-245) — full omskrivning**
Byt från `hero-background` + FixcoFIcon-watermarks till LocalServicePage-mönstret:
- Gradient background med `getHeroGradientStyle(normalizedSlug)` + `animate-gradient-shift`
- Floating blur-effekter (3 st `animate-float-slow/medium/fast`)
- Vit Fixco-logga (`logoFixco`, `max-h-20 md:max-h-28`)
- H1 med vit text istället för `gradient-text`
- Beskrivning i `text-white/90`
- Två `GradientButton` utan ikoner: `t('serviceDetail.requestQuote')` + `t('footer.bookHomeVisit')`
- Service stats (38 tjänster, < 5 dagar, 30%, 100%) med `text-white` istället för `text-primary`
- Ta bort den separata icon-boxen med FixcoFIcon-badge

**3. Trust Indicators (rad 247-269) — pill-badges**
Byt från separat `bg-muted/5`-sektion med individuella ikoner till pill-badges integrerade i hero:
```tsx
<div className="flex flex-wrap justify-center gap-3 mt-4">
  {['F-skatt & försäkring', 'Start inom < 5 dagar', 'Uppsala & Stockholm', '98% kundnöjdhet'].map(...)}
  → bg-white/10 backdrop-blur-sm border border-white/20 + CheckCircle
</div>
```
Ta bort hela den separata trust-sektionen.

**4. Resten av sidan — oförändrad**
Door Lock banner, sub-services grid, pagination och related services behålls som de är.

### Fil att ändra
| Fil | Åtgärd |
|---|---|
| `src/pages/ServiceDetail.tsx` | Hero + trust redesign, uppdaterade imports |

