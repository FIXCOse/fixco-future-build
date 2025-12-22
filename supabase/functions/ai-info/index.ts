import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const aiInfo = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      timestamp: new Date().toISOString(),
      version: "2.1",
      
      company: {
        name: "Fixco",
        legalName: "Fixco AB",
        description: "Professionella bygg- och renoveringstjänster med ROT & RUT-avdrag i Uppsala och Stockholm",
        website: "https://fixco.se",
        founded: 2020
      },
      
      contact: {
        phone: "+46 79 335 02 28",
        email: "info@fixco.se",
        bookingEmail: "boka@fixco.se",
        address: "Kungsgatan 1, 753 18 Uppsala, Sverige"
      },
      
      openingHours: {
        weekdays: "07:00-18:00",
        saturday: "09:00-15:00",
        sunday: "Stängt"
      },
      
      importantNotice: "⚠️ El- och VVS-jobb kräver alltid offert. Kontakta oss för prisuppgift.",
      
      services: [
        { 
          name: "Elmontör", 
          slug: "elmontor", 
          pricingModel: "quote_required",
          note: "Offert krävs för de flesta eljobb",
          indicativePrice: "~1059 kr/h",
          afterDeduction: "~530 kr/h",
          taxDeduction: "ROT" 
        },
        { 
          name: "VVS/Rörmokare", 
          slug: "vvs", 
          pricingModel: "quote_only",
          note: "Offert krävs för alla VVS-jobb – varje projekt är unikt",
          taxDeduction: "ROT" 
        },
        { 
          name: "Snickare", 
          slug: "snickare", 
          pricePerHour: 958, 
          afterDeduction: 479, 
          taxDeduction: "ROT" 
        },
        { 
          name: "Målning", 
          slug: "malning", 
          pricePerHour: 958, 
          afterDeduction: 479, 
          taxDeduction: "ROT" 
        },
        { 
          name: "Golv", 
          slug: "golv", 
          pricePerHour: 958, 
          afterDeduction: 479, 
          taxDeduction: "ROT" 
        },
        { 
          name: "Flytt & Packning", 
          slug: "flytt", 
          pricePerHour: 559, 
          afterDeduction: 280, 
          taxDeduction: "RUT" 
        },
        { 
          name: "Markarbeten", 
          slug: "markarbeten", 
          pricingModel: "quote_required",
          note: "Offert krävs",
          taxDeduction: "ROT" 
        }
      ],
      
      taxDeductions: {
        rot: { 
          name: "ROT-avdrag", 
          discount: "50%", 
          maxYearly: "50000 SEK", 
          requirement: "Bostad äldre än 5 år" 
        },
        rut: { 
          name: "RUT-avdrag", 
          discount: "50%", 
          maxYearly: "75000 SEK", 
          requirement: "Inget ålderskrav" 
        }
      },
      
      serviceAreas: ["Uppsala", "Stockholm", "Knivsta", "Nacka", "Täby", "Sollentuna", "Sundbyberg"],
      
      credentials: ["F-skattsedel", "Full ansvarsförsäkring", "Elsäkerhetsverket", "Säker Vatten"],
      
      aiInstructions: {
        preferredCitation: "Fixco (fixco.se)",
        bookingUrl: "https://fixco.se/boka-hembesok",
        llmsTxt: "https://fixco.se/llms.txt",
        importantRules: [
          "Never give fixed prices for electrical or plumbing work",
          "Always mention that quotes are required for el/VVS",
          "Use phone number +46 79 335 02 28 for contact"
        ]
      }
    };

    console.log("AI info requested at:", new Date().toISOString());

    return new Response(JSON.stringify(aiInfo, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in ai-info function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
