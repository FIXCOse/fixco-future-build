# FIXCO - File Structure & Routing Report

## File Tree Structure

```
src/
├── main.tsx                    # App entry point
├── App.tsx                     # Main router setup with ScrollToTop
├── index.css                   # Design system with semantic tokens
├── vite-env.d.ts              # TypeScript definitions
├── lib/
│   └── utils.ts               # Utility functions (cn)
├── components/
│   ├── ui/                    # Shadcn UI components (44 files)
│   ├── Navigation.tsx         # Main navigation
│   ├── ScrollToTop.tsx        # Scroll restoration ✅
│   ├── SegmentedPriceToggle.tsx # ALLA/ROT/RUT toggle ✅
│   ├── ServiceCardV3.tsx      # Unified service card ✅
│   ├── HeroUltra.tsx         # Enhanced hero with particles
│   ├── TrustBar.tsx          # Trust indicators
│   ├── ComparisonUltra.tsx   # Comparison with counters ✅
│   ├── FastServiceFilter.tsx  # Service filtering
│   └── [32 other components]
├── pages/
│   ├── Home.tsx              # Landing page
│   ├── Services.tsx          # All services page
│   ├── ServiceDetail.tsx     # Service detail pages
│   ├── Contact.tsx           # Contact form
│   ├── FAQ.tsx               # FAQ page
│   ├── AboutUs.tsx           # About us
│   ├── BookVisit.tsx         # Booking page
│   ├── ROTInfo.tsx           # ROT information
│   ├── RUT.tsx               # RUT information
│   ├── Referenser.tsx        # References
│   └── NotFound.tsx          # 404 page
├── stores/
│   └── priceStore.ts         # ROT/RUT state management ✅
├── hooks/
│   ├── useCountUpOnce.ts     # One-time counters ✅
│   ├── useGlobalROT.ts       # ROT calculations
│   ├── useGlobalPricing.ts   # Pricing logic
│   └── [4 other hooks]
├── data/
│   ├── servicesData.ts       # Service definitions
│   ├── servicesDataNew.ts    # Enhanced service data
│   └── trustChips.config.ts  # Trust indicators
└── utils/
    └── priceFormatter.ts     # Price formatting
```

## Routing Map

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Home.tsx | Landing page with hero, comparison, services teaser |
| `/tjanster` | Services.tsx | All services with filtering |
| `/tjanster/:slug` | ServiceDetail.tsx | Individual service pages |
| `/kontakt` | Contact.tsx | Contact form and info |
| `/faq` | FAQ.tsx | Frequently asked questions |
| `/om-oss` | AboutUs.tsx | Company information |
| `/boka-besok` | BookVisit.tsx | Booking form |
| `/rot-info` | ROTInfo.tsx | ROT tax deduction info |
| `/rut` | RUT.tsx | RUT service information |
| `/referenser` | Referenser.tsx | Customer references |
| `/*` | NotFound.tsx | 404 error page |

## State Management

✅ **ROT Default Implementation**: `priceStore.ts` line 19 sets default to 'rot'
✅ **URL Sync**: Updates URL parameters without reload (lines 30-36)
✅ **localStorage Persistence**: Saves user preferences (line 85-86)
✅ **Live Filtering**: `shouldShowService` function filters data (lines 47-54)
✅ **Scroll Reset**: ScrollToTop component mounted in App.tsx (line 31)