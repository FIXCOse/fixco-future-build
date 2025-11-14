import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ReferenceProject {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  features: string[];
  title_sv: string;
  title_en: string | null;
  description_sv: string;
  description_en: string | null;
  location_sv: string;
  location_en: string | null;
  category_sv: string;
  category_en: string | null;
  features_sv: string[];
  features_en: string[] | null;
  duration: string;
  completed_date: string;
  price_amount: number;
  rot_saving_amount: number;
  rut_saving_amount: number;
  rating: number;
  client_initials: string;
  images: string[];
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useReferenceProjects = () => {
  return useQuery({
    queryKey: ['reference-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reference_projects')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ReferenceProject[];
    },
  });
};

export const useAllReferenceProjects = () => {
  return useQuery({
    queryKey: ['all-reference-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reference_projects')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ReferenceProject[];
    },
    staleTime: 0,
    gcTime: 0,
  });
};

export const useCreateReferenceProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (project: Omit<ReferenceProject, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('reference_projects')
        .insert([project])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reference-projects'] });
      queryClient.invalidateQueries({ queryKey: ['all-reference-projects'] });
      toast({
        title: "Projekt skapat",
        description: "Det nya referensprojektet har skapats framgångsrikt.",
      });
    },
    onError: (error) => {
      toast({
        title: "Fel vid skapande",
        description: "Kunde inte skapa projektet. Försök igen.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateReferenceProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<ReferenceProject> 
    }) => {
      const { data, error } = await supabase
        .from('reference_projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reference-projects'] });
      queryClient.invalidateQueries({ queryKey: ['all-reference-projects'] });
      toast({
        title: "Projekt uppdaterat",
        description: "Referensprojektet har uppdaterats framgångsrikt.",
      });
    },
    onError: (error) => {
      toast({
        title: "Fel vid uppdatering",
        description: "Kunde inte uppdatera projektet. Försök igen.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteReferenceProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('reference_projects')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reference-projects'] });
      queryClient.invalidateQueries({ queryKey: ['all-reference-projects'] });
      toast({
        title: "Projekt raderat",
        description: "Referensprojektet har raderats framgångsrikt.",
      });
    },
    onError: (error) => {
      toast({
        title: "Fel vid radering",
        description: "Kunde inte radera projektet. Försök igen.",
        variant: "destructive",
      });
    },
  });
};