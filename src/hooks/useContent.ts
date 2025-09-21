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
  console.log('useContent called with:', { path, lang });
  
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['content', path, lang],
    queryFn: async (): Promise<ContentData | null> => {
      console.log('Fetching content for:', path, lang);
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

      console.log('Content fetched:', content);
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
    console.log('getContent called with data:', data);
    if (!data) return null;
    
    if (lang === 'sv') {
      console.log('Returning Swedish content:', data.sv_json);
      return data.sv_json;
    } else {
      // For English, only return live content
      console.log('Returning English live content:', data.en_live_json);
      return data.en_live_json || null;
    }
  };

  const content = getContent();
  console.log('useContent returning:', { content, isLoading, error, isEnglishMissing: lang === 'en' && data && !data.en_live_json });

  return {
    content,
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