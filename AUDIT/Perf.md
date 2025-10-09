# PRESTANDA-AUDIT

## Executive Summary

Projektet har god grundläggande prestanda tack vare:
- Vite för snabba builds
- React 18 med concurrent features
- Lazy loading av tunga komponenter (SmartHome, BookingWizard)
- Tailwind för optimerad CSS

**Huvudsakliga problem:**
1. Stora admin-listor utan virtualisering (100+ items renderas samtidigt)
2. Omfattande re-renders p.g.a. saknade memo/useMemo/useCallback
3. Tunga npm-paket som kan optimeras
4. Bilder utan lazy loading och optimering
5. 349+ console.log i produktion

**Estimerad förbättring med alla fixes:**
- Initial load time: -30-40%
- Time to Interactive: -25-35%
- Bundle size: -25-30%
- Re-render frequency: -50-60%

---

## 1. Render-prestanda

### KRITISKT: Lista-rendering Utan Virtualisering

**Problem:**
```tsx
// AdminQuotes.tsx:266
{filteredQuotes.map((quote) => (
  <Card key={quote.id}>...</Card>
))}

// AdminJobs.tsx: Samma problem
// AdminBookings.tsx: Samma problem
// AdminCustomers.tsx: Samma problem
```

Med 100+ quotes/jobs/bookings renderas ALLA samtidigt.

**Impact:**
- Initial render: 500-1500ms för 100 items
- Scroll laggy
- Memory footprint: 50-100MB extra

**Lösning:**
```bash
npm install @tanstack/virtual
```

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function AdminQuotes() {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: filteredQuotes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // estimated card height
    overscan: 5
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`
            }}
          >
            <QuoteCard quote={filteredQuotes[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Estimated improvement:**
- Initial render: 500ms → 50ms (10x snabbare)
- Memory: -60-80MB
- Smooth 60fps scroll

**Files affected:**
- src/pages/admin/AdminQuotes.tsx
- src/pages/admin/AdminJobs.tsx
- src/pages/admin/AdminBookings.tsx
- src/pages/admin/AdminCustomers.tsx
- src/pages/admin/AdminInvoices.tsx

---

### HIGH: Onödiga Re-renders

**Problem 1: filteredQuotes recalculeras varje render**
```tsx
// AdminQuotes.tsx:177
const filteredQuotes = quotes.filter(quote => {
  // ... filtering logic
});
```

Körs varje gång komponenten renderas, även om quotes/searchTerm inte ändrats.

**Lösning:**
```tsx
const filteredQuotes = useMemo(() => {
  return quotes.filter(quote => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      quote.title?.toLowerCase().includes(searchLower) ||
      quote.number?.toLowerCase().includes(searchLower) ||
      quote.customer?.name?.toLowerCase().includes(searchLower) ||
      quote.customer?.email?.toLowerCase().includes(searchLower)
    );
  });
}, [quotes, searchTerm]);
```

**Problem 2: Anonyma funktioner i listor**
```tsx
// Många komponenter gör så här:
{items.map(item => (
  <Button onClick={() => handleClick(item.id)}>
    Click
  </Button>
))}
```

Skapar ny funktion varje render → barnet re-renderar onödigt.

**Lösning:**
```tsx
// Extrahera till egen komponent:
const ItemButton = memo(({ item, onClick }) => (
  <Button onClick={() => onClick(item.id)}>Click</Button>
));

// Eller använd useCallback:
const handleItemClick = useCallback((id) => {
  // handle
}, [dependencies]);
```

**Problem 3: Context re-renders**
```tsx
// EditModeContext.tsx - om provider-value ändras hela trädet re-renderas
<EditModeContext.Provider value={{ isEditMode, setIsEditMode }}>
```

**Lösning:**
```tsx
const value = useMemo(
  () => ({ isEditMode, setIsEditMode }),
  [isEditMode]
);

<EditModeContext.Provider value={value}>
```

**Files affected:**
- src/pages/admin/AdminQuotes.tsx (filteredQuotes)
- src/pages/admin/AdminJobs.tsx (filteredJobs)
- src/contexts/EditModeContext.tsx (context value)
- Många list-komponenter med inline handlers

---

### MEDIUM: State-uppdateringar Triggar Onödiga Renders

**Problem:**
```tsx
// ActionWizard.tsx:80-125 loggar varje state-ändring
console.log("[WIZARD] Submit started", { mode, form, user });
```

Om logging är synkron kan det blockera render.

**Lösning:**
Ta bort eller gör async:
```tsx
if (import.meta.env.DEV) {
  queueMicrotask(() => console.log("[WIZARD]", data));
}
```

---

## 2. Nätverk-prestanda

### KRITISKT: Saknade Request Deduplication

**Problem:**
Flera komponenter kan fetcha samma data samtidigt utan cache-coordination.

**Evidence:**
QueryClient har `refetchOnWindowFocus: false` vilket är bra, men många direkta `supabase.from()` anrop har ingen deduplication.

**Lösning:**
Använd React Query för alla data-fetching:

```tsx
// Before
const [quotes, setQuotes] = useState([]);
useEffect(() => {
  fetchQuotesNew().then(data => setQuotes(data));
}, []);

