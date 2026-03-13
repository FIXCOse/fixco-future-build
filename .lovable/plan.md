

# Fix: Visa förklarande felmeddelanden istället för "Invalid input: expected string, received undefined"

## Problem
När formuläret skickas med tomma fält får Zod `undefined`-värden istället för tomma strängar. Zod visar då det tekniska felet "Invalid input: expected string, received undefined" istället för de svenska felmeddelanden som redan finns definierade (t.ex. "Namn måste vara minst 2 bokstäver").

## Orsak
`values`-objektet har inte alla nycklar satta från start — de är `undefined` tills användaren skriver i fältet. Zod's `.string()` kräver att värdet är en sträng, inte `undefined`.

## Lösning

### `src/features/requests/bookingValidation.ts`
Wrappa varje fält i schemat med `z.preprocess((val) => val ?? '', ...)` så att `undefined` konverteras till `''` innan validering. Då triggas de riktiga felmeddelandena:

| Fält | Felmeddelande som visas |
|------|------------------------|
| name | "Namn måste vara minst 2 bokstäver" |
| email | "E-post krävs" |
| phone | "Telefonnummer krävs" |
| address | "Adress måste vara minst 5 tecken" |
| postal_code | "Ogiltigt postnummer (format: 123 45)" |
| city | "Ort måste vara minst 2 bokstäver" |

Ändringen görs i `serviceRequestSchema`-objektet — varje strängfält som kan vara `undefined` wrappas med preprocess.

