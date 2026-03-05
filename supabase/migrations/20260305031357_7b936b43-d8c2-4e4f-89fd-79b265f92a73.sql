SELECT cron.schedule(
  'execute-scheduled-quote-sends',
  '* * * * *',
  $$
  SELECT net.http_post(
    url := 'https://fnzjgohubvaxwpmnvwdq.supabase.co/functions/v1/execute-scheduled-quote-sends',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZuempnb2h1YnZheHdwbW52d2RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMjQ0OTIsImV4cCI6MjA3MTYwMDQ5Mn0.VaTl8-LZEV7WXBpLnARKAWtVnZ3pUPAtXEbj-dB6dvQ"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);