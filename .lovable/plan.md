

## Plan

**Fil:** `src/components/admin/QuoteStatusTimeline.tsx` (rad ~57)

Ta bort `max-h-72 overflow-y-auto` helt från tooltip-containern så att alla besök alltid visas utan scrollning, oavsett antal.

```tsx
// Före
<div className="space-y-1 max-h-72 overflow-y-auto">

// Efter
<div className="space-y-1">
```

En enrads-ändring.

