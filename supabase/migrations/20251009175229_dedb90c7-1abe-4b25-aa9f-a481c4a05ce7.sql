-- Ta bort triggern som automatiskt skapar draft quotes
DROP TRIGGER IF EXISTS on_booking_create_draft_quote ON public.bookings;

-- Kommentera bort funktionen trigger_create_draft_quote (behåller create_draft_quote_for_booking för manuell användning)
DROP FUNCTION IF EXISTS public.trigger_create_draft_quote();