-- Add deleted_at column to bookings table for soft delete functionality
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone DEFAULT NULL;

-- Create index for better performance when querying deleted bookings
CREATE INDEX IF NOT EXISTS idx_bookings_deleted_at 
ON public.bookings(deleted_at) 
WHERE deleted_at IS NOT NULL;