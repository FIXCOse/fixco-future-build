

## Plan: Språkväxlare i offertmodulen (QuoteFormModal)

### Vad
Lägga till en språkväxlare (SV/EN) i offertformuläret så att admin manuellt kan sätta eller ändra språk på en offert. Språket sparas i `quotes_new.locale` och styr vilken version kunden ser.

### Ändringar

**Fil: `src/components/admin/QuoteFormModal.tsx`**

1. Lägg till state: `const [locale, setLocale] = useState<'sv' | 'en'>('sv');`
2. Ladda befintligt locale vid redigering: i `useEffect` som läser `quote`, sätt `setLocale(quote.locale || 'sv')`
3. Ladda locale från booking vid ny offert: `setLocale(bookingData?.payload?.locale || 'sv')`
4. Lägg till en enkel Select-komponent i formuläret (t.ex. bredvid titelfältet eller i headern):
   - Svenska / Engelska toggle
   - Med en flaggikon eller Globe-ikon
5. Inkludera `locale` i `quoteData`-objektet som skickas till `createQuoteNew` / `updateQuoteNew`

**Fil: `src/lib/api/quotes-new.ts`**
- Lägg till `locale` i `createQuoteNew` input-typen så det skickas med vid skapande

### Resultat
Admin kan manuellt byta språk på vilken offert som helst, oavsett hur bokningen skapades. Ändringen propageras automatiskt till den publika offerten och offertmailet.

