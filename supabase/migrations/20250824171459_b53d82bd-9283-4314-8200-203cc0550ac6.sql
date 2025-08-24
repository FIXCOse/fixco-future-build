-- Enable realtime for bookings and quote_requests tables
ALTER TABLE public.bookings REPLICA IDENTITY FULL;
ALTER TABLE public.quote_requests REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quote_requests;