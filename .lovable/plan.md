

## Problem

Tooltip-popupen för offertvisningar har `max-h-40` (160px) som begränsar höjden. Med 12 besök visas bara ~7 synliga rader — resten kräver scrollning inuti en liten tooltip, vilket är svårt att använda (tooltips stängs lätt vid scroll).

## Plan

**Fil:** `src/components/admin/QuoteStatusTimeline.tsx`

1. Öka `max-h-40` till `max-h-72` (288px) — rymmer ~18 rader utan scroll för de flesta fall.
2. Behåll `overflow-y-auto` som fallback om det någonsin blir fler än ~18 besök.

En enkel enrads-ändring på rad 57.

