

## Problem

`priceExcl` beräknas alltid från det **ursprungliga** priset (`priceIncl / 1.25 = 958/1.25 = 766`), men det visade priset inkl. moms är det **rabatterade** priset (671). Resultatet: 671 kr/h inkl. moms men 766 kr/h exkl. moms — exkl. moms är högre än inkl. moms, vilket är nonsens.

## Fix

**`src/components/PriceSummary.tsx`** — rad 80:

Beräkna exkl. moms från `primaryPrice` istället för `priceIncl`:

```typescript
const secondaryDisplay = `${formatMoney(primaryPrice / (1 + VAT_RATE))}${unit} exkl. moms`;
```

Med ROT: 671 / 1.25 = **537 kr/h exkl. moms** ✓

