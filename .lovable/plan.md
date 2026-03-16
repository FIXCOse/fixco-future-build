

# Plan: Uppdatera påminnelsemailet till samma stil som offertmailet

## Problem
Påminnelsemailet hamnar i "Kampanjer" i Gmail. Offertmailet (`send-quote-email-new`) hamnar i Primär och har en beprövad mall med gradient-header, card-layout och CTA-knapp.

## Lösning
Uppdatera `send-reminder-email/index.ts` till att använda **samma HTML-struktur** som `send-quote-email-new`:
- Gradient-header (`#111827 → #4f46e5`) med "Påminnelse – Offert [nummer]"
- Vit card med admin-texten som brödtext
- Giltighetstid i en grå box (som prisboxen i offertmailet)
- CTA-knapp "Se din offert" (indigo, samma stil)
- Enkel footer med "Med vänliga hälsningar, Fixco Team"
- **Ta bort telefonnumret** (`079-335 02 28`) från signaturen

## Fil att ändra
`supabase/functions/send-reminder-email/index.ts` — byt ut `emailHtml`-mallen till offertmall-stilen. Omdeploy efteråt.

Inget annat ändras (dialog, generate-reminder-text, knappen).