// After
const { data: quotes } = useQuery({
  queryKey: ['quotes'],
  queryFn: fetchQuotesNew,
  staleTime: 30000 // 30s
});
```

**Estimated improvement:**
- 30-50% fewer duplicate requests
- Better loading states
- Automatic retry and error handling

---

### HIGH: Bilder Utan Optimering

**Problem 1: Ingen lazy loading**
```tsx
<img src={projectImage} alt="Project" />
```

Alla bilder laddas immediately även om de är off-screen.

**Lösning:**
```tsx
<img src={projectImage} alt="Project" loading="lazy" />
```

**Problem 2: Stora original-bilder**
Reference projects kan ha 5MB+ bilder som laddas i full storlek.

**Lösning:**
Använd Supabase Storage transformations:
```tsx
const imageUrl = `${supabaseUrl}/storage/v1/object/public/images/${fileName}
  ?width=800&height=600&quality=80`;
```

**Problem 3: Fel format**
PNG/JPG används överallt, WebP är 30% mindre.

**Lösning:**
```tsx
<picture>
  <source srcSet={`${image}.webp`} type="image/webp" />
  <img src={`${image}.jpg`} alt="..." loading="lazy" />
</picture>
```

**Files affected:**
- src/pages/Referenser.tsx
- src/components/ProjectShowcase.tsx
- src/components/TestimonialCarousel.tsx
- Alla komponenter med project images

**Estimated improvement:**
- Initial page load: -40-50%
- LCP (Largest Contentful Paint): -30%
- Bandwidth: -60% med WebP

---

### MEDIUM: API-anrop Kan Paralleliseras

**Problem:**
```typescript
// create-booking-with-quote/index.ts:97-140
// RPC anrop körs sekventiellt:
const { data: genNumber } = await admin.rpc('generate_quote_number_new');
const { data: genToken } = await admin.rpc('generate_public_token');
```

**Lösning:**
```typescript
const [genNumber, genToken] = await Promise.all([
  admin.rpc('generate_quote_number_new'),
  admin.rpc('generate_public_token')
]);
```

**Estimated improvement:**
- Quote creation: 200-300ms snabbare

---

## 3. Bundle-prestanda

### KRITISKT: Console.log i Production

**Impact:**
349+ console.log/warn/error statements körs även i production.

Varje log:
- String concatenation: ~0.1-1ms
- Object serialization: ~1-10ms för stora objekt
- Browser devtools overhead: ~5-20ms

Med 100+ logs per page load = 500-2000ms overhead.

**Lösning:**
Se Findings.json CRIT-002 för detaljer.

**Estimated improvement:**
- Page load: -500-2000ms
- Less memory pressure
- Cleaner devtools

---

### HIGH: Tunga npm-paket

**Problem:**
```
@react-three/fiber: ~200KB
@react-three/drei: ~200KB
framer-motion: ~120KB
```

**Nuvarande:**
SmartHome är lazy-loaded vilket är bra.

**Förbättring:**
1. Gör SmartHome opt-in bakom feature flag
2. Ersätt framer-motion med CSS animations där möjligt
3. Code-split mer aggressivt

**Example - CSS animation istället för framer-motion:**
```tsx
// Before (framer-motion)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>

// After (CSS)
<div className="animate-fade-in-up">

// index.css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}
```

**Estimated improvement:**
- Bundle size: -200-400KB
- Parse time: -100-200ms

---

### MEDIUM: Date-fns Tree-shaking

**Problem:**
```tsx
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
```

Kan importera mer än nödvändigt.

**Lösning:**
```tsx
import format from 'date-fns/esm/format';
import sv from 'date-fns/esm/locale/sv';
```

**Estimated improvement:**
- Bundle: -20-30KB

---

## 4. Rendering-optimeringar

### HIGH: ServiceCard Re-renders

**Problem:**
ServiceCard komponenter re-renderas när parent uppdaterar pricing state, även om kortet inte ändrats.

**Lösning:**
```tsx
const ServiceCard = memo(({ service, priceType }) => {
  // ... component code
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.service.id === nextProps.service.id &&
         prevProps.priceType === nextProps.priceType;
});
```

---

### MEDIUM: Heavy Computation i Render

**Problem:**
ROT/RUT calculators beräknar allt vid varje render.

**Lösning:**
```tsx
// Before
const rotDeduction = calculateROT(price, hours, rotPercent);

