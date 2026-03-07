

## Plan: Lägg till rivningstjänster i databasen

Det finns 0 tjänster med category `rivning` i databasen. Jag lägger till **15 relevanta rivningstjänster** via SQL INSERT. Alla med `base_price: 958`, `rot_eligible: true`, `price_unit: 'kr/h'`.

### Tjänster att lägga till

| ID | Titel (SV) | Titel (EN) | Typ |
|---|---|---|---|
| rivning-badrum | Rivning badrum | Bathroom demolition | quote |
| rivning-kok | Rivning kök | Kitchen demolition | quote |
| rivning-innervaggar | Rivning innerväggar | Interior wall demolition | hourly |
| rivning-golv | Rivning golv | Floor demolition | hourly |
| rivning-kakel-klinker | Rivning kakel & klinker | Tile removal | hourly |
| rivning-totalrivning | Totalrivning / stomrent | Full strip-out | quote |
| rivning-haltagning | Håltagning betong/tegel | Concrete/brick core drilling | hourly |
| rivning-tak-innertak | Rivning innertak | Ceiling demolition | hourly |
| rivning-fasad | Rivning fasad/utvändigt | Exterior demolition | quote |
| rivning-garage | Rivning garage/förråd | Garage/shed demolition | quote |
| rivning-altan-terrass | Rivning altan & terrass | Deck/patio demolition | quote |
| rivning-bortforsling | Bortforsling & container | Waste disposal & skip | hourly |
| rivning-asbestsanering | Asbestsanering | Asbestos removal | quote |
| rivning-vattenskadat | Rivning vattenskadat material | Water damage tearout | hourly |
| rivning-eldstad | Rivning eldstad/skorsten | Fireplace/chimney demolition | quote |

### Cross-listing
- `rivning-badrum` → additional_categories: `['badrum']`
- `rivning-kok` → additional_categories: `['kok']`
- `rivning-golv` → additional_categories: `['golv']`

### Implementation
En SQL INSERT med alla 15 rader i `services`-tabellen. Inga kodändringar behövs — befintlig `useServices`-hook hämtar automatiskt tjänster med `category = 'rivning'` och ServiceDetail visar dem.

