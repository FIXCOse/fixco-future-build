import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthProfile } from "@/hooks/useAuthProfile";

export function useOwnerCongrats() {
  const [show, setShow] = useState(false);
  const { profile } = useAuthProfile();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    if (!profile) return;

    // Visa ENDAST för OWNER + aldrig tidigare visat
    if (profile.role === 'owner' && !profile.owner_welcome_at) {
      // Extra failsafe mot dubbelvisning i samma session
      const onceKey = `owner_welcome_once_${profile.id}`;
      if (!sessionStorage.getItem(onceKey)) {
        if (mounted) {
          setShow(true);
          sessionStorage.setItem(onceKey, "1");
        }
      }
    }

    return () => { 
      mounted = false;
    };
  }, [profile]);

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
