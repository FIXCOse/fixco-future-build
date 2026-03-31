

# Plan: Lägg till Asfaltslandslaget-logo + ta bort prisuppgifter från referenser

## 1. Lägg till Asfaltslandslaget i partnerkarusellen

**Fil:** `src/assets/asfaltslandslaget-logo.png` — kopiera uploadad bild hit

**Fil:** `src/components/v3/HeroV3.tsx`
- Importera `logoAsfaltslandslaget`
- Lägg till i båda logo-seten (original + duplicate) efter Kulör
- Använd `brightness-0 invert` (mörk logo mot mörk bakgrund)

## 2. Ta bort prisuppgifter från referensprojekt

Priset ska inte visas publ