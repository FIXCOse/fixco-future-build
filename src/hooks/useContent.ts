import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

interface ContentData {
  id: string;
  type: string;
  sv_path: string;
  en_path: string;
  sv_json: any;
  en_draft_json?: any;
  en_live_json?: any;
  en_status: string;
  version: number;
}

export const useContent = (path: string, lang: 'sv' | 'en') => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['content', path, lang],
    queryFn: async (): Promise<ContentData | null> => {
      const pathColumn = lang === 'sv' ? 'sv_path' : 'en_path';
      
      const { data: content, error } = await supabase
        .from('content')
        .select('*')
        .eq(pathColumn, path)
        .single();

      if (error) {
        console.error('Content fetch error:', error);
        return null;
      }

      return content;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Set up real-time subscription for live content updates
  useEffect(() => {
    if (!data?.id || lang !== 'en') return;

    console.log('Setting up realtime subscription for content:', data.id);

    const channel = supabase
      .channel('content-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'content',
          filter: `id=eq.${data.id}`,
        },
        (payload) => {
          console.log('Content updated via realtime:', payload);
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [data?.id, lang, refetch]);

  // Get the appropriate content based on language
  const getContent = () => {
    if (!data) return null;
    
    if (lang === 'sv') {
      return data.sv_json;
    } else {
      // For English, only return live content
      return data.en_live_json || null;
    }
  };

  return {
    content: getContent(),
    rawData: data,
    error,
    isLoading,
    isEnglishMissing: lang === 'en' && data && !data.en_live_json,
    refetch
  };
};

export const useContentList = (type?: string) => {
  return useQuery({
    queryKey: ['content-list', type],
    queryFn: async (): Promise<ContentData[]> => {
      let query = supabase.from('content').select('*').order('sv_path');
      
      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};