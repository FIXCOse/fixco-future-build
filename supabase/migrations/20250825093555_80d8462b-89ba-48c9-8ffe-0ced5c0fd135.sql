-- Enable realtime for job-related tables
ALTER TABLE public.jobs REPLICA IDENTITY FULL;
ALTER TABLE public.job_events REPLICA IDENTITY FULL;
ALTER TABLE public.job_photos REPLICA IDENTITY FULL;
ALTER TABLE public.job_signatures REPLICA IDENTITY FULL;
ALTER TABLE public.time_logs REPLICA IDENTITY FULL;
ALTER TABLE public.material_logs REPLICA IDENTITY FULL;
ALTER TABLE public.expense_logs REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER publication supabase_realtime ADD TABLE public.jobs;
ALTER publication supabase_realtime ADD TABLE public.job_events;
ALTER publication supabase_realtime ADD TABLE public.job_photos;
ALTER publication supabase_realtime ADD TABLE public.job_signatures;
ALTER publication supabase_realtime ADD TABLE public.time_logs;
ALTER publication supabase_realtime ADD TABLE public.material_logs;
ALTER publication supabase_realtime ADD TABLE public.expense_logs;