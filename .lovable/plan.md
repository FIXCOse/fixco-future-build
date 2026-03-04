

## Plan: Uppdatera referensprojekt H.W — ny text, fler bilder & videofråga

### 1. Uppdatera beskrivningstexten

Nuvarande text nämner bara hallgarderober och är lite för "hypeig" i slutet. Ny text ska:
- Nämna garderober i **både hall och sovrum**
- Ta bort "kunden var överlycklig"-delen
- Vara engagerande men inte överdrivet säljig
- Behålla professionell ton

**Ny svensk text (utkast):**
> "Hemma hos H.W i Liljeholmen väntade flera uppdrag. Balkongdörren hade slutat stänga ordentligt — utslitna gångjärn gjorde att den hängde snett och lämnade en springa som släppte in drag. Vi bytte gångjärnen och justerade dörren tills den åter satt perfekt i karmen. I hallen demonterade vi de gamla, uttjänta garderoberna och ersatte dem med nya skjutdörrsgarderober som utnyttjar utrymmet betydligt bättre. Samma uppgradering gjordes i sovrummet, där ytterligare garderober monterades för att ge mer och smartare förvaring. Snyggt, funktionellt och klart på två dagar."

**Ny engelsk text (utkast):**
> "At H.W's home in Liljeholmen, several tasks were waiting. The balcony door had stopped closing properly — worn-out hinges left it hanging at an angle, letting in drafts. We replaced the hinges and adjusted the door until it sat perfectly in the frame again. In the hallway, we dismantled the old, worn-out wardrobes and replaced them with new sliding-door wardrobes that make much better use of the space. The same upgrade was carried out in the bedroom, where additional wardrobes were installed for more and smarter storage. Clean, functional, and completed in two days."

**Features uppdateras:** Lägg till "Sovrumsgarderober" / "Bedroom Wardrobes"

### 2. Kopiera 3 nya bilder till projektet

- `IMG_2331.jpg` → `public/images/references/balkongdorr_gangjarn.jpg` (gångjärnsdetalj)
- `IMG_2330.jpg` → `public/images/references/garderob_sovrum.jpg` (färdig sovrumsgarderob)
- `IMG_2329.jpg` → `public/images/references/garderob_stomme.jpg` (garderobsstomme under montering)

### 3. Uppdatera databasen

Kör `UPDATE` på `reference_projects` för att:
- Sätta ny description/description_sv/description_en
- Lägga till de 3 nya bilderna i `images`-arrayen
- Uppdatera features med "Sovrumsgarderober"

### 4. Videor

Lovable kan hantera videofiler som statiska assets i `public/`-mappen, men det finns begränsningar:
- Videofiler kan bli **mycket stora** och Lovable har filstorleksgränser
- De kan inte streamas via Supabase Storage utan extra konfiguration
- Bästa alternativet: ladda upp videorna till t.ex. YouTube/Vimeo och bädda in dem, eller ladda upp dem till Supabase Storage via dashboarden

Jag kan absolut lägga till videostöd i referensprojektkorten om du vill — men själva videofilerna bör helst hostas externt.

