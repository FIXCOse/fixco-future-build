

## Plan: Filtrera ROT/RUT-alternativ i SegmentedPriceToggle baserat på tjänstens berättigande

### Ändring 1: `src/components/SegmentedPriceToggle.tsx`
Lägg till en optional prop `allowedModes` som filtrerar vilka knappar som visas. "Alla" (baspris) visas alltid.

```tsx
interface SegmentedPriceToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  allowedModes?: PriceMode[];  // ny prop
}
```

Filtrera `options` arrayen: visa alltid `'all'`, och visa `'rot'`/`'rut'` bara om de finns i `allowedModes` (eller om `allowedModes` inte skickats, visa alla).

### Ändring 2: `src/pages/ServiceDetail.tsx`
Skicka `allowedModes` baserat på `service.eligible`:
- Om `eligible.rot && !eligible.rut` → `['all', 'rot']`
- Om `eligible.rut && !eligible.rot` → `['all', 'rut']`
- Om båda → `['all', 'rot', 'rut']`
- Om ingen → `['all']`

```tsx
<SegmentedPriceToggle size="md" allowedModes={allowedModes} />
```

