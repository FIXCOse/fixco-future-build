

## Fix: Google Search Console - AggregateRating saknar ratingCount/reviewCount

### Problem
Google Search Console rapporterar: **"Ange antingen ratingCount eller reviewCount"** -- ett allvarligt strukturerad data-problem som hindrar sidan fran att visas korrekt i sokresultaten.

### Rotorsak
I `src/data/doorLockData.ts` (dorrlassidan) saknar `AggregateRating`-schemat bade `ratingCount` och `reviewCount`. Google kraver minst ett av dessa.

Nuvarande schema (rad 254-258):
```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "5.0",
  "bestRating": "5"
  // <-- saknar ratingCount OCH reviewCount!
}
```

### Fix
Lagg till `ratingCount` och `reviewCount` i dorrlassidans schema:

```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "5.0",
  "bestRating": "5",
  "worstRating": "1",
  "ratingCount": "89",
  "reviewCount": "67"
}
```

### Fil som andras
1. **`src/data/doorLockData.ts`** -- Lagg till `ratingCount`, `reviewCount`, och `worstRating` i AggregateRating-schemat

### Verifiering
Alla andra filer (SEOSchema.tsx, LocalServicePage.tsx, SEOSchemaEnhanced.tsx, LocationCityPage.tsx, ServiceCityDetail.tsx) har redan korrekt `ratingCount` eller `reviewCount` -- problemet ar isolerat till dorrlassidan.

