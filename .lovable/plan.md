

## Plan: Språkanpassad AI-generering + admin-instruktionsfält

### Problem
1. AI-prompten är alltid på svenska, oavsett offertens `locale`
2. Admin har ingen möjlighet att ge instruktioner till AI:n

### Ändringar

**1. `FollowUpEmailDialog.tsx`** — Lägg till:
- Prop `locale` (string) från parent
- State `adminInstructions` (string)
- Ett litet `Input`-fält med placeholder "Instruktioner till AI (valfritt)..." ovanför genereringsknapparna
- Skicka `locale` och `adminInstructions` till edge-funktionen

**2. `generate-followup-text/index.ts`** — Uppdatera:
- Ta emot `locale` och `adminInstructions` från request body
- Läs `quote.locale` som fallback om inget skickas
- Om locale är `'en'`: använd engelska systemprompts (samma regler men på engelska, "Hi {name}!", "Best regards,\nThe Fixco Team")
- Om locale är `'sv'`: befintliga svenska prompts
- Om `adminInstructions` finns: lägg till dem som ett extra stycke i systempromten: `"\n\nADMIN INSTRUCTIONS (follow these closely):\n${adminInstructions}"`

**3. Parent-komponent** — Skicka `locale` som prop till `FollowUpEmailDialog` (behöver identifiera var dialogen öppnas)

### Teknisk detalj — Engelska prompts

Subject (en):
```
You are a copywriter for Fixco, a Swedish construction & handyman company. Write a short, friendly subject line (max 50 chars) for a follow-up email about a quote. Natural and personal — not salesy. Reply ONLY with the subject line.
```

Body (en): Samma struktur som svenska men på engelska — urgency om scheduling, inga priser, inga offertnamn, inga e-postadresser i texten, börja med "Hi {name}!", avsluta med "Best regards,\nThe Fixco Team".

### Admin-instruktionsfältet
Litet input-fält (inte textarea) med collapsible/accordion-stil eller bara en enkel Input med label "AI-instruktioner" placerad direkt ovanför ämnesrad-sektionen. Instruktionerna skickas med varje AI-anrop (både subject och body).

