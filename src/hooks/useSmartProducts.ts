import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SmartProduct {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: 'security' | 'lighting' | 'climate' | 'cleaning' | 'garden' | 'entertainment';
  description: string;
  features: string[];
  ai_features: string[];
  product_price: number;
  installation_price: number;
  total_price: number;
  installation_time: string;
  installation_difficulty: 'Lätt' | 'Medium' | 'Svår';
  installation_included: string[];
  view_count: number;
  purchase_count: number;
  popularity_score: number;
  average_rating: number;
  total_reviews: number;
  value_rating: number;
  warranty_years: number;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type SortOption = 
  | 'popularity' 
  | 'price_low' 
  | 'price_high' 
  | 'rating' 
  | 'value' 
  | 'newest';

interface UseSmartProductsOptions {
  category?: string;
  sortBy?: SortOption;
}

export const useSmartProducts = ({ category, sortBy = 'popularity' }: UseSmartProductsOptions = {}) => {
  return useQuery({
    queryKey: ['smart-products', category, sortBy],
    queryFn: async () => {
      let query = supabase
        .from('smart_products')
        .select('*')
        .eq('is_active', true);

      // Filter by category if specified
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      // Apply sorting
      switch (sortBy) {
        case 'popularity':
          query = query.order('popularity_score', { ascending: false });
          break;
        case 'price_low':
          query = query.order('total_price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('total_price', { ascending: false });
          break;
        case 'rating':
          query = query.order('average_rating', { ascending: false });
          break;
        case 'value':
          query = query.order('value_rating', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('popularity_score', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as SmartProduct[];
    },
  });
};

export const useTrackProductView = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      // Track the view in database
      const { error: trackError } = await supabase.rpc('track_product_view', {
        p_product_id: productId
      });

      if (trackError) {
        console.error('Error tracking product view:', trackError);
        // Don't throw error for tracking - it's not critical
      }

      // Log interaction
      const { error: logError } = await supabase
        .from('product_interactions')
        .insert({
          product_id: productId,
          interaction_type: 'view',
          session_id: crypto.randomUUID()
        });

      if (logError) {
        console.error('Error logging interaction:', logError);
        // Don't throw error for logging - it's not critical
      }
    },
    onSuccess: () => {
      // Invalidate and refetch products to get updated view counts
      queryClient.invalidateQueries({ queryKey: ['smart-products'] });
    },
  });
};

export const useTrackProductClick = () => {
  return useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('product_interactions')
        .insert({
          product_id: productId,
          interaction_type: 'click',
          session_id: crypto.randomUUID()
        });

      if (error) {
        console.error('Error tracking product click:', error);
      }
    },
  });
};