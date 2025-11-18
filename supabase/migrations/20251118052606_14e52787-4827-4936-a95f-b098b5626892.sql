-- Feature Flag History and Overrides System

-- Table for feature flag change history
CREATE TABLE IF NOT EXISTS public.feature_flag_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_key TEXT NOT NULL,
  old_enabled BOOLEAN,
  new_enabled BOOLEAN NOT NULL,
  old_meta JSONB,
  new_meta JSONB,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reason TEXT
);

-- Table for per-user feature flag overrides
CREATE TABLE IF NOT EXISTS public.feature_flag_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_key TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  enabled BOOLEAN NOT NULL,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reason TEXT,
  UNIQUE(flag_key, user_id)
);

-- Index for faster lookups
CREATE INDEX idx_feature_flag_history_flag_key ON public.feature_flag_history(flag_key);
CREATE INDEX idx_feature_flag_history_changed_at ON public.feature_flag_history(changed_at DESC);
CREATE INDEX idx_feature_flag_overrides_flag_key ON public.feature_flag_overrides(flag_key);
CREATE INDEX idx_feature_flag_overrides_user_id ON public.feature_flag_overrides(user_id);
CREATE INDEX idx_feature_flag_overrides_expires_at ON public.feature_flag_overrides(expires_at) WHERE expires_at IS NOT NULL;

-- RLS Policies
ALTER TABLE public.feature_flag_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flag_overrides ENABLE ROW LEVEL SECURITY;

-- Admin can view all history
CREATE POLICY "Admins can view feature flag history"
  ON public.feature_flag_history
  FOR SELECT
  USING (is_admin_or_owner());

-- Admin can view all overrides
CREATE POLICY "Admins can view feature flag overrides"
  ON public.feature_flag_overrides
  FOR SELECT
  USING (is_admin_or_owner());

-- Admin can create overrides
CREATE POLICY "Admins can create feature flag overrides"
  ON public.feature_flag_overrides
  FOR INSERT
  WITH CHECK (is_admin_or_owner());

-- Admin can delete overrides
CREATE POLICY "Admins can delete feature flag overrides"
  ON public.feature_flag_overrides
  FOR DELETE
  USING (is_admin_or_owner());

-- Users can view their own overrides
CREATE POLICY "Users can view their own feature flag overrides"
  ON public.feature_flag_overrides
  FOR SELECT
  USING (user_id = auth.uid());

-- Function to log feature flag changes
CREATE OR REPLACE FUNCTION log_feature_flag_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.feature_flag_history (
    flag_key,
    old_enabled,
    new_enabled,
    old_meta,
    new_meta,
    changed_by,
    reason
  ) VALUES (
    NEW.key,
    OLD.enabled,
    NEW.enabled,
    OLD.meta,
    NEW.meta,
    auth.uid(),
    COALESCE(NEW.meta->>'change_reason', 'Manual update')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically log changes
DROP TRIGGER IF EXISTS feature_flag_change_logger ON public.feature_flags;
CREATE TRIGGER feature_flag_change_logger
  AFTER UPDATE ON public.feature_flags
  FOR EACH ROW
  WHEN (OLD.enabled IS DISTINCT FROM NEW.enabled OR OLD.meta IS DISTINCT FROM NEW.meta)
  EXECUTE FUNCTION log_feature_flag_change();

-- Function to check if a feature flag is enabled for a user (with override support)
CREATE OR REPLACE FUNCTION is_feature_enabled(flag_key TEXT, user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
DECLARE
  override_enabled BOOLEAN;
  global_enabled BOOLEAN;
BEGIN
  -- First check for user-specific override
  IF user_uuid IS NOT NULL THEN
    SELECT enabled INTO override_enabled
    FROM public.feature_flag_overrides
    WHERE flag_key = is_feature_enabled.flag_key
      AND user_id = user_uuid
      AND (expires_at IS NULL OR expires_at > NOW());
    
    IF override_enabled IS NOT NULL THEN
      RETURN override_enabled;
    END IF;
  END IF;
  
  -- Fall back to global flag
  SELECT enabled INTO global_enabled
  FROM public.feature_flags
  WHERE key = flag_key;
  
  RETURN COALESCE(global_enabled, FALSE);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to toggle feature flag (for admin use)
CREATE OR REPLACE FUNCTION toggle_feature_flag(
  flag_key TEXT,
  new_enabled BOOLEAN,
  change_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user is admin
  IF NOT is_admin_or_owner() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  -- Update the flag
  UPDATE public.feature_flags
  SET 
    enabled = new_enabled,
    meta = COALESCE(meta, '{}'::jsonb) || jsonb_build_object('change_reason', change_reason),
    updated_at = NOW()
  WHERE key = flag_key;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired overrides
CREATE OR REPLACE FUNCTION cleanup_expired_feature_flag_overrides()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.feature_flag_overrides
  WHERE expires_at IS NOT NULL AND expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add RLS policy for feature_flags table (if not already exists)
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view feature flags" ON public.feature_flags
  FOR SELECT USING (true);

CREATE POLICY "Admins can update feature flags" ON public.feature_flags
  FOR UPDATE USING (is_admin_or_owner());

CREATE POLICY "Admins can insert feature flags" ON public.feature_flags
  FOR INSERT WITH CHECK (is_admin_or_owner());

COMMENT ON TABLE public.feature_flag_history IS 'Stores the complete history of feature flag changes';
COMMENT ON TABLE public.feature_flag_overrides IS 'Allows per-user overrides of global feature flags';
COMMENT ON FUNCTION is_feature_enabled IS 'Checks if a feature flag is enabled for a specific user, considering overrides';
COMMENT ON FUNCTION toggle_feature_flag IS 'Admin function to toggle feature flags with reason logging';
COMMENT ON FUNCTION cleanup_expired_feature_flag_overrides IS 'Removes expired feature flag overrides';