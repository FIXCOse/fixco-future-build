

## Ta bort Lovable favicon helt

### Vad som finns kvar
- **`public/favicon.ico`** — Lovable-standardfilen, ska raderas
- **`src/stores/contentStore.ts`** — `faviconUrl`-property pekar på `/favicon.ico`
- **`src/components/GlobalContentEditor.tsx`** — favicon-inställningsfält i admin-editorn

### Åtgärder

**1. Radera `public/favicon.ico`**

**2. Uppdatera `src/stores/contentStore.ts`**
- Ändra default `faviconUrl` från `'/favicon.ico'` till `'/assets/fixco-f-icon-large.png'`

**3. Inget behöver ändras i `index.html`**
- Redan korrekt: `<link rel="icon" type="image/png" href="/assets/fixco-f-icon-large.png" />`

