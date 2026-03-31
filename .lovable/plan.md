

# Plan: Lägg till Kulör Bygg & Badrum AB i partnerkarusellen

## Åtgärd

### 1. Kopiera logotypen
Kopiera `user-uploads://image-468.png` → `src/assets/kulor-logo.png`

### 2. Uppdatera `src/components/v3/HeroV3.tsx`
- Importera: `import logoKulor from "@/assets/kulor-logo.png";`
- Lägg till en `<div>` med Kulör-loggan i **båda** logo-seten (original + duplicate för seamless loop), efter Nordgren & Partners
- Använd samma mönster: `className="h-5 md:h-8 flex items-center shrink-0"` med `brightness-0 invert` (loggan är mörk text, bakgrunden är mörk → behöver inverteras till vit)

