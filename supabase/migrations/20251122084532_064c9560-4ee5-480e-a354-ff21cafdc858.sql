-- Create feature flags for menu and hero testing
-- Flag 1: Control which menu is shown (TOP Navigation vs BOTTOM Navbar2)
INSERT INTO feature_flags (key, enabled, meta) VALUES (
  'use_top_menu',
  true,
  '{
    "description": "MENY-VAL: true = Navigation (TOP), false = Navbar2 (BOTTOM)",
    "affected_users": "all_visitors",
    "impact_level": "high",
    "test_variants": {
      "meny_1": "true (Navigation TOP)",
      "meny_2": "false (Navbar2 BOTTOM)",
      "meny_5": "false (Navbar2 BOTTOM)"
    }
  }'::jsonb
) ON CONFLICT (key) DO NOTHING;

-- Flag 2: Control which hero is shown (HeroUltra vs HeroV3)
INSERT INTO feature_flags (key, enabled, meta) VALUES (
  'use_new_hero',
  false,
  '{
    "description": "HERO-VAL: false = HeroUltra (gammal), true = HeroV3 (ny lila gradient)",
    "affected_users": "all_visitors",
    "impact_level": "high",
    "test_variants": {
      "meny_1": "false (HeroUltra)",
      "meny_2": "false (HeroUltra)",
      "meny_5": "true (HeroV3 NY)"
    }
  }'::jsonb
) ON CONFLICT (key) DO NOTHING;