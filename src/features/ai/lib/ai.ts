import { supabase } from "@/integrations/supabase/client";

export type AiMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AiTool = 
  | "get_services" 
  | "estimate_quote" 
  | "generate_pdf" 
  | "send_email" 
  | "edit_image"
  | "create_lead";

/**
 * Anropar AI chat edge function med tools
 */
export async function callAiChat(messages: AiMessage[], tools?: AiTool[]) {
  const { data, error } = await supabase.functions.invoke('ai-chat', {
    body: { messages, tools }
  });

  if (error) throw error;
  return data;
}

/**
 * Redigerar bild med AI (Lovable AI/Nano Banana)
 */
export async function aiEditImage(file: File, instruction: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke('ai-image-edit', {
    body: { 
      image: await fileToBase64(file), 
      instruction 
    }
  });

  if (error) throw error;
  return data.url;
}

/**
 * Skapar lead i databasen
 */
export async function createLead(leadData: {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  message?: string;
  serviceInterest?: string;
  estimatedQuote?: any;
  images?: string[];
}) {
  const { data, error } = await supabase
    .from('leads')
    .insert({
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      address: leadData.address,
      message: leadData.message,
      service_interest: leadData.serviceInterest,
      estimated_quote: leadData.estimatedQuote,
      images: leadData.images || [],
      source: 'ai_concierge'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Hämtar alla tjänster från databasen
 */
export async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) throw error;
  return data;
}

/**
 * Genererar PDF-offert
 */
export async function generatePdf(quoteData: any) {
  const { data, error } = await supabase.functions.invoke('generate-quote-pdf', {
    body: quoteData
  });

  if (error) throw error;
  return data.pdfUrl;
}

/**
 * Skickar email med offert
 */
export async function sendQuoteEmail(email: string, pdfUrl: string, quoteData: any) {
  const { data, error } = await supabase.functions.invoke('send-quote-email', {
    body: { email, pdfUrl, quoteData }
  });

  if (error) throw error;
  return data;
}

/**
 * Hjälpfunktion för att konvertera File till base64
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}
