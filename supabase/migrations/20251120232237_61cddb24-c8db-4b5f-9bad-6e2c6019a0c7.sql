-- Enable realtime for feature flags tables
ALTER TABLE feature_flags REPLICA IDENTITY FULL;
ALTER TABLE feature_flag_overrides REPLICA IDENTITY FULL;
ALTER TABLE scheduled_feature_flag_changes REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE feature_flags;
ALTER PUBLICATION supabase_realtime ADD TABLE feature_flag_overrides;
ALTER PUBLICATION supabase_realtime ADD TABLE scheduled_feature_flag_changes;