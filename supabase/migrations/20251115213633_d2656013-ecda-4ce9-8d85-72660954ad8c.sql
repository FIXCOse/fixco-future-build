-- FAS 1: Create service_addons table for add-on services
CREATE TABLE service_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id text NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  
  -- Swedish
  title_sv text NOT NULL,
  description_sv text,
  
  -- English
  title_en text,
  description_en text,
  
  -- Pricing
  addon_price numeric NOT NULL,
  price_unit text DEFAULT 'kr' CHECK (price_unit IN ('kr', 'kr/h', 'kr/st')),
  
  -- Tax eligibility
  rot_eligible boolean DEFAULT true,
  rut_eligible boolean DEFAULT false,
  
  -- Metadata
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  icon text, -- Emoji or icon name
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_service_addons_service ON service_addons(service_id);
CREATE INDEX idx_service_addons_active ON service_addons(is_active);

-- Add trigger for updated_at
CREATE TRIGGER update_service_addons_updated_at 
  BEFORE UPDATE ON service_addons 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Add selected_addons column to bookings table
ALTER TABLE bookings 
ADD COLUMN selected_addons jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN bookings.selected_addons IS 
'Array of selected add-ons with their prices at time of booking. Format: [{"addon_id": "uuid", "title": "string", "price": number, "quantity": number}]';

COMMENT ON TABLE service_addons IS 
'Add-on services that can be selected alongside main services (e.g., cable management for TV mounting)';

-- RLS Policies for service_addons
ALTER TABLE service_addons ENABLE ROW LEVEL SECURITY;

-- Public can view active add-ons
CREATE POLICY "Anyone can view active addons"
ON service_addons FOR SELECT
TO public
USING (is_active = true);

-- Admin/Owner can manage all add-ons
CREATE POLICY "Admin/Owner can manage addons"
ON service_addons FOR ALL
TO authenticated
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());