

## Synka modalens språk med URL vid varje öppning

### Problem
`modalLang` sätts bara en gång vid komponentens mount via `useState`-initialiseraren. Om användaren byter språk på sajten (t.ex. navigerar till `/en/...`) och sedan öppnar modalen igen, behåller den det gamla språkvalet.

### Lösning
Lägg till en `useEffect` som uppdaterar `modalLang` baserat på `window.location.pathname` varje gång `open` blir `true`.

### Ändring i `src/features/requests/ServiceRequestModal.tsx`

Lägg till efter rad ~232 (efter `useScrollLock(open)`):

```tsx
useEffect(() => {
  if (open) {
    const detectedLang = window.location.pathname.startsWith('/en') ? 'en' : 'sv';
    setModalLang(detectedLang);
  }
}, [open]);
```

Det är allt — en 4-raders ändring.

