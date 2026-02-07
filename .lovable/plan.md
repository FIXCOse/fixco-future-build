

## Länka Dörrlås-landningssidan -- Intern SEO-länkning

### Problem

Sidan `/tjanster/dorrlas` existerar men har **inga interna länkar** -- den ar en "orphan page" som bara kan nås genom att skriva URL:en direkt. Detta ar dåligt for:
- **SEO**: Google prioriterar sidor med stark intern länkning
- **UX**: Besökare kan inte hitta sidan
- **Konvertering**: Missade leads

### Lankning som behövs

Dörrlås-sidan ska länkas fran **5 strategiska platser** (utan att överlasta navigationen):

---

### 1. Navbar2 -- Tjänstemenyn (dropdown)

Lägg till "Dörrlås" som en **9:e tjänst** i services-listan i `src/components/Navbar2.tsx`:

| Plats | Vad visas |
|-------|-----------|
| Desktop dropdown | "Dörrlås" med description "Smarta lås & säkerhet" |
| Mobil-länk | Samma, leder till `/tjanster/dorrlas` |

Paths-objektet utökas med `dorrlas: '/tjanster/dorrlas'` (sv) och `dorrlas: '/en/services/door-locks'` (en).

---

### 2. ServiceDetail (Montering-sidan)

I `src/pages/ServiceDetail.tsx`, lägg till en **highlight-banner** ovanför sub-services-griden när slug = "montering":

```text
+------------------------------------------------------+
| Nytt! Installation av smarta dörrlås                |
| Yale Doorman, Linus, Nuki m.fl. | 30% ROT-avdrag   |
|                        [Se mer ->]                   |
+------------------------------------------------------+
```

Samma logik kan appliceras for slug = "tekniska-installationer".

---

### 3. CityServicesGrid (lokala sidor)

I `src/components/city/CityServicesGrid.tsx`, lägg till dörrlås som ett **extra kort** i griden:

```text
{ slug: "dorrlas", name: "Dörrlås", icon: Lock, description: "Smarta lås" }
```

Länken pekar till `/tjanster/dorrlas` (inte `/tjanster/dorrlas/:citySlug` -- dörrlåssidan är global, inte lokal).

---

### 4. Smart Hem-sidan

I `src/pages/SmartHome.tsx`, lägg till en sektion eller knapp som länkar till dörrlåssidan -- smarta lås ar en naturlig del av smart hem-erbjudandet.

---

### 5. Footer

I `src/components/layouts/GlobalFooter.tsx`, lägg till "Dörrlås" under tjänst-länkarna.

---

### Tekniska filer som ändras

| Fil | Ändring |
|-----|---------|
| `src/components/Navbar2.tsx` | Lägg till `dorrlas` i `paths` och `services`-arrayen |
| `src/pages/ServiceDetail.tsx` | Villkorlig highlight-banner for montering/tekniska |
| `src/components/city/CityServicesGrid.tsx` | Nytt kort med Lock-ikon |
| `src/pages/SmartHome.tsx` | CTA-länk till dörrlåssidan |
| `src/components/layouts/GlobalFooter.tsx` | Ny länk i footer |
| `src/utils/routeMapping.ts` | Lägg till `/tjanster/dorrlas` <-> `/en/services/door-locks` mapping |
| `src/utils/slugMapping.ts` | Samma mapping for slugMapping |

### SEO-effekt

Fran 0 interna länkar till **5+ kontextuella länkar** fran relevanta sidor, vilket:
- Signalerar till Google att sidan ar viktig
- Distribuerar PageRank fran startsidan och tjänstesidorna
- Ökar chansen att besökare hittar och bokar dörrlåsinstallation

