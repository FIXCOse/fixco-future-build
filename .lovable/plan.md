

## Fix: Matcha NicheServiceLandingPage hero med LocalServicePage

Nisch-sidans hero skiljer sig från de lokala sidorna på flera punkter. Fixar så de ser identiska ut.

### Skillnader att åtgärda i `src/pages/NicheServiceLandingPage.tsx`

**1. CTA-knappar — ta bort ikoner, matcha text**
- Local: `"Begär gratis offert"` + `"Alla tjänster"` (inga ikoner i knapparna)
- Niche: `<FileText />` + `"Begär offert"` och `<Calendar />` + `"Boka hembesök"`
- Fix: Ta bort ikonerna från GradientButton. Ändra texten till `t('local.ctaQuote')` och `t('local.allServices')` med href till tjänstesidan

**2. Trust badges — pill-form istället för inline**
- Local: Runda pills med `bg-white/10 backdrop-blur-sm border border-white/20` och `CheckCircle`-ikon
- Niche: Inline text med individuella ikoner (Shield, Clock, Star, MapPin)
- Fix: Byt till samma pill-badge-mönster som LocalServicePage med `CheckCircle`

**3. Hero padding**
- Local: `pt-8 pb-20 md:pt-10 md:pb-28`
- Niche: `py-20 md:py-28`
- Fix: Matcha local-sidans padding

### Fil att ändra
| Fil | Åtgärd |
|---|---|
| `src/pages/NicheServiceLandingPage.tsx` | Uppdatera hero-sektionens knappar och trust badges |

