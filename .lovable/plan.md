

# Återställ prerendering till ~2,100 filer (bara BASE_SERVICES)

## Ändring

**`vite-plugin-prerender-local.ts`** — rad 173:

Ändra från:
```typescript
const ALL_SERVICES = [...BASE_SERVICES, ...EXPANDED_SERVICES];
```

Till:
```typescript
const ALL_SERVICES = [...BASE_SERVICES];
```

Detta återställer till de ~20 bastjänsterna (~2,100 filer) som vi hade innan.

