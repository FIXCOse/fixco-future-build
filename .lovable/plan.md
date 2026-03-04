

## Fix: Default theme alltid "light" oavsett enhet

**Problem:** I `src/theme/useTheme.ts` (rad 38) används `prefers-color-scheme: dark` som fallback när inget finns sparat i localStorage. Det gör att mobiler/datorer med mörkt systemtema får dark som default.

**Fix:** Ta bort systempreferens-checken och hardcoda `'light'` som fallback.

**Fil:** `src/theme/useTheme.ts`, rad 37-38

Ändra:
```typescript
const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
const initial: ThemeId = saved ?? (prefersDark ? 'dark' : 'light');
```
Till:
```typescript
const initial: ThemeId = saved ?? 'light';
```

En rad bort, en rad ändrad. Alla nya besökare får alltid light-tema. Befintliga användare med sparat val i localStorage påverkas inte.

