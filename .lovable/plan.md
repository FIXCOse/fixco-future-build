

## Plan: Realtidsuppdatering av frågor + Ny maildesign

### Problem 1: Frågor syns inte utan sidladdning

I `handleAskQuestion` (rad 353-394 i QuotePublic.tsx) skickas frågan men det lokala `quote`-objektet uppdateras aldrig. Frågan läggs till i databasen via edge function men UI:t reflekterar inte ändringen.

**Fix**: Efter lyckad frågesubmit, lägg till den nya frågan lokalt i `quote.questions`-arrayen så den syns direkt utan refresh:

```ts
setQuote(prev => prev ? {
  ...prev,
  questions: [...prev.questions, {
    id: crypto.randomUUID(),
    question,
    customer_name: questionName,
    customer_email: questionEmail || '',
    asked_at: new Date().toISOString(),
    answered: false,
  }]
} : prev);
```

### Problem 2: Svarsmail har enkel design

`answer-quote-question/index.ts` använder en generisk blå HTML-mall. Den ska uppdateras till samma grafiska profil som offertbekräftelsemailet:

- Fixco-logga i headern (svart logga, `fixco-logo-black.png` från storage)
- Gradient-header (primärfärg, ej grön — kanske blå/lila för "svar"-tema)
- Samma layout: tabell med offertinfo, fråga-box med `border-top`-accent, svar-box med accent, CTA-knapp
- Samma footer med Fixco-kontaktinfo
- Inga `border-left` (mobilkompatibilitet per memories)
- `color: #ffffff !important` på CTA-knapp

### Filer att ändra

1. **`src/pages/QuotePublic.tsx`** — Uppdatera `handleAskQuestion` att lägga till frågan i lokalt state efter submit
2. **`supabase/functions/answer-quote-question/index.ts`** — Ny branded maildesign matchande offertbekräftelsemailet

