

# Plan: Förhindra att påminnelsemail hamnar i Gmail Kampanjer

## Problem
Gmail klassificerar mailet som "Kampanj/Promotions" pga den tunga HTML-designen med gradient-header, badges, CTA-knappar och marknadsföringsliknande layout. Mottagaren får ingen notis.

## Orsak
Gmail's filter triggas av:
- Färgglad gradient-header med badge
- Stor CTA-knapp med stark färg
- Hög HTML-till-text-ratio
- Marknadsföringsliknande struktur (header → card → footer)
- Emojis i rubrik/badge

## Lösning
Skriv om `send-reminder-email` HTML-mallen till en **enkel, personlig stil** — som om någon skickar ett vanligt mail. Inga gradienter, inga badges, ingen fancy layout. Bara ren text i HTML med en diskret länk.

### Ny mall-stil:
- **Ingen header/banner** — börja direkt med hälsning
- **Inga CTA-knappar** — använd en vanlig textlänk istället
- **Minimal styling** — bara grundläggande typsnitt, inga bakgrundsfärger
- **Giltighetstid** som vanlig text, inte i en färgad box
- **Ingen footer med logga** — bara "Med vänliga hälsningar, Fixco" + kontaktinfo som text
- **Inga emojis** i HTML (ok i ämnesraden om admin skriver det)

### Exempel på ny struktur:
```
Hej [Namn],

[Admin-skriven brödtext]

Offerten gäller till [datum].

Du kan se din offert här: [vanlig länk]

Med vänliga hälsningar,
Fixco
info@fixco.se | 079-335 02 28
```

### Fil att ändra:
- `supabase/functions/send-reminder-email/index.ts` — byt ut emailHtml-mallen
- Omdeploya edge function efteråt

### Vad som INTE ändras:
- `ReminderEmailDialog.tsx` — admin-UI:t behöver inga ändringar
- `generate-reminder-text` — AI-genereringen fungerar redan bra
- Ämnesraden bestäms fortfarande av admin/AI

