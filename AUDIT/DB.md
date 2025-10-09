# DATABASE-AUDIT

## Executive Summary

Databasen är välstrukturerad med:
- ✅ RLS aktiverad på de flesta tabeller
- ✅ Bra användning av soft deletes (`deleted_at`)
- ✅ UUID som primary keys
- ✅ Triggers för auto-timestamps
- ✅ Helper functions för vanliga operationer

**Huvudsakliga problem:**
1. **Legacy quote_requests** - referenser finns kvar men tabellen existerar inte
2. **Dispatch queue** - endast admin-access, workers kan inte läsa
3. **Saknade indexes** - vissa foreign keys och filter-kolumner
4. **Soft delete cleanup** - ingen automatisk städning
5. **RLS policy gaps** - några tabeller saknar UPDATE/DELETE policies

---

## 1. Schema-konsistens

### KRITISKT: Legacy quote_requests Referenser

**Evidence:**
```sql
-- src/integrations/supabase/types.ts:2809
empty_quote_requests_trash: {
  Args: Record<PropertyKey, never>
  Returns: number
}
```

**Problem:**
RPC-funktionen finns i types men `quote_requests` tabellen finns INTE i nuvarande schema.

**Nuvarande tables:**
- ✅ `quotes` (gammal)
- ✅ `quotes_new` (ny, aktiv)
- ❌ `quote_requests` (refereras men finns ej)

**Check i prod:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE '%quote%';
```

**Expected result:**
```
table_name
-----------
quotes
quotes_new
quote_questions
quote_messages
quote_rejections
quote_reminders
```

Om `quote_requests` finns → OK att ha RPC
Om `quote_requests` saknas → Ta bort RPC-funktion

**Lösning:**
```sql
-- Drop RPC if table doesn't exist
DROP FUNCTION IF EXISTS public.empty_quote_requests_trash();
DROP FUNCTION IF EXISTS public.restore_quote_request(uuid);
DROP FUNCTION IF EXISTS public.permanently_delete_quote_request(uuid);
```

---

### HIGH: Quotes vs Quotes_new Dubblett

**Current state:**
Två quote-system existerar parallellt:

**OLD: `quotes` table**
```sql
CREATE TABLE quotes (
  id uuid PRIMARY KEY,
  customer_id uuid,
  quote_number text,
  line_items jsonb,
  total_amount numeric,
  ...
);
```

**NEW: `quotes_new` table**
```sql
CREATE TABLE quotes_new (
  id uuid PRIMARY KEY,
  number text,
  public_token text UNIQUE,
  customer_id uuid,
  request_id uuid,  -- References bookings
  items jsonb,      -- Different name from line_items!
  subtotal_work_sek numeric,
  subtotal_mat_sek numeric,
  ...
);
```

**Problem:**
1. Kod använder `quotes_new` men `quotes` finns fortfarande
2. RLS policies på båda
3. Förvirring om vilket som ska användas

**Verifiering:**
```sql
-- Check if old quotes table is still used
SELECT 
  schemaname, 
  tablename, 
  n_tup_ins AS inserts,
  n_tup_upd AS updates,
  n_tup_del AS deletes
FROM pg_stat_user_tables
WHERE tablename IN ('quotes', 'quotes_new')
ORDER BY n_tup_ins DESC;
```

Om `quotes` har 0 inserts/updates senaste månaden → safe att deprecate.

**Migration Plan:**
```sql
-- 1. Verify quotes is not used
-- 2. Migrate any existing data
INSERT INTO quotes_new (
  number, customer_id, title, items, 
  subtotal_work_sek, total_sek, status, created_at
)
SELECT 
  quote_number,
  customer_id,
  title,
  line_items,
  subtotal,
  total_amount,
  status::text,
  created_at
FROM quotes
WHERE id NOT IN (SELECT id FROM quotes_new)
  AND deleted_at IS NULL;

-- 3. Rename old table
ALTER TABLE quotes RENAME TO quotes_legacy;

-- 4. Document that quotes_new is the only system
COMMENT ON TABLE quotes_new IS 'Active quote system. quotes_legacy is deprecated.';
```

---

## 2. RLS Policy-analys

### CRITICAL: dispatch_queue Endast Admin-access

**Current policy:**
```sql
CREATE POLICY "Admin can manage dispatch queue" 
ON public.dispatch_queue 
FOR ALL 
USING (is_admin_or_owner());
```

**Problem:**
Workers/technicians behöver läsa från dispatch-kön men kan inte.

**Lösung:**
```sql
-- Add SELECT policy for workers
CREATE POLICY "Workers can view dispatch queue"
ON public.dispatch_queue
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('worker', 'technician')
  )
);

-- Keep admin policy for INSERT/UPDATE/DELETE
-- (existing policy covers this)
```

---

### HIGH: Bookings RLS - Potential Issue

**Current:**
```sql
-- ensure_booking_customer_id trigger
IF NEW.customer_id IS NULL AND auth.uid() IS NOT NULL THEN
  NEW.customer_id := auth.uid();
END IF;
```

**Men:**
Tabellen `bookings` har `customer_id` nullable, vilket betyder att gäst-bokningar (utan auth) kan ha NULL customer_id.

**RLS policies:**
Inga explicita RLS policies visade i context för `bookings` table.

**Verifiering:**
```sql
SELECT * FROM pg_policies 
WHERE tablename = 'bookings';
```

**Rekommendation:**
```sql
-- Add RLS for bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings"
ON bookings FOR SELECT
USING (customer_id = auth.uid() OR customer_id IS NULL);

-- Admins can view all
CREATE POLICY "Admins can view all bookings"
ON bookings FOR ALL
USING (is_admin_or_owner());

-- Public can create (for guest bookings)
CREATE POLICY "Anyone can create bookings"
ON bookings FOR INSERT
WITH CHECK (true);
```

---

### MEDIUM: services_select_public Broad Policy

**Current:**
```sql
CREATE POLICY "services_select_public" 
ON public.services 
FOR SELECT 
USING (is_active = true);
```

**Analysis:** ✅ OK om `services` table inte innehåller känslig data (som interna kostnader, marginaler).

**Verify:**
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'services';
```

Kolumner att dubbelkolla:
- `base_price` - OK att visa (public pricing)
- `internal_cost` - ❌ Finns inte (bra!)
- `profit_margin` - ❌ Finns inte (bra!)

**Status:** ✅ SAFE

---

## 3. Indexes & Prestanda

### KRITISKT: Saknade Indexes på Foreign Keys

**Check current indexes:**
```sql
SELECT
    t.tablename,
    i.indexname,
    a.attname AS column_name
FROM pg_indexes i
JOIN pg_class c ON c.relname = i.indexname
JOIN pg_attribute a ON a.attrelid = c.oid
JOIN pg_tables t ON t.tablename = i.tablename
WHERE t.schemaname = 'public'
ORDER BY t.tablename, i.indexname;
```

**Saknade indexes (probable):**

