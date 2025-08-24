-- Make property_id nullable for direct bookings without properties
ALTER TABLE public.bookings ALTER COLUMN property_id DROP NOT NULL;