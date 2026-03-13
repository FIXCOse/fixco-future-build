

# Fix: "Andra tjänster" grid on LocalServicePage looks terrible

## Problem
The "Andra tjänster" section on LocalServicePage (line 640-685) renders ALL 150+ `LOCAL_SERVICES` (base + expanded) as a flat grid. Most expanded services (totalrenovering, renovering, kök, etc.) get a generic grey Hammer icon because the icon lookup only checks `servicesDataNew` which has ~10 base categories. Result: an overwhelming, repetitive grid with 150+ near-identical grey hammer cards.

## Solution
Two changes to make this section useful and visually appealing:

### 1. Show only the ~10 base service categories (not all 150+ expanded slugs)
Filter the grid to show only the original base services (snickare, elektriker, vvs, målare, etc.) — not the 120+ expanded SEO variants. The expanded variants exist for SEO routing, not for cross-selling navigation.

**`src/pages/LocalServicePage.tsx`** — line 661:
Change from `LOCAL_SERVICES.filter(...)` to only show `BASE_SERVICES` or the first ~10 unique `serviceKey` entries, excluding the current service.

### 2. Fix icon resolution for correct gradient colors
Currently: `servicesDataNew.find(s => s.slug === otherService.serviceKey)?.icon` — this maps `serviceKey` (e.g. "snickeri") to `servicesDataNew` slug, but some keys don't match (e.g. "snickeri" vs "snickare"). The gradient is already resolved via `getGradientForService(otherService.slug)` but falls back to default for expanded slugs.

Fix the icon lookup to use the service's `serviceKey` AND resolve it through `getGradientForService(otherService.serviceKey)` for consistent colors.

### Implementation
- Import `BASE_SERVICES` from `localServiceData.ts` (currently not exported, need to export it) OR define a small inline list of the ~10 core services to show
- Filter the grid to these ~10 items instead of all 150+
- Each card gets its proper gradient icon from `servicesDataNew`

This reduces the grid from 150+ grey hammer cards to ~9 colorful, properly-styled service cards — matching the `CityServicesGrid` design pattern already used elsewhere.

