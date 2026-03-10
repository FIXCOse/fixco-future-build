

## Plan: Frågor till kund vid skapande av ny offert

### Problem
"Frågor till kund"-sektionen visas bara vid redigering (`{quote && (...)}`) eftersom frågor kräver ett `quote.id` för att sparas i databasen. Vid ny offert finns inget id ännu.

### Lösning

**Fil: `src/components/admin/QuoteFormModal.tsx`**

1. **Visa sektionen alltid** — ta bort `{quote && (` wrappern runt "Frågor till kund"-kortet
2. **Köa frågor lokalt vid ny offert** — lägg till state `pendingQuestions: string[]` som samlar frågor innan offerten sparats
3. **Vid skapande**: efter `createQuoteNew` returnerar resultatet med `result.id`, loopa igenom `pendingQuestions` och anropa `send-admin-question-to-customer` för varje fråga
4. **Vid redigering**: behåll befintligt beteende (skicka direkt via edge function)
5. **UI**: när `quote` inte finns, lägg till frågor i `pendingQuestions` istället. Visa dem i listan med "Skickas vid sparande"-badge

### Ändrad fil

| Fil | Ändring |
|-----|---------|
| `src/components/admin/QuoteFormModal.tsx` | Ta bort `{quote &&` guard, lägg till `pendingQuestions` state, skicka köade frågor efter skapande |