```sql
-- quotes_new
CREATE INDEX IF NOT EXISTS idx_quotes_new_customer_id 
  ON quotes_new(customer_id);
  
CREATE INDEX IF NOT EXISTS idx_quotes_new_request_id 
  ON quotes_new(request_id);
  
CREATE INDEX IF NOT EXISTS idx_quotes_new_public_token 
  ON quotes_new(public_token);  -- Already exists? Verify

CREATE INDEX IF NOT EXISTS idx_quotes_new_status 
  ON quotes_new(status) 
  WHERE deleted_at IS NULL;

-- bookings
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id 
  ON bookings(customer_id) 
  WHERE deleted_at IS NULL;
  
CREATE INDEX IF NOT EXISTS idx_bookings_service_slug 
  ON bookings(service_slug);
  
CREATE INDEX IF NOT EXISTS idx_bookings_status 
  ON bookings(status) 
  WHERE deleted_at IS NULL;

-- jobs
CREATE INDEX IF NOT EXISTS idx_jobs_customer_id 
  ON jobs(customer_id);
  
CREATE INDEX IF NOT EXISTS idx_jobs_assigned_worker_id 
  ON jobs(assigned_worker_id);
  
CREATE INDEX IF NOT EXISTS idx_jobs_status 
  ON jobs(status) 
  WHERE deleted_at IS NULL AND pool_enabled = true;

-- projects
CREATE INDEX IF NOT EXISTS idx_projects_customer_id 
  ON projects(customer_id);
  
CREATE INDEX IF NOT EXISTS idx_projects_quote_id 
  ON projects(quote_id);

-- quote_questions
CREATE INDEX IF NOT EXISTS idx_quote_questions_quote_id 
  ON quote_questions(quote_id);
  
CREATE INDEX IF NOT EXISTS idx_quote_questions_answered 
  ON quote_questions(answered) 
  WHERE answered = false;
```

**Impact:**
- Utan index på foreign keys: O(n) lookup vid joins
- Med index: O(log n) lookup
- För 10k records: 10000 vs 13 comparisons

**Priority:** HIGH

---

### HIGH: Composite Indexes för Vanliga Queries

```sql
-- Admin dashboard: quotes filtered by status and customer
CREATE INDEX IF NOT EXISTS idx_quotes_new_status_customer 
  ON quotes_new(status, customer_id) 
  WHERE deleted_at IS NULL;

-- Worker pool: available jobs
CREATE INDEX IF NOT EXISTS idx_jobs_pool_status 
  ON jobs(status, pool_enabled, assigned_worker_id) 
  WHERE deleted_at IS NULL;

-- Admin quotes: sort by created_at + filter by status
CREATE INDEX IF NOT EXISTS idx_quotes_new_created_status 
  ON quotes_new(created_at DESC, status) 
  WHERE deleted_at IS NULL;
```

---

## 4. Triggers & Defaults

### ✅ GOOD: Timestamp Triggers

```sql
-- Existing triggers found:
CREATE TRIGGER update_quotes_updated_at
BEFORE UPDATE ON quotes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles  
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- etc for other tables
```

**Status:** ✅ Good coverage

---

### MEDIUM: Soft Delete Trigger

**Current:** Manual soft delete via UPDATE `deleted_at = now()`

**Potential improvement:**
```sql
-- Trigger to prevent hard deletes
CREATE OR REPLACE FUNCTION prevent_hard_delete()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Hard deletes not allowed. Use soft delete (UPDATE deleted_at = now())';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_quotes_hard_delete
BEFORE DELETE ON quotes_new
FOR EACH ROW
EXECUTE FUNCTION prevent_hard_delete();

-- Apply to all soft-delete tables
```

**Priority:** LOW (nice-to-have)

---

## 5. Constraints & Validations

### HIGH: Saknade Foreign Key Constraints

**Check:**
```sql
SELECT
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;
```

**Probable missing:**
```sql
-- quotes_new
ALTER TABLE quotes_new
  ADD CONSTRAINT fk_quotes_new_customer
  FOREIGN KEY (customer_id) 
  REFERENCES customers(id)
  ON DELETE SET NULL;  -- Don't cascade delete quotes if customer deleted

ALTER TABLE quotes_new
  ADD CONSTRAINT fk_quotes_new_request
  FOREIGN KEY (request_id) 
  REFERENCES bookings(id)
  ON DELETE SET NULL;

-- jobs
ALTER TABLE jobs
  ADD CONSTRAINT fk_jobs_customer
  FOREIGN KEY (customer_id) 
  REFERENCES customers(id)
  ON DELETE SET NULL;

ALTER TABLE jobs
  ADD CONSTRAINT fk_jobs_worker
  FOREIGN KEY (assigned_worker_id) 
  REFERENCES profiles(id)
  ON DELETE SET NULL;

-- projects
ALTER TABLE projects
  ADD CONSTRAINT fk_projects_quote
  FOREIGN KEY (quote_id) 
  REFERENCES quotes_new(id)
  ON DELETE SET NULL;
```

