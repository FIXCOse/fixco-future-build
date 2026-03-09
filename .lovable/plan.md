

## Fix: ServiceRequestModal inte klickbar på mobil

### Problem
Modalen tar upp hela skärmen (`max-h-[100dvh]`) men mobilens bottom-navigation (~80px) täcker footern med "Fortsätt"-knappen. Användaren kan inte klicka vidare.

### Lösning i `src/features/requests/ServiceRequestModal.tsx`

**1. Minska modal-höjd på mobil** (rad 539):
- Ändra `max-h-[100dvh]` till `max-h-[calc(100dvh-5rem)]` på mobil för att ge plats åt bottom nav
- Lägg till `mb-20 md:mb-0` så modalen sitter ovanför navigationen

**2. Kompaktera kort på mobil** (rad 815, 647, 737):
- Minska padding på tidsvalskortet från `p-4` till `p-3` på mobil
- Minska ikonstorleken från `w-12 h-12` till `w-10 h-10` på mobil
- Samma för kategori- och addon-korten

**3. Minska header/content padding** (rad 566, 598):
- Header: `p-6 pb-5` → `p-4 pb-3 md:p-6 md:pb-5`
- Content: `p-6` → `p-4 md:p-6`
- Footer: `px-6 py-4` → `px-4 py-3 md:px-6 md:py-4`

**4. Säkerställ footer synlighet**:
- Öka footer `pb` till `pb-[max(1.5rem,env(safe-area-inset-bottom))]` + extra margin för app-nav

Totalt: 1 fil ändras (`ServiceRequestModal.tsx`), ~15 rader justerade.

