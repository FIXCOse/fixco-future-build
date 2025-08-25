-- Fix security issues - update functions with proper search_path

-- Update the update_product_popularity function
CREATE OR REPLACE FUNCTION update_product_popularity()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Calculate popularity based on views and purchases (weighted)
  NEW.popularity_score = (NEW.view_count * 0.1) + (NEW.purchase_count * 2.0) + (NEW.average_rating * 5.0);
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update the track_product_view function  
CREATE OR REPLACE FUNCTION track_product_view(p_product_id UUID)
RETURNS VOID 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE smart_products 
  SET view_count = view_count + 1
  WHERE id = p_product_id;
END;
$$;