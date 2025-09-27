import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useEditMode } from '@/stores/useEditMode';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface ContentBlockData {
  draft: Record<string, any>;
  published: Record<string, any>;
  updated_at?: string;
  updated_by?: string;
}

export function useContentBlock(key: string, locale: string) {
  const { isEditMode, changes } = useEditMode();
  const queryClient = useQueryClient();

  // Query for content block data
  const { data: contentBlock, isLoading, error } = useQuery({
    queryKey: ['content-block', key, locale],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('key', key)
        .eq('locale', locale)
        .maybeSingle();

      if (error) throw error;
      
      return data as ContentBlockData | null;
    }
  });

  // Mutation for updating content block
  const updateMutation = useMutation({
    mutationFn: async (patch: Record<string, any>) => {
      const { data, error } = await supabase
        .from('content_blocks')
        .upsert({
          key,
          locale,
          draft: {
            ...(contentBlock?.draft || {}),
            ...patch
          },
          updated_by: (await supabase.auth.getUser()).data.user?.id
        }, {
          onConflict: 'key,locale'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['content-block', key, locale] 
      });
    }
  });

  // Get the appropriate content (draft vs published)
  const getContent = (field?: string) => {
    const scope = `content:${key}:${locale}`;
    const stagedChange = changes[scope];
    
    let source = contentBlock;
    
    // Apply staged changes if any
    if (stagedChange?.data) {
      source = {
        ...contentBlock,
        draft: {
          ...(contentBlock?.draft || {}),
          ...stagedChange.data
        }
      };
    }

    const content = isEditMode 
      ? source?.draft || {} 
      : source?.published || {};

    return field ? content[field] : content;
  };

  // Update draft content
  const updateDraft = async (patch: Record<string, any>) => {
    return updateMutation.mutateAsync(patch);
  };

  // Publish draft to published
  const publish = async () => {
    const { error } = await supabase.rpc('rpc_publish_content_block', {
      p_key: key,
      p_locale: locale
    });

    if (error) throw error;

    queryClient.invalidateQueries({ 
      queryKey: ['content-block', key, locale] 
    });
  };

  return {
    contentBlock,
    isLoading,
    error,
    getContent,
    updateDraft,
    publish,
    isUpdating: updateMutation.isPending
  };
}