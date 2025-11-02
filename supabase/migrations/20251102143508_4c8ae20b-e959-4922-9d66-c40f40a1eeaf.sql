-- Refresh the materialized view to show all current workers
REFRESH MATERIALIZED VIEW CONCURRENTLY worker_detailed_statistics;

-- This ensures all workers (including newly added ones) are visible in analytics