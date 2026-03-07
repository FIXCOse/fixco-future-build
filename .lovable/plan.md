

## Problem

The RLS policy on `quote_views` calls `is_admin_or_owner()` without passing `auth.uid()`. The function requires a UUID argument. This causes the SELECT to silently return no rows, so the timeline never shows view data.

## Fix

**SQL migration** — Drop and recreate the SELECT policy on `quote_views` with the correct function call:

```sql
DROP POLICY "Admins can read quote_views" ON public.quote_views;
CREATE POLICY "Admins can read quote_views"
  ON public.quote_views FOR SELECT TO authenticated
  USING (public.is_admin_or_owner(auth.uid()));
```

| File | Change |
|------|--------|
| New SQL migration | Fix RLS policy to pass `auth.uid()` to `is_admin_or_owner` |

No frontend changes needed — the timeline component already fetches and displays the data correctly. It just gets empty results due to the broken RLS policy.

