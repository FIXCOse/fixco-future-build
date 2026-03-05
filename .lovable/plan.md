

## Fix: Förbättra AI-prompten för uppföljningsmail

### Problem
1. AI:n inkluderar offertens titel ("Offert – Snickare Tyresö") i mailtexten — ser konstigt ut
2. AI:n skriver e-postadresser inom parentes `(info@fixco.se)` — ser amatörmässigt ut
3. Texten saknar press/urgency — ska nämna att Fixco fylls upp inför våren, begränsat med tider, behöver planera etc.

### Ändring i `supabase/functions/generate-followup-text/index.ts`

Uppdatera system-prompten (body-generering) med dessa regler:

- **ALDRIG** nämna offertens titel/namn i texten
- **ALDRIG** skriva e-postadresser inom parentes
- Lägg till **urgency**: "vi fyller snabbt på schemat inför våren", "begränsat antal platser", "vi behöver planera i god tid"
- Tonen: vänlig men med tydlig press att agera snart
- Fortfarande kort (6-8 meningar), professionell, inte skrämmande

Exempel på ny prompt-riktning:
```
- Nämn ALDRIG offertens titel eller namn i texten
- Skriv ALDRIG e-postadresser inom parentes
- Lägg till urgency: nämn att schemat fylls på snabbt inför våren/säsongen, att ni behöver planera i god tid, och att det är smart att boka sin plats nu
- Tonen ska vara vänlig men med tydlig känsla av "agera snart"
```

### Fil
- **Ändrad:** `supabase/functions/generate-followup-text/index.ts` — uppdaterad system-prompt

