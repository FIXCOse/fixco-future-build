-- Add seen_at column to track when admin first viewed a question
ALTER TABLE quote_questions ADD COLUMN seen_at timestamptz DEFAULT NULL;