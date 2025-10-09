-- Add admin-settable price and bonus to jobs table
ALTER TABLE public.jobs
ADD COLUMN IF NOT EXISTS admin_set_price numeric,
ADD COLUMN IF NOT EXISTS bonus_amount numeric DEFAULT 0;

COMMENT ON COLUMN public.jobs.admin_set_price IS 'Fast ersättning som admin har satt för detta jobb';
COMMENT ON COLUMN public.jobs.bonus_amount IS 'Bonusbelopp för att locka workers till jobbet';