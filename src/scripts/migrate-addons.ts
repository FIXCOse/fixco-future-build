import { supabase } from "@/integrations/supabase/client";

/**
 * Migration script to:
 * 1. Move addons from 'info-badrum' to 'vvs-13'
 * 2. Deactivate 'info-badrum' service
 */
async function migrateAddons() {
  console.log("Starting addon migration...");
  
  // 1. Update service_addons to point to vvs-13 instead of info-badrum
  const { data: updateData, error: updateError } = await supabase
    .from('service_addons')
    .update({ service_id: 'vvs-13' })
    .eq('service_id', 'info-badrum')
    .select();
  
  if (updateError) {
    console.error("Error updating addons:", updateError);
    return;
  }
  
  console.log("Updated addons:", updateData);
  
  // 2. Deactivate info-badrum service
  const { data: deactivateData, error: deactivateError } = await supabase
    .from('services')
    .update({ is_active: false })
    .eq('id', 'info-badrum')
    .select();
  
  if (deactivateError) {
    console.error("Error deactivating service:", deactivateError);
    return;
  }
  
  console.log("Deactivated service:", deactivateData);
  console.log("Migration complete!");
}

// Run the migration
migrateAddons();
