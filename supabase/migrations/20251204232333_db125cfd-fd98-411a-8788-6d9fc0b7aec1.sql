-- Activate services that should be visible
UPDATE services SET is_active = true WHERE id IN (
  'montering-4',  -- Vitvaror (kyl, frys, ugn, spis)
  'el-4',         -- Installera spotlights
  'el-9',         -- Montera TV-väggfäste & kabelkanal
  'vvs-10'        -- Tätta rörkopplingar
);