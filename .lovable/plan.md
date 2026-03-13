

# Fix: Intro text not showing on local service pages

## Problem
`generateLocalIntroText` in `localSeoData.ts` (line 694) accesses `LOCAL_SERVICES` as if it were a key-value object (`LOCAL_SERVICES[serviceSlug]`), but `LOCAL_SERVICES` is actually an **array**. This always returns `undefined`, so the function returns `null` and no intro text is rendered.

## Fix
Change line 694 from:
```ts
const service = LOCAL_SERVICES[serviceSlug as LocalServiceSlug];
```
to:
```ts
const service = LOCAL_SERVICES.find(s => s.slug === serviceSlug);
```

Also fix line 698 — `service.nameEn` doesn't exist on the array item type. The service name for English should use `getServiceNameEn(serviceSlug)` (already used elsewhere in the file).

### File: `src/data/localSeoData.ts`
- Line 694: Use `.find()` instead of bracket access
- Line 698: Use `getServiceNameEn` helper for English name

One-line fix, affects all 16,400+ local pages.

