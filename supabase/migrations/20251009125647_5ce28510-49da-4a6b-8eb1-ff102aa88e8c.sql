-- Clean up all test jobs and related data
DELETE FROM job_events;
DELETE FROM time_logs;
DELETE FROM material_logs;
DELETE FROM expense_logs;
DELETE FROM job_photos;
DELETE FROM job_signatures;
DELETE FROM worker_assignments;
DELETE FROM jobs;