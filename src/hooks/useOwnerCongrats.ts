import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type OwnerProfile = {
  id: string;
  role?: "owner" | "admin" | "tech" | "user" | null;
  owner_welcome_at: string | null;
};

export function useOwnerCongrats() {
  const [show, setShow] = useState(false);
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data: sessionRes } = await supabase.auth.getSession();
      const user = sessionRes?.session?.user;
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("id, owner_welcome_at")
        .eq("id", user.id)
        .single();

      if (error || !data || !mounted) return;

      setProfile(data);

      // Check if user is owner (for now, check by email since we don't have role column working yet)
      // This can be updated when the role system is properly implemented
      const isOwner = user.email === 'omar@dinadress.se' || user.email === 'omar@fixco.se';
      
      // Visa ENDAST för OWNER + aldrig tidigare visat
      if (isOwner && !data.owner_welcome_at) {
        // extra failsafe mot dubbelvisning i samma session
        const onceKey = `owner_welcome_once_${user.id}`;
        if (!sessionStorage.getItem(onceKey)) {
          setShow(true);
          sessionStorage.setItem(onceKey, "1");
        }
      }
    })();

    return () => { mounted = false; };
  }, []);

  // När ägaren stänger modalen → skriv till DB så den aldrig kommer igen
  const acknowledge = async () => {
    if (!profile) return;
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
    }
    setShow(false);
  };

  return { show, acknowledge };
}