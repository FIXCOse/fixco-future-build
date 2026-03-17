

## Problem: Referensprojekt-korten är för små på desktop

Griddet använder `lg:grid-cols-3` vilket ger tre smala kolumner på stora skärmar. Med `aspect-video` på bilderna blir korten ganska små.

## Plan

### 1. Ändra grid-layout i `src/pages/Referenser.tsx`
- Byt från `lg:grid-cols-3` till `lg:grid-cols-2` så korten blir större och bilderna syns bättre på desktop
- Öka gap från `gap-6` till `gap-8`

### 2. Öka bildhöjden i `src/components/ReferenceProjectCard.tsx`
- Byt `aspect-video` (16:9) till `aspect-[4/3]` för att ge bilderna mer höjd och synlighet

Dessa två ändringar gör att varje kort tar upp mer plats och bilderna blir betydligt större och tydligare.

