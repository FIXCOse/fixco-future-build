

## Ta bort "127+ installationer" från dörrlåssidan

Två ställen behöver uppdateras:

### 1. DoorLockLandingPage.tsx (rad 67)
Ändra badge-texten från `"5/5 betyg • 127+ installationer"` till `"5/5 betyg"`.

### 2. doorLockData.ts (rad 257)
Ta bort `"reviewCount": "127"` från Schema.org AggregateRating-objektet, så att Google inte visar felaktigt antal.

