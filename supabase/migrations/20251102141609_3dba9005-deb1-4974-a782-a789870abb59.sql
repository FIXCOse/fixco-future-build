-- Create worker_detailed_statistics materialized view
CREATE MATERIALIZED VIEW worker_detailed_statistics AS
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  p.email,
  p.avatar_url,
  
  -- Job Counts
  COUNT(DISTINCT je_claimed.job_id) as total_jobs,
  COUNT(DISTINCT CASE WHEN je_completed.created_at IS NOT NULL THEN je_completed.job_id END) as completed_jobs,
  COUNT(DISTINCT CASE WHEN je_claimed.created_at >= NOW() - INTERVAL '30 days' THEN je_claimed.job_id END) as jobs_last_30_days,
  COUNT(DISTINCT CASE WHEN je_claimed.created_at >= NOW() - INTERVAL '7 days' THEN je_claimed.job_id END) as jobs_last_7_days,
  
  -- Performance Metrics
  ROUND(
    CASE WHEN COUNT(DISTINCT je_claimed.job_id) > 0 
    THEN (COUNT(DISTINCT je_completed.job_id)::numeric / COUNT(DISTINCT je_claimed.job_id) * 100)
    ELSE 0 END, 1
  ) as completion_rate_percent,
  
  -- Time Analytics
  AVG(tl.hours) FILTER (WHERE tl.hours IS NOT NULL) as avg_job_hours,
  MIN(tl.hours) FILTER (WHERE tl.hours IS NOT NULL) as fastest_job_hours,
  MAX(tl.hours) FILTER (WHERE tl.hours IS NOT NULL) as longest_job_hours,
  
  -- Work Pattern Analysis (jobs by weekday)
  COUNT(DISTINCT tl.job_id) FILTER (WHERE EXTRACT(DOW FROM tl.started_at) = 1) as jobs_monday,
  COUNT(DISTINCT tl.job_id) FILTER (WHERE EXTRACT(DOW FROM tl.started_at) = 2) as jobs_tuesday,
  COUNT(DISTINCT tl.job_id) FILTER (WHERE EXTRACT(DOW FROM tl.started_at) = 3) as jobs_wednesday,
  COUNT(DISTINCT tl.job_id) FILTER (WHERE EXTRACT(DOW FROM tl.started_at) = 4) as jobs_thursday,
  COUNT(DISTINCT tl.job_id) FILTER (WHERE EXTRACT(DOW FROM tl.started_at) = 5) as jobs_friday,
  COUNT(DISTINCT tl.job_id) FILTER (WHERE EXTRACT(DOW FROM tl.started_at) = 6) as jobs_saturday,
  COUNT(DISTINCT tl.job_id) FILTER (WHERE EXTRACT(DOW FROM tl.started_at) = 0) as jobs_sunday,
  
  -- Streak tracking (simplified - days worked in last 30 days)
  COUNT(DISTINCT DATE(tl.started_at)) FILTER (
    WHERE tl.started_at >= NOW() - INTERVAL '30 days'
  ) as current_streak_days,
  
  MAX(tl.ended_at) as last_job_at,
  
  -- Service Specialization (top 3 services as JSON)
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'service_id', service_counts.service_id,
        'service_name', COALESCE(s.title_sv, 'Okänd'),
        'count', service_counts.cnt,
        'success_rate', service_counts.success_rate
      )
    )
    FROM (
      SELECT 
        j.service_id,
        COUNT(*) as cnt,
        ROUND(
          COUNT(*) FILTER (WHERE j.status = 'completed')::numeric / 
          NULLIF(COUNT(*), 0) * 100, 
          1
        ) as success_rate
      FROM jobs j
      WHERE j.assigned_worker_id = p.id AND j.service_id IS NOT NULL
      GROUP BY j.service_id
      ORDER BY cnt DESC
      LIMIT 3
    ) as service_counts
    LEFT JOIN services s ON s.id = service_counts.service_id
  ) as top_services,
  
  -- Financial Metrics
  SUM(
    COALESCE(j.admin_set_price, j.hourly_rate * tl.hours, j.fixed_price, 0)
  ) FILTER (WHERE tl.started_at >= NOW() - INTERVAL '30 days') as earnings_last_30_days,
  
  -- Quality Indicators
  COUNT(DISTINCT tl.job_id) FILTER (WHERE tl.hours > 8) as overtime_jobs
  
FROM profiles p
LEFT JOIN job_events je_claimed ON je_claimed.actor = p.id AND je_claimed.event = 'job.claimed'
LEFT JOIN job_events je_completed ON je_completed.job_id = je_claimed.job_id AND je_completed.event = 'job.completed'
LEFT JOIN time_logs tl ON tl.worker_id = p.id
LEFT JOIN jobs j ON j.id = tl.job_id
WHERE EXISTS (SELECT 1 FROM user_roles WHERE user_id = p.id AND role = 'worker')
GROUP BY p.id, p.first_name, p.last_name, p.email, p.avatar_url;

-- Create index on materialized view
CREATE UNIQUE INDEX idx_worker_detailed_stats_id ON worker_detailed_statistics(id);

-- Create worker_daily_stats table for trend analysis
CREATE TABLE worker_daily_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid REFERENCES profiles(id) NOT NULL,
  date date NOT NULL,
  jobs_completed integer DEFAULT 0,
  total_hours numeric DEFAULT 0,
  total_earnings numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(worker_id, date)
);

-- Create index for faster queries
CREATE INDEX idx_worker_daily_stats_worker_date ON worker_daily_stats(worker_id, date DESC);
CREATE INDEX idx_worker_daily_stats_date ON worker_daily_stats(date DESC);

-- Function to update daily stats
CREATE OR REPLACE FUNCTION update_worker_daily_stats()
RETURNS void AS $$
BEGIN
  INSERT INTO worker_daily_stats (worker_id, date, jobs_completed, total_hours, total_earnings)
  SELECT 
    tl.worker_id,
    DATE(tl.started_at) as date,
    COUNT(DISTINCT tl.job_id) as jobs_completed,
    SUM(tl.hours) as total_hours,
    SUM(COALESCE(j.admin_set_price, j.hourly_rate * tl.hours, j.fixed_price, 0)) as total_earnings
  FROM time_logs tl
  JOIN jobs j ON j.id = tl.job_id
  WHERE DATE(tl.started_at) = CURRENT_DATE - INTERVAL '1 day'
  GROUP BY tl.worker_id, DATE(tl.started_at)
  ON CONFLICT (worker_id, date) 
  DO UPDATE SET
    jobs_completed = EXCLUDED.jobs_completed,
    total_hours = EXCLUDED.total_hours,
    total_earnings = EXCLUDED.total_earnings;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to refresh worker stats (can be called manually or via cron)
CREATE OR REPLACE FUNCTION refresh_worker_detailed_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY worker_detailed_statistics;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT ON worker_detailed_statistics TO authenticated;
GRANT SELECT, INSERT, UPDATE ON worker_daily_stats TO authenticated;