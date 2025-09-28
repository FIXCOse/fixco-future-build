-- Create reference_projects table for storing project showcase data
CREATE TABLE public.reference_projects (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  category text NOT NULL,
  duration text NOT NULL,
  completed_date date NOT NULL,
  price_amount numeric NOT NULL,
  rot_saving_amount numeric NOT NULL DEFAULT 0,
  rut_saving_amount numeric NOT NULL DEFAULT 0,
  rating integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  client_initials text NOT NULL,
  features text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reference_projects ENABLE ROW LEVEL SECURITY;

-- Public can view active projects
CREATE POLICY "Anyone can view active reference projects" 
ON public.reference_projects 
FOR SELECT 
USING (is_active = true);

-- Admin/Owner can manage all projects
CREATE POLICY "Admin/Owner can manage reference projects" 
ON public.reference_projects 
FOR ALL 
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

-- Create trigger for updating timestamps
CREATE TRIGGER update_reference_projects_updated_at
BEFORE UPDATE ON public.reference_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data
INSERT INTO public.reference_projects (
  title, description, location, category, duration, completed_date, 
  price_amount, rot_saving_amount, rating, client_initials, features, images
) VALUES 
(
  'Moderna Köksrenovering',
  'Komplett renovering med marmorbänkskivor och integrerade vitvaror',
  'Östermalm, Stockholm',
  'Kök & Badrum',
  '3 veckor',
  '2024-01-15',
  185000,
  92500,
  5,
  'M.L',
  ARRAY['Marmorbänkskivor', 'Integrerade vitvaror', 'LED-belysning', 'Mjuka stängningar'],
  ARRAY['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1556909185-4d3f0e82b799?w=800&h=600&fit=crop']
),
(
  'Lyxigt Spa-badrum',
  'Spa-känsla med natursten, golvvärme och regnduschhuvud',
  'Södermalm, Stockholm',
  'Badrum',
  '4 veckor',
  '2024-02-10',
  220000,
  110000,
  5,
  'A.S',
  ARRAY['Natursten', 'Golvvärme', 'Regnduschhuvud', 'Handdukstork'],
  ARRAY['https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=800&h=600&fit=crop']
),
(
  'Skandinavisk Vardagsrum',
  'Minimalistisk design med naturliga material och smarta förvaringslösningar',
  'Vasastan, Stockholm',
  'Vardagsrum',
  '2 veckor',
  '2024-03-05',
  95000,
  47500,
  5,
  'L.E',
  ARRAY['Inbyggd förvaring', 'Parkettgolv', 'Smart belysning', 'Eldstad'],
  ARRAY['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&h=600&fit=crop']
),
(
  'Trädgårdsaltan Premium',
  'Lyxig altan med integrerad utomhuskök och lounge-område',
  'Djursholm, Danderyd',
  'Trädgård & Utomhus',
  '3 veckor',
  '2024-03-20',
  150000,
  75000,
  5,
  'K.H',
  ARRAY['Utomhuskök', 'Pergola', 'LED-streifen', 'Väderskydd'],
  ARRAY['https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=800&h=600&fit=crop']
),
(
  'Smart Hemkontor',
  'Ergonomiskt hemkontor med smarta lösningar och perfekt belysning',
  'Gamla Stan, Stockholm',
  'Kontor & Arbetsrum',
  '1 vecka',
  '2024-04-02',
  75000,
  37500,
  5,
  'J.P',
  ARRAY['Höj/sänkbart skrivbord', 'Akustikpaneler', 'Smart belysning', 'Kabelhantering'],
  ARRAY['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop']
),
(
  'Barnrums Äventyr',
  'Kreativt och säkert barnrum med lekfulla element och smarta förvaringslösningar',
  'Lidingö, Stockholm',
  'Barnrum',
  '2 veckor',
  '2024-04-15',
  65000,
  32500,
  5,
  'H.W',
  ARRAY['Klättervägg', 'Inbyggd säng', 'Leksaksförvaring', 'Säker design'],
  ARRAY['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop']
);