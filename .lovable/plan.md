

## Plan: Lägg till 15 rivningstjänster via Edge Function

Databasen har 0 rivningstjänster. Migrationsverktyget kan inte köra INSERT-satser, så jag skapar en temporär edge function som seedar datan.

### Steg

1. **Skapa edge function `seed-rivning-services/index.ts`** som insertar alla 15 tjänster med `ON CONFLICT (id) DO NOTHING`
2. **Deploya och anropa funktionen** via curl för att populera databasen
3. **Verifiera** att alla 15 rader finns i `services`-tabellen
4. **Ta bort edge functionen** efter lyckad seed

### Data
Alla 15 tjänster med `category: 'rivning'`, `base_price: 958`, `rot_eligible: true`, `price_unit: 'kr/h'`, svenska + engelska titlar/beskrivningar, och cross-listing via `additional_categories` för badrum/kök/golv-tjänsterna.

### SEO-påverkan
Inga kodändringar behövs. Befintliga hooks, lokala SEO-sidor (590+), och filtergränssnitt hämtar automatiskt tjänster med `category = 'rivning'` från databasen.

