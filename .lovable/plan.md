

## Lägg till språkstöd i ServiceRequestModal

Modalen har ~40 hårdkodade svenska strängar. Planen är att lägga till en intern `modalLang` state med en liten språkväxlare i headern, och ersätta alla hårdkodade strängar med ett lokalt dictionary-objekt.

### Approach

Lägg till ett lokalt `translations`-objekt direkt i `ServiceRequestModal.tsx` (inget behov av att utöka copy-systemet för en portal-komponent). En liten Globe-knapp i modal-headern växlar mellan `sv` och `en`.

### Ändringar i `src/features/requests/ServiceRequestModal.tsx`

**1. Lägg till state + dictionary (~rad 56)**
```tsx
const [modalLang, setModalLang] = useState<'sv' | 'en'>('sv');
```

Dictionary-objekt med ~30 nycklar:
| Nyckel | SV | EN |
|---|---|---|
| `bookHomeVisit` | Boka Hembesök | Book Home Visit |
| `requestQuote` | Begär offert | Request Quote |
| `thankYou` | Tack för din förfrågan! | Thank you! |
| `weWillReturn` | Vi återkommer så snart som möjligt. | We'll get back to you shortly. |
| `selectServices` | Välj tjänster | Select services |
| `selectCategory` | Välj tjänstekategori | Select service category |
| `addExtras` | Vill du lägga till något mer? | Want to add extras? |
| `mostChoose` | De flesta kunder väljer 1-2 tillägg | Most customers choose 1-2 extras |
| `howSoon` | Hur snart önskar du hjälp? | How soon do you need help? |
| `asap` | Så snart som möjligt | As soon as possible |
| `within12days` | Inom 1-2 dagar | Within 1-2 days |
| `withinWeek` | Inom en vecka | Within a week |
| `nextMonth` | Nästa månad | Next month |
| `contactInfo` | Kontaktuppgifter | Contact details |
| `bookingAs` | Jag bokar som | I'm booking as |
| `private` | Privat | Private |
| `company` | Företag | Company |
| `brf` | BRF | HOA |
| `yourName` | Ditt namn * | Your name * |
| `contactPerson` | Kontaktperson * | Contact person * |
| `continue` | Fortsätt | Continue |
| `back` | Tillbaka | Back |
| `cancel` | Avbryt | Cancel |
| `skip` | Hoppa över | Skip |
| `sending` | Skickar… | Sending… |
| `sendQuote` | Skicka offertförfrågan | Send quote request |
| `sendBooking` | Skicka bokning | Send booking |
| `projectDetails` | Projektdetaljer | Project details |
| `address` | Adress | Address |
| `postalCode` | Postnummer | Postal code |
| `city` | Ort | City |
| `popular` | Populär | Popular |
| `yourOrder` | Din beställning | Your order |
| `total` | Totalt | Total |
| `changeAddons` | Ändra tillägg | Change extras |

**2. Språkväxlare i headern (~rad 399)**
Lägg till en Globe-knapp bredvid stäng-knappen:
```tsx
<button onClick={() => setModalLang(l => l === 'sv' ? 'en' : 'sv')}
  className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-muted/80 transition-colors">
  <Globe className="w-4 h-4 text-muted-foreground" />
  <span className="text-xs ml-1">{modalLang === 'sv' ? 'EN' : 'SV'}</span>
</button>
```

**3. Ersätt alla hårdkodade strängar**
Alla svenska strängar i JSX byts till `ml.nyckel` (där `ml` = `translations[modalLang]`). Placeholders i input-fält inkluderas också.

**4. Auto-detect från URL**
Initialisera `modalLang` baserat på `window.location.pathname.startsWith('/en')` för att automatiskt visa engelska för besökare på engelska sidor.

### Fil att ändra
| Fil | Åtgärd |
|---|---|
| `src/features/requests/ServiceRequestModal.tsx` | Lägg till lang state, dictionary, Globe-knapp, ersätt alla strängar |