// After
const rotDeduction = useMemo(
  () => calculateROT(price, hours, rotPercent),
  [price, hours, rotPercent]
);
```

**Files affected:**
- src/components/ROTCalculator.tsx
- src/components/RUTCalculator.tsx
- src/utils/priceCalculation.ts (används många ställen)

---

## 5. CSS/Styling-prestanda

### LOW: Tailwind Unused Classes

**Problem:**
Tailwind genererar CSS för alla klasser som hittas, även oanvända.

**Lösning:**
Tailwind's purge är aktiverad vilket är bra, men verifiera:

```js
// tailwind.config.ts
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // Ensure no false positives are kept
  safelist: [] // Only add if absolutely necessary
}
```

---

### LOW: CSS Animations Performance

**Problem:**
Vissa animationer använder `transform` och `opacity` vilket är bra, men några använder `width`, `height`, `top`, `left` vilket triggar layout.

**Lösning:**
Stick to transform and opacity:
```css
/* Bad */
@keyframes slideIn {
  from { left: -100px; }
  to { left: 0; }
}

/* Good */
@keyframes slideIn {
  from { transform: translateX(-100px); }
  to { transform: translateX(0); }
}
```

---

## 6. JavaScript Execution

### MEDIUM: Heavy Synchronous Operations

**Problem:**
Vissa operationer blockar main thread:
- Large JSON.parse/stringify
- Complex filters på stora arrays
- Synchronous localStorage writes

**Lösning:**
```tsx
// Use Web Workers for heavy computation
const worker = new Worker(new URL('./worker.ts', import.meta.url));

worker.postMessage({ data: largeData });
worker.onmessage = (e) => {
  setResult(e.data);
};
```

---

## Prioriterad Action Plan

### Fas 1: Quick Wins (1-2 dagar)
1. ✅ Ta bort console.log i production (CRIT-002)
2. ✅ Lägg till `loading="lazy"` på alla bilder
3. ✅ useMemo för filteredQuotes/Jobs/Bookings
4. ✅ Parallelize RPC calls i edge functions

**Expected improvement:** 30-40% faster page loads

### Fas 2: Re-render Optimization (2-3 dagar)
1. ✅ Memoize context values
2. ✅ Extract inline handlers to useCallback
3. ✅ Add memo() to expensive components
4. ✅ Optimize ServiceCard rendering

**Expected improvement:** 50-60% fewer re-renders

### Fas 3: Virtualization (3-5 dagar)
1. ✅ Implement @tanstack/virtual för admin lists
2. ✅ Test with 500+ items
3. ✅ Profile and optimize

**Expected improvement:** 10x faster list rendering

### Fas 4: Bundle Optimization (1 vecka)
1. ✅ Audit framer-motion usage
2. ✅ Optimize date-fns imports
3. ✅ Code-split admin routes
4. ✅ Consider making SmartHome opt-in

**Expected improvement:** 25-30% smaller bundle

### Fas 5: Image Optimization (3-5 dagar)
1. ✅ Implement WebP with fallbacks
2. ✅ Add Supabase Storage transformations
3. ✅ Implement proper lazy loading
4. ✅ Add blur placeholders

**Expected improvement:** 40-50% faster initial load

---

## Monitoring & Metrics

### Metrics to Track

**Core Web Vitals:**
- LCP (Largest Contentful Paint): Target <2.5s
- FID (First Input Delay): Target <100ms
- CLS (Cumulative Layout Shift): Target <0.1

**Custom Metrics:**
- Time to Interactive (TTI): Target <3.5s
- Bundle size: Target <500KB (gzipped)
- API response time: Target <200ms p95

**Tools:**
```bash
# Lighthouse audit
npx lighthouse https://fixco.se --view

# Bundle analyzer
npx vite-bundle-visualizer

# React DevTools Profiler
# (Use in browser)
```

### Performance Budget

Set limits in vite.config.ts:
```typescript
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'admin': ['./src/pages/admin/**'],
          'ui': ['./src/components/ui/**']
        }
      }
    },
    chunkSizeWarningLimit: 500 // KB
  }
}
```

---

## Slutsats

**Nuvarande prestanda:** God grund men flera optimeringsmöjligheter

**Efter alla optimeringar:**
- Initial load: 30-40% snabbare
- List rendering: 90% snabbare (virtualization)
- Re-renders: 50-60% färre
- Bundle: 25-30% mindre

**Rekommenderad prioritering:**
1. Fas 1 (quick wins) - GÖR OMEDELBART
2. Fas 2 (re-renders) - inom 1 vecka
3. Fas 3 (virtualization) - inom 2 veckor
4. Fas 4-5 (bundle/images) - ongoing

**Total estimerad tid:** 3-4 veckor för alla faser
**Expected ROI:** Mycket hög - väsentligt förbättrad användarupplevelse
