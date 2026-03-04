

## Plan: Lokala tjänstesidor — Landing Page Hero med maximal konvertering

### Status: ✅ Implementerad

### Ändringar genomförda

1. **Hero ersatt** med HeroV3-liknande centrerad gradient-layout per tjänst (blå VVS, amber snickare, etc.)
2. **GradientButton** för alla CTA:er (hero + final CTA)
3. **Telefonnummer borttaget** från hero och final CTA
4. **How to Book** flyttad upp till position 3 (direkt efter testimonials)
5. **Trust badges** integrerade i hero (30% ROT, F-skatt, Försäkrade, Fast pris)
6. **Bakgrundsbilder borttagna** — alla tjänster använder nu gradient-bakgrund
7. **serviceGradients.ts** utökad med `getHeroGradientStyle()` för CSS inline gradients

### Ny sektionsordning
1. Hero (gradient, centrerad, GradientButton)
2. Testimonials
3. How to Book (4 steg)
4. Tjänster (checkmark-grid)
5. ROT/RUT (30% sparning)
6. Andra tjänster (korsförsäljning)
7. Final CTA (GradientButton)
8-13. SEO Zone (FAQ, projekt, om-text, facts, nearby)