**Note:** Använd `ON DELETE SET NULL` istället för `CASCADE` för att inte förlora historisk data.

---

### MEDIUM: Check Constraints

```sql
-- Ensure valid status values
ALTER TABLE quotes_new
  ADD CONSTRAINT chk_quotes_new_status
  CHECK (status IN ('draft', 'sent', 'viewed', 'change_requested', 'accepted', 'declined', 'expired'));

ALTER TABLE jobs
  ADD CONSTRAINT chk_jobs_status
  CHECK (status IN ('pool', 'assigned', 'in_progress', 'paused', 'completed', 'approved', 'cancelled'));

ALTER TABLE bookings
  ADD CONSTRAINT chk_bookings_mode
  CHECK (mode IN ('quote', 'book'));

-- Ensure positive prices
ALTER TABLE quotes_new
  ADD CONSTRAINT chk_quotes_new_total_positive
  CHECK (total_sek >= 0);

ALTER TABLE jobs
  ADD CONSTRAINT chk_jobs_price_positive
  CHECK (COALESCE(hourly_rate, 0) >= 0 AND COALESCE(fixed_price, 0) >= 0);
```

---

## 6. Data Integrity

### HIGH: Orphaned Records Check

```sql
-- Check for quotes without customers (after FK added)
SELECT COUNT(*) 
FROM quotes_new 
WHERE customer_id NOT IN (SELECT id FROM customers)
  AND customer_id IS NOT NULL;

-- Check for jobs without workers (invalid)
SELECT COUNT(*) 
FROM jobs 
WHERE assigned_worker_id NOT IN (SELECT id FROM profiles)
  AND assigned_worker_id IS NOT NULL;

-- Check for bookings without matching customers
SELECT COUNT(*) 
FROM bookings 
WHERE customer_id NOT IN (SELECT id FROM customers)
  AND customer_id IS NOT NULL;
```

**Cleanup:**
```sql
-- Fix orphaned customer_ids in quotes_new
UPDATE quotes_new 
SET customer_id = NULL 
WHERE customer_id NOT IN (SELECT id FROM customers);

-- Similar for other tables
```

---

### MEDIUM: Duplicate Prevention

```sql
-- Ensure unique quote numbers per year
CREATE UNIQUE INDEX IF NOT EXISTS idx_quotes_new_number_unique
  ON quotes_new(number);

-- Ensure unique public tokens
CREATE UNIQUE INDEX IF NOT EXISTS idx_quotes_new_token_unique
  ON quotes_new(public_token);

-- Prevent duplicate bookings within 1 hour
-- (same customer, service, timestamp)
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_dedup
  ON bookings(customer_id, service_slug, date_trunc('hour', created_at))
  WHERE customer_id IS NOT NULL AND deleted_at IS NULL;
```

---

## 7. Migrationsordning

### Current Migrations Structure

Migrationer ligger i `supabase/migrations/` och körs i alfabetisk ordning.

**Best practices:**
1. **Never modify existing migrations** - skapa alltid nya
2. **Test migrations in dev först**
3. **Backup before production migrations**

**Migration naming:**
```
YYYYMMDDHHMMSS_descriptive_name.sql
```

Example:
```
20250109120000_add_indexes_to_quotes_new.sql
20250109120100_fix_dispatch_queue_rls.sql
20250109120200_add_foreign_keys.sql
```

---

## 8. Soft Delete Cleanup

### MEDIUM: Automatisk Cleanup Saknas

