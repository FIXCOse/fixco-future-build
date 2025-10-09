-- Lägg till kolumner för att spara ROT/RUT-procent och rabatt i quotes_new
ALTER TABLE public.quotes_new
ADD COLUMN IF NOT EXISTS rot_percentage integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS rut_percentage integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_type text DEFAULT 'none',
ADD COLUMN IF NOT EXISTS discount_value numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_amount_sek integer DEFAULT 0;

COMMENT ON COLUMN public.quotes_new.rot_percentage IS 'ROT avdragsprocent (t.ex. 30 eller 50)';
COMMENT ON COLUMN public.quotes_new.rut_percentage IS 'RUT avdragsprocent (t.ex. 50)';
COMMENT ON COLUMN public.quotes_new.discount_type IS 'Typ av rabatt: none, percent eller amount';
COMMENT ON COLUMN public.quotes_new.discount_value IS 'Rabattvärde (procent eller belopp)';
COMMENT ON COLUMN public.quotes_new.discount_amount_sek IS 'Faktiskt rabattbelopp i SEK';