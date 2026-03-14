

# Plan: Rensa hero-titlar på nischsidor

## Problem
Hero-titlarna (H1) på nischsidorna ser röriga ut:
- **"Boka Renovera trapp"** — onödigt "Boka"-prefix
- **"Platsbyggd Garderob — Skräddarsydd Efter Ditt Hem"** — tagline hör hemma i meta, inte i H1
- Alla auto-genererade titlar via templates har `Boka ${name}` som mönster

## Åtgärd

### 1. `src/data/nicheServiceDataExpanded.ts`
Ändra alla `HERO_TITLE_SV`-templates från `Boka ${n}` till bara `${n}` (tjänstens namn rakt av). Samma för engelska (`Book ${n}` → `${n}`).

### 2. `src/data/nicheServiceData.ts`
Rensa de handskrivna heroTitles:
- `"Boka Elinstallation"` → `"Elinstallation"`
- `"Boka Möbelmontering"` → `"Möbelmontering"`
- `"Montera TV på Vägg — Snyggt, Säkert & Dolt Kablage"` → `"Montera TV på Vägg"`
- `"Installera Akustikpanel — Bättre Ljud & Snygg Design"` → `"Installera Akustikpanel"`
- `"Platsbyggd Garderob — Skräddarsydd Efter Ditt Hem"` → `"Platsbyggd Garderob"`
- `"Bygga Altan — Din Drömaltan Med ROT-avdrag"` → `"Bygga Altan"`
- `"Installera Laddbox Hemma — Ladda Elbilen Smidigt"` → `"Installera Laddbox Hemma"`
- Behåll säljande varianter som `"Bygg Din Drömaltan"`, `"Renovera Ditt Kök"` etc. — de har inget "Boka" och ingen "—"-tagline

### 3. Meta-titlar behålls säljande
`seoTitle` i `NicheServiceLandingPage.tsx` använder redan formatet `${heroTitle} – Fixco | ROT-avdrag & Garanti` — det behålls och kan förbättras med taglines i meta title/description istället.

**Resultat:** Rena, korta H1-titlar som "Platsbyggd Garderob", "Montera TV på Vägg", "Elinstallation". Säljargumenten lever kvar i meta description och undertexten.