**Current:**
```sql
-- RPC functions exist:
empty_quotes_new_trash()
empty_bookings_trash()
empty_jobs_trash()
empty_projects_trash()
```

Men ingen automatisk körning.

**Lösning - Scheduled Job:**

**Option 1: Supabase pg_cron Extension**
```sql
-- Enable pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule monthly cleanup
SELECT cron.schedule(
  'cleanup-deleted-quotes',
  '0 2 1 * *',  -- 02:00 första dagen varje månad
  $$
  SELECT cleanup_old_deleted_records();
  $$
);
```

**Option 2: Edge Function + GitHub Actions**
```yaml
# .github/workflows/cleanup.yml
name: Monthly Cleanup
on:
  schedule:
    - cron: '0 2 1 * *'  # Monthly

jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
      - name: Call cleanup function
        run: |
          curl -X POST \
            https://fnzjgohubvaxwpmnvwdq.supabase.co/functions/v1/cleanup-deleted-quotes \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}"
```

---

## 9. Rekommenderade DB-förändringar

### Priority 1 (OMEDELBART):
```sql
-- 1. Add indexes on foreign keys
CREATE INDEX idx_quotes_new_customer_id ON quotes_new(customer_id);
CREATE INDEX idx_quotes_new_request_id ON quotes_new(request_id);
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_jobs_assigned_worker_id ON jobs(assigned_worker_id);

-- 2. Fix dispatch_queue RLS
CREATE POLICY "Workers can view dispatch queue"
ON dispatch_queue FOR SELECT
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE id = auth.uid() AND role IN ('worker', 'technician')
));

-- 3. Add status filter indexes
CREATE INDEX idx_quotes_new_status 
  ON quotes_new(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_status 
  ON jobs(status) WHERE deleted_at IS NULL AND pool_enabled = true;
```

### Priority 2 (INOM 1 VECKA):
```sql
-- Add foreign key constraints
ALTER TABLE quotes_new
  ADD CONSTRAINT fk_quotes_new_customer
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;

-- Add check constraints
ALTER TABLE quotes_new
  ADD CONSTRAINT chk_quotes_new_status
  CHECK (status IN ('draft', 'sent', 'viewed', 'change_requested', 'accepted', 'declined', 'expired'));

-- Add RLS to bookings if missing
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (customer_id = auth.uid() OR is_admin_or_owner());
```

### Priority 3 (INOM 1 MÅNAD):
```sql
-- Clean up legacy quote_requests references
DROP FUNCTION IF EXISTS empty_quote_requests_trash();

-- Add composite indexes
CREATE INDEX idx_quotes_new_status_customer 
  ON quotes_new(status, customer_id) WHERE deleted_at IS NULL;

-- Setup automatic cleanup
-- (via pg_cron or GitHub Actions)

-- Migrate from quotes to quotes_new (if applicable)
-- Deprecate quotes table
ALTER TABLE quotes RENAME TO quotes_legacy;
```

---

## 10. Monitoring & Alerts

### Database Health Metrics

```sql
-- Table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan AS index_scans,
  idx_tup_read AS tuples_read
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan ASC;  -- Unused indexes have low scans

-- Slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
WHERE mean_time > 100  -- queries slower than 100ms
ORDER BY mean_time DESC;
```

---

## Sammanfattning

**Database-hälsa:** ✅ God grund, men behöver förbättringar

**Kritiska åtgärder:**
1. Lägg till indexes på foreign keys (perf boost)
2. Fixa dispatch_queue RLS för workers
3. Ta bort legacy quote_requests referenser
4. Add RLS till bookings om saknas

**Estimerad tid:**
- Priority 1: 2-3 timmar
- Priority 2: 1 dag
- Priority 3: 2-3 dagar

**Expected improvement:**
- Query performance: 50-90% snabbare med indexes
- Security: Tätare RLS coverage
- Maintainability: Renare schema utan legacy code
