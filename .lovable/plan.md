

## Plan: Nischade lokala tjänstesidor för long-tail SEO

### Problemet

Ni rankar bra på breda termer som "montering knivsta", men tappar trafik på specifika sökningar som **"montera kök knivsta"**, **"montera IKEA kök knivsta"**, **"badrumsrenovering uppsala"**, **"golvläggning täby"** etc. Konkurrenter som byggfirma-knivsta.se och köksmontering.se fångar dessa sökare istället.

### Lösning

Utöka `LOCAL_SERVICES` med **nischade sub-tjänster** som matchar exakt hur folk söker. Samma dynamiska route (`/tjanster/:serviceSlug/:areaSlug`) används — vi lägger bara till fler slugs med anpassat innehåll.

### Nya sub-tjänster att lägga till

**Montering-nischer:**
- `koksmontering` — "Köksmontering" (IKEA-kök, platsbyggt, vitvaror)
- `mobelmontering` — "Möbelmontering" (IKEA, garderober, hyllsystem)

**Snickeri-nischer:**
- `badrumsrenovering` — "Badrumsrenovering" (totalrenovering, kakel, VVS)
- `koksrenovering` — "Köksrenovering" (nya kök, bänkskivor, vitvaror)
- `altanbygge` — "Altanbygge" (trädäck, inglasning, räcken)

**Målare-nischer:**
- `fasadmalning` — "Fasadmålning" (utvändig målning, puts)
- `inomhusmalning` — "Inomhusmålning" (tapetsering, spackling)

**Golv-nischer:**
- `golvlaggning` — "Golvläggning" (parkett, vinyl, klinker)

**El-nischer:**
- `elinstallation` — "Elinstallation" (uttag, belysning, elbilsladdare)

**Det ger ~10 nya slugs × 54 orter = ~540 nya sidor** (totalt ~1080 sidor).

### Tekniska ändringar

**1. `src/data/localServiceData.ts`**
- Lägg till nya entries i `LOCAL_SERVICES` med unika slugs
- Lägg till priser i `SERVICE_PRICES`
- Lägg till myter i `SERVICE_MYTHS`
- Lägg till engelska namn i `SERVICE_NAME_EN`
- Uppdatera title-templates med nischade, konverteringsfokuserade titlar

**2. Content-generering**
- Uppdatera `generateLocalContent()` med unika H1:or, descriptions och FAQ:er per sub-tjänst
- T.ex. "Köksmontering Knivsta ★ IKEA-kök & platsbyggt · ROT 30%"
- Sub-tjänster får egna myths, fun facts och unika omdömen

**3. Sitemaps & AI-filer**
- Uppdatera `public/sitemap.xml` med alla nya URL:er
- Uppdatera `public/llms.txt` och `knowledge-base.json` med nya tjänster

**4. Intern länkning**
- "Fler tjänster i [ort]"-sektionen visar även sub-tjänster
- Huvudtjänstsidorna (t.ex. `/tjanster/montering/knivsta`) länkar till nischade sidor (`/tjanster/koksmontering/knivsta`)

### Prioritetsordning

Baserat på sökvolym och konkurrensbilden i screenshoten:
1. **Köksmontering** + **Möbelmontering** (högst sökvolym, direkt konkurrens)
2. **Badrumsrenovering** + **Köksrenovering** (dyra projekt, hög konvertering)
3. **Golvläggning** + **Altanbygge** (säsongsbetonat men högt värde)
4. **Fasadmålning** + **Inomhusmålning** + **Elinstallation** (kompletterande)

