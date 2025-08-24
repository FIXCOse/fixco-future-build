import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getOrCreateProfile } from "@/lib/getOrCreateProfile";

type OwnerProfile = {
  id: string;
  role?: string;
  owner_welcome_at: string | null;
};

export function useOwnerCongrats() {
  const [show, setShow] = useState(false);
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => mounted && console.log("Owner congrats timeout"), 5000);

    (async () => {
      try {
        const profileData = await getOrCreateProfile();
        if (!mounted) return;

        setProfile(profileData);

        // Visa ENDAST för OWNER + aldrig tidigare visat
        if (profileData.role === 'owner' && !profileData.owner_welcome_at) {
          // Extra failsafe mot dubbelvisning i samma session
          const onceKey = `owner_welcome_once_${profileData.id}`;
          if (!sessionStorage.getItem(onceKey)) {
            setShow(true);
            sessionStorage.setItem(onceKey, "1");
          }
        }
      } catch (error) {
        console.error("Owner congrats error:", error);
      } finally {
        clearTimeout(timer);
      }
    })();

    return () => { 
      mounted = false; 
      clearTimeout(timer);
    };
  }, []);

  // När ägaren stänger modalen → skriv till DB så den aldrig kommer igen
  const acknowledge = async () => {
    if (!profile) return;
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ owner_welcome_at: new Date().toISOString() })
        .eq("id", profile.id);
      if (error) {
        toast({
          title: "Fel",
          description: "Kunde inte spara status – försöker igen senare.",
          variant: "destructive"
        });
        return;
      }
    } catch (error) {
      console.error("Failed to acknowledge congrats:", error);
    }
    setShow(false);
  };

  return { show, acknowledge };
}