

## Plan: Lägg till Fixco-logga i hero på lokala tjänstesidor

### Vad som ändras

Lägga till Fixco-logotypen (vit version, samma som HeroV3) överst i heroon på `LocalServicePage.tsx`, precis som landing page-heroon gör.

### Tekniska ändringar i `src/pages/LocalServicePage.tsx`

1. **Import** `logoFixco` från `@/assets/fixco-logo-white.png` (samma som HeroV3 använder)

2. **Lägg till logotyp-block** direkt efter hero-bakgrunden, innan stars/H1-blocket (rad ~334). Exakt samma struktur som HeroV3:
```tsx
<div className="flex items-center justify-center pt-8 pb-2 md:pt-10 md:pb-4 shrink-0">
  <a href="/" className="inline-block transition-transform duration-300 hover:scale-105 no-underline">
    <img src={logoFixco} alt="Fixco" className="max-h-14 md:max-h-20 w-auto block" />
  </a>
</div>
```

3. Justera padding på content-wrappern (`pt-16` → `pt-8`) så loggan inte hamnar för långt ner.

### En fil ändras
`src/pages/LocalServicePage.tsx`

