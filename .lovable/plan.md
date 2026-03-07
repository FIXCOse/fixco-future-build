

## Plan: Fix konfetti + email-splitting (behåll design)

### 1. Konfetti syns inte — canvas under Radix portal

**Orsak**: `canvas-confetti` skapar automatiskt en `<canvas>` i `document.body`, men Radix Dialog renderar i en portal med egen stacking context. Canvasen hamnar under dialog-overlayen oavsett `zIndex`.

**Fix i `src/pages/QuotePublic.tsx`**:
- Skapa ett manuellt `<canvas>` element med `useRef` och `useEffect`
- Styla det med `position: fixed; inset: 0; z-index: 99999; pointer-events: none`
- Rendera canvasen EFTER `<Dialog>` i JSX (sist i komponentträdet)
- Använd `confetti.create(canvasRef.current, { resize: true })` istället för globala `confetti()` — detta binder alla partiklar till det manuella canvaset som garanterat ligger ovanpå portalen

### 2. Kundmail bryts i två delar — iOS Mail tolkar `border-left` som citat

**Orsak**: iOS Mail och vissa versioner av Gmail tolkar `<div>` med `border-left` som ett blockquote/citat och visar det som en separat, ihopfälld del. Designen behålls, men implementationen ändras.

**Fix i `supabase/functions/accept-quote-public/index.ts`**:
- Behåll exakt samma visuella design (grön bakgrund, text, lista)
- Byt ut `<div style="border-left:4px solid #16a34a">` mot en `<table>` med en smal `<td>` (4px bred, grön bakgrund) bredvid innehålls-`<td>`. Detta ger identiskt utseende men tolkas inte som citat av mailklienter
- Samma teknik för admin-mailet i `buildAdminHtml`

```text
Före (tolkas som citat):
<div style="border-left:4px solid green; background:#f0fdf4; padding:16px">
  innehåll
</div>

Efter (identiskt utseende, ingen citat-tolkning):
<table><tr>
  <td style="width:4px;background:#16a34a"></td>
  <td style="background:#f0fdf4;padding:16px">innehåll</td>
</tr></table>
```

### 3. FK-constraint (projects.customer_id → profiles)

**SQL-migration** att köra:
```sql
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_customer_id_fkey;
ALTER TABLE public.projects ADD CONSTRAINT projects_customer_id_fkey 
  FOREIGN KEY (customer_id) REFERENCES public.customers(id);
```

Plus uppdatera admin-sidor (`AdminOngoingProjects.tsx`, `AdminProjectsTrash.tsx`) som joinat mot `profiles` — ändra till `customers`.

### Filer som ändras

| Fil | Ändring |
|-----|---------|
| `src/pages/QuotePublic.tsx` | Manuellt canvas + `confetti.create()` |
| `supabase/functions/accept-quote-public/index.ts` | `border-left` → table-teknik i båda mailtemplatesen |
| SQL | FK-constraint fix |
| `src/pages/admin/AdminOngoingProjects.tsx` | Customer-query → customers |
| `src/pages/admin/AdminProjectsTrash.tsx` | Customer-query → customers |

