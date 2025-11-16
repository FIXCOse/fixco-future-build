import { supabase } from '@/integrations/supabase/client';

/**
 * Genererar ett slug-baserat service ID från kategori och titel
 * Format: {kategori}-{slug-av-titel}-{löpnummer om behövs}
 */
export const generateServiceId = async (category: string, titleSv: string): Promise<string> => {
  // Skapa bas-slug
  const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
  const titleSlug = titleSv
    .toLowerCase()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  const baseSlug = `${categorySlug}-${titleSlug}`;
  
  // Kontrollera om ID redan finns
  const { data: existingServices } = await supabase
    .from('services')
    .select('id')
    .ilike('id', `${baseSlug}%`);
  
  if (!existingServices || existingServices.length === 0) {
    return baseSlug;
  }
  
  // Om det finns, lägg till löpnummer
  let maxNumber = 0;
  existingServices.forEach(service => {
    // Matcha exakt slug eller slug med -nummer
    if (service.id === baseSlug) {
      maxNumber = Math.max(maxNumber, 1);
    } else {
      const match = service.id.match(new RegExp(`^${baseSlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-(\\d+)$`));
      if (match) {
        maxNumber = Math.max(maxNumber, parseInt(match[1]));
      }
    }
  });
  
  if (maxNumber === 0) {
    return baseSlug;
  }
  
  return `${baseSlug}-${maxNumber + 1}`;
};
