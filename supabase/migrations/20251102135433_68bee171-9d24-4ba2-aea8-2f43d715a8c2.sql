-- Droppa constraint om den finns (hanterar inkonsistent state)
ALTER TABLE audit_log DROP CONSTRAINT IF EXISTS audit_log_actor_fkey;

-- Lägg till foreign key constraint från audit_log.actor till profiles.id
-- Detta gör att Supabase PostgREST kan förstå relationen för embedded selects
ALTER TABLE audit_log
ADD CONSTRAINT audit_log_actor_fkey 
FOREIGN KEY (actor) 
REFERENCES profiles(id) 
ON DELETE SET NULL;