

# Återställ prerendering till alla 151 tjänster

## Ändring

**`vite-plugin-prerender-local.ts`** — rad 173:

Ändra från:
```typescript
const ALL_SERVICES = [...BASE_SERVICES];
```

Till:
```typescript
const ALL_SERVICES = [...BASE_SERVICES, ...EXPANDED_SERVICES];
```

## Risk

Bygget har redan failat med bara 2,120 filer (`deadline_exceeded` vid R2-upload). Med alla 151 tjänster genereras ~16,000 filer, så det är troligt att samma timeout inträffar igen. Men vi testar som du önskar — om det failar kan vi skala ner efteråt.

