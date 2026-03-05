

## Plan: Fixa ServiceRequestModal för mobil

### Problem
Modalen är inte mobilanpassad:
1. Ingen max-höjd på hela modalen — footer med "Fortsätt"-knappen hamnar utanför skärmen/bakom mobilens bottom nav
2. `max-h-[60vh]` på innehållsytan räcker inte — med header + progress + footer blir totalhöjden > 100vh
3. Ingen `-webkit-overflow-scrolling: touch` för smidig scroll på iOS

### Ändringar i `src/features/requests/ServiceRequestModal.tsx`

**1. Modal-container — begränsa höjd på mobil:**
```
// Nuvarande (rad 363):
className="relative w-full md:w-[800px] ... overflow-hidden"

// Nytt:
className="relative w-full md:w-[800px] ... overflow-hidden 
  max-h-[100dvh] md:max-h-[85vh] flex flex-col"
```

**2. Scrollbart innehåll — flex-1 istället för fast max-h:**
```
// Nuvarande (rad 413):
className="p-6 max-h-[60vh] overflow-y-auto"

// Nytt:
className="p-6 flex-1 min-h-0 overflow-y-auto overscroll-contain"
```

**3. Footer — säkerställ att den alltid syns med safe-area padding:**
```
// Nuvarande (rad 1023):
className="px-6 py-4 border-t ..."

// Nytt:
className="px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t ... flex-shrink-0"
```

**4. Header — flex-shrink-0 för att inte komprimeras:**
Lägg till `flex-shrink-0` på header och progress-bar divarna.

### Fil
- **`src/features/requests/ServiceRequestModal.tsx`** — mobilanpassning av layout

