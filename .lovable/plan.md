

## Plan: Fix broken edge function + email issues

### Root Cause
In `supabase/functions/accept-quote-public/index.ts`, the `sendCustomerConfirmation` function is missing its declaration. Lines 72-147 are a bare `try/catch` block floating at module scope without `async function sendCustomerConfirmation(customerEmail, customerName, quoteNumber, quoteTitle, signatureName)` wrapping them. This is a syntax error that breaks the entire edge function.

### Fixes

**`supabase/functions/accept-quote-public/index.ts`** — Single file, three issues:

1. **Add missing function declaration** — Wrap lines 72-147 in:
   ```typescript
   async function sendCustomerConfirmation(
     customerEmail: string | undefined, 
     customerName: string, 
     quoteNumber: string, 
     quoteTitle: string | null, 
     signatureName: string | undefined
   ) {
     // existing try/catch body
   }
   ```

2. **Compact the customer email HTML** — Gmail clips emails over ~102KB. The current template has excessive whitespace. Consolidate the entire email into one clean, unbroken HTML block so Gmail doesn't split it with "...". Remove unnecessary blank lines and reduce inline style verbosity slightly.

3. **Verify admin email** — `buildAdminHtml` and `notifyAdmin` are already correct. Once the syntax error is fixed, the styled admin email will work automatically since the edge function will deploy properly.

### No other files change. Just fix the broken function declaration in this one edge function.

