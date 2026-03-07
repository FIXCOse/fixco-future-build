

## Plan: Rivning — korrigerat pris till 958 kr/h inkl moms

Snickeri har idag `basePrice: 859` i koden, men korrekt pris är **958 kr/h inkl moms** enligt dig. Planen uppdateras:

### Ändringar

#### 1. Korrigera snickeri-pris (`src/data/servicesDataNew.ts`)
- Ändra `mainServices` → snickeri → `basePrice: 859` → **958**
- Ändra alla snickeri sub-services som har basePrice 859 → **958**

#### 2. Lägg till Rivning med pris 958 kr/h
Exakt samma plan som godkänts tidigare, men med **958** istället för 859 överallt:

- **`src/data/servicesDataNew.ts`**: Ny tjänst "Rivning" med `basePrice: 958`, ROT-berättigad, sub-services (badrum, kök, innerväggar, golv, totalrivning)
- **`src/data/localServiceData.ts`**: Lägg till i LOCAL_SERVICES, titlar/meta utan priser
- **`src/data/localSeoData.ts`**: Sökordsmönster (rivare, rivningsfirma, demolering etc.)
- **`src/lib/skillCategoryMapping.ts`**: Mapping för 'demolition'
- **`public/services.csv`**: Ny rad med 545-795 prisintervall (samma som snickare i CSV)
- **`src/i18n/locales/sv.json` & `en.json`**: Översättningar
- **`src/features/requests/serviceConfig.ts`**: Formulärfält för rivning

#### 3. `public/services.csv` — uppdatera snickare-rad
Kontrollera att snickare-raden reflekterar korrekt pris (CSV visar prisintervall, inte exakt timpris).

Alla SEO-titlar och meta-beskrivningar **utan prisuppgifter** — oförändrat från godkänd plan.

