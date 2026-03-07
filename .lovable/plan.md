

## Plan: Ta bort telefonnummer och ersätt med "Boka Hembesök"

Telefonnumret visas på **14 ställen** i kodbasen. Jag tar bort/ersätter alla publika instanser med "Boka Hembesök"-knappar som öppnar `openServiceRequestModal({ mode: 'home_visit', showCategories: true })`. Admin/worker-sidor och privacy-sidan behålls orörda.

### Filer att ändra (10 filer)

| Fil | Ändring |
|---|---|
| **Navigation.tsx** | Desktop: ersätt telefon-länk (rad 231-238) med "Boka Hembesök"-knapp. Mobil: ersätt telefon-länk (rad 417-424) med "Boka Hembesök"-knapp |
| **GlobalStickyCTA.tsx** | Desktop: ta bort telefonnr-display (rad 114-115) och "Ring nu"-knapp (rad 135-143). Mobil: ersätt telefon-knapp (rad 85-90) med hembesöks-knapp. Ersätt `+46 79 335 02 28` med "Uppsala & Stockholm" |
| **HeroV2.tsx** | Ersätt "Ring oss"-knapp (rad 87-97) med "Boka Hembesök"-knapp som öppnar modalen |
| **CTAV2.tsx** | Ersätt telefon-länk med "Boka Hembesök" |
| **Contact.tsx** | Ersätt telefon-kortet (rad 295-303) med "Boka Hembesök"-kort med Calendar-ikon |
| **FAQTeaser.tsx** | Ersätt "Ring oss"-knapp (rad 106-110) med "Boka Hembesök" |
| **BlogPost.tsx** | Ersätt "Ring oss"-knapp (rad 620-624) med "Boka Hembesök" |
| **DoorLockLandingPage.tsx** | Ersätt båda telefon-knapparna (rad 93-97, 489-493) med hembesöks-knappar |
| **BookVisit.tsx** | Ta bort telefonnummer-raden (rad 325-329) |
| **ServiceCityPage.tsx** | Ersätt båda "Ring"-länkarna (rad 132-136, 270-276) med "Begär offert"-knappar |

### Ej ändrade (behåller telefonnummer)
- **CareersContact.tsx** — HR-kontakt, behövs
- **Privacy.tsx** — Juridisk kontaktinfo
- **StickyCTA.tsx / StickyCtaBar.tsx / StickyPhoneButton.tsx** — Redan dolda/utkommenterade per memories
- **Admin/Worker-sidor** — Interna verktyg
- **ConversationManager.ts** — AI-chat, internt
- **SEOSchemaEnhanced.tsx** — Schema.org, uppdateras till contactPoint med email istället

Alla ersättningar använder det etablerade mönstret: `openServiceRequestModal({ mode: 'home_visit', showCategories: true })`.

