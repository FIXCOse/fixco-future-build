import { supabase } from "@/integrations/supabase/client";

export async function getOrCreateProfile() {
  const { data: s } = await supabase.auth.getSession();
  const user = s?.session?.user;
  if (!user) throw new Error("Ingen session");

  // 1) Försök läsa profil
  let { data: p, error } = await supabase
    .from("profiles")
    .select("id, email, first_name, last_name, role, owner_welcome_at, user_type, loyalty_tier, loyalty_points, total_spent, company_name, brf_name, phone, address_line, postal_code, city, org_number")
    .eq("id", user.id)
    .maybeSingle();

  // 2) Self-heal om saknas
  if (!p || error) {
    console.log("Creating/updating profile for user:", user.id);
    const profileData = {
      id: user.id,
      email: user.email || '',
      first_name: user.user_metadata?.first_name || user.email?.split("@")[0] || '',
      last_name: user.user_metadata?.last_name || '',
      role: (user.email?.toLowerCase() === "omar@fixco.se" || user.email?.toLowerCase() === "omar@dinadress.se") ? "owner" : "customer",
      user_type: 'private' as const,
      loyalty_tier: 'bronze' as const,
      loyalty_points: 0,
      total_spent: 0
    };

    const { data: upserted, error: upsertError } = await supabase
      .from("profiles")
      .upsert(profileData, { onConflict: "id" })
      .select("id, email, first_name, last_name, role, owner_welcome_at, user_type, loyalty_tier, loyalty_points, total_spent, company_name, brf_name, phone, address_line, postal_code, city, org_number")
      .single();
    
    if (upsertError) {
      console.error("Failed to upsert profile:", upsertError);
      throw upsertError;
    }
    
    p = upserted;
  }

  return p;
}