

## Plan: Fix rivning translation keys, category mapping, and navbar

### Problem
1. "serviceCategories.rivning.title" shows as raw key — translation missing from copy system
2. "0 tjänster" — `rivning` missing from `categoryMap` in ServiceDetail.tsx so DB services aren't filtered
3. Rivning not in navbar services dropdown

### Changes

#### 1. `src/copy/keys.ts` — Add rivning copy keys
Add `'serviceCategories.rivning'`, `'serviceCategories.rivning.title'`, `'serviceCategories.rivning.description'` to the CopyKey union type.

#### 2. `src/copy/sv.ts` — Add Swedish translations
```
'serviceCategories.rivning': 'Rivning',
'serviceCategories.rivning.title': 'Rivning',
'serviceCategories.rivning.description': 'Badrum, kök, väggar & bortforsling',
```

#### 3. `src/copy/en.ts` — Add English translations
```
'serviceCategories.rivning': 'Demolition',
'serviceCategories.rivning.title': 'Demolition',
'serviceCategories.rivning.description': 'Bathroom, kitchen, walls & disposal',
```

#### 4. `src/pages/ServiceDetail.tsx` — Add category mapping
Add `'rivning': 'rivning'` to `categoryMap` so database services with category "rivning" are found.

#### 5. `src/components/Navbar2.tsx` — Add rivning to navbar
- Add `rivning: '/tjanster/rivning'` (and EN variant) to `paths`
- Add rivning entry to `services` array with translation keys

