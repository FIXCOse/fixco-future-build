# CopyProvider Migration Status

## ✅ Completed (2/20):
- Elmontör Uppsala - 100% done
- Elmontör Stockholm - 100% done

## ⏳ Remaining (18/20):
1. VVS Uppsala
2. VVS Stockholm
3. Snickare Uppsala
4. Snickare Stockholm
5. Montering Uppsala
6. Montering Stockholm
7. Trädgård Uppsala
8. Trädgård Stockholm
9. Städ Uppsala
10. Städ Stockholm
11. Markarbeten Uppsala
12. Markarbeten Stockholm
13. Tekniska installationer Uppsala
14. Tekniska installationer Stockholm
15. Flytt Uppsala
16. Flytt Stockholm
17. Måleri Uppsala
18. Måleri Stockholm

## Strategy:
Due to the massive amount of data (~1800 translation keys remaining), we're doing this systematically:
1. Convert serviceCityData.ts structure (remove LocalizedString, use CopyKey)
2. Add all keys to keys.ts
3. Move Swedish text to sv.ts
4. Generate English translations in en.ts
5. Update ServiceCityDetail.tsx to use useCopy()
6. Update ServiceCityPage.tsx to use useCopy()
7. Add English routes to App.tsx
8. Update routeMapping.ts
9. Update sitemap.xml

## Current Build Errors:
- 18 TypeScript errors in serviceCityData.ts (using old 'h1' property)
- 42 TypeScript errors in ServiceCityDetail.tsx (accessing old properties like 'faqs', 'howItWorks')
- 10 TypeScript errors in ServiceCityPage.tsx (accessing old properties)

Total: 70 build errors to fix
