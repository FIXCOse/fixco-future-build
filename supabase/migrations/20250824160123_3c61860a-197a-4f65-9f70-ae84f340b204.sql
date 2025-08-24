-- Align bookings table with client payload
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS postal_code text;