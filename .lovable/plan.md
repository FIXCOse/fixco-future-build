

## Plan: Testmail ska spegla exakt kundversionen

### Problem
Testmailets ämnesrad använder alltid `[TEST] Offert ...` oavsett om offerten är en ersättning. Den borde visa `[TEST] Uppdaterad offert ...` om det är en replacement-offert. Resten av mailet (brödtext, banner, locale) hanteras redan korrekt.

### Ändring

**`supabase/functions/send-quote-email-new/index.ts`** — En ändring på rad 221-223:

Nuvarande:
```ts
const emailSubject = isTest 
  ? t.testSubject(quote.number) 
  : (isReplacement ? t.updatedSubject(quote.number) : t.subject(quote.number));
```

Ny logik + uppdaterade testSubject-strängar:
```ts
// Add testUpdatedSubject to quoteCopy for both sv and en
// sv: `[TEST] Uppdaterad offert ${num} från Fixco`
// en: `[TEST] Updated quote ${num} from Fixco`

const emailSubject = isTest 
  ? (isReplacement ? t.testUpdatedSubject(quote.number) : t.testSubject(quote.number))
  : (isReplacement ? t.updatedSubject(quote.number) : t.subject(quote.number));
```

Lägg till `testUpdatedSubject` i `quoteCopy`:
- **sv**: `testUpdatedSubject: (num: string) => \`[TEST] Uppdaterad offert ${num} från Fixco\``
- **en**: `testUpdatedSubject: (num: string) => \`[TEST] Updated quote ${num} from Fixco\``

Det är den enda ändringen som behövs — locale, ersättningsbanner, frågor, bilder etc. hanteras redan identiskt för test och riktiga mail.

