-- Tabell för scheduled feature flag changes
CREATE TABLE scheduled_feature_flag_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_key TEXT NOT NULL REFERENCES feature_flags(key) ON DELETE CASCADE,
  target_enabled BOOLEAN NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  reason TEXT,
  scheduled_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  executed BOOLEAN DEFAULT FALSE,
  executed_at TIMESTAMPTZ,
  cancelled BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES auth.users(id)
);

-- Index för snabba queries
CREATE INDEX idx_scheduled_changes_pending 
  ON scheduled_feature_flag_changes(scheduled_for) 
  WHERE executed = FALSE AND cancelled = FALSE;

CREATE INDEX idx_scheduled_changes_flag_key 
  ON scheduled_feature_flag_changes(flag_key);

-- RLS Policies
ALTER TABLE scheduled_feature_flag_changes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view scheduled changes"
  ON scheduled_feature_flag_changes FOR SELECT
  USING (is_admin_or_owner());

CREATE POLICY "Admins can create scheduled changes"
  ON scheduled_feature_flag_changes FOR INSERT
  WITH CHECK (is_admin_or_owner());

CREATE POLICY "Admins can cancel scheduled changes"
  ON scheduled_feature_flag_changes FOR UPDATE
  USING (is_admin_or_owner())
  WITH CHECK (is_admin_or_owner());

CREATE POLICY "Admins can delete scheduled changes"
  ON scheduled_feature_flag_changes FOR DELETE
  USING (is_admin_or_owner());

-- Lägg till beskrivningar för alla befintliga feature flags
UPDATE feature_flags SET meta = jsonb_build_object(
  'description', 'Tvinga alla användare att aktivera tvåfaktorsautentisering',
  'impact_level', 'high',
  'affected_users', 'all'
) WHERE key = 'force_2fa';

UPDATE feature_flags SET meta = jsonb_build_object(
  'description', 'Sätt webbplatsen i underhållsläge - endast admins kan komma åt',
  'impact_level', 'critical',
  'affected_users', 'all_non_admin'
) WHERE key = 'maintenance_mode';

UPDATE feature_flags SET meta = jsonb_build_object(
  'description', 'Aktivera AI-chatbot för kundsupport',
  'impact_level', 'medium',
  'affected_users', 'all_visitors'
) WHERE key = 'chat_ai_enabled';

UPDATE feature_flags SET meta = jsonb_build_object(
  'description', 'Aktivera lojalitetsprogram med poäng och belöningar',
  'impact_level', 'medium',
  'affected_users', 'authenticated_customers'
) WHERE key = 'enable_loyalty_program';

UPDATE feature_flags SET meta = jsonb_build_object(
  'description', 'Aktivera avancerad rapportportal för admins',
  'impact_level', 'low',
  'affected_users', 'admins_only'
) WHERE key = 'advanced_reporting';

UPDATE feature_flags SET meta = jsonb_build_object(
  'description', 'Visa smarta hem-produkter i produktkatalogen',
  'impact_level', 'low',
  'affected_users', 'all_visitors'
) WHERE key = 'show_smart_products';

UPDATE feature_flags SET meta = jsonb_build_object(
  'description', 'Aktivera ny version av offert-wizard med förbättrad UX',
  'impact_level', 'medium',
  'affected_users', 'all_visitors'
) WHERE key = 'offer_wizard_v2';

UPDATE feature_flags SET meta = jsonb_build_object(
  'description', 'Aktivera experimentella funktioner (endast för testning)',
  'impact_level', 'low',
  'affected_users', 'beta_testers'
) WHERE key = 'experimental_features';