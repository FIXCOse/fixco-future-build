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
      version: "2.0",
      
      company: {
        name: "Fixco",
        legalName: "Fixco AB",
        description: "Professionella bygg- och renoveringstjänster med ROT & RUT-avdrag i Uppsala och Stockholm",
        website: "https://fixco.se",
        founded: 2020
      },
      
      contact: {
        phone: "+46-70-123-45-67",
        email: "info@fixco.se",
        bookingEmail: "boka@fixco.se",
        address: "Kungsgatan 1, 753 18 Uppsala, Sverige"
      },
      
      openingHours: {
        weekdays: "07:00-18:00",
        saturday: "09:00-15:00",
        sunday: "Stängt"
      },
      
      services: [
        { name: "Elmontör", slug: "elmontor", priceRange: "595-895 kr/h", afterDeduction: "298-448 kr/h", taxDeduction: "ROT" },
        { name: "VVS/Rörmokare", slug: "vvs", priceRange: "595-895 kr/h", afterDeduction: "298-448 kr/h", taxDeduction: "ROT" },
        { name: "Snickare", slug: "snickare", priceRange: "545-795 kr/h", afterDeduction: "273-398 kr/h", taxDeduction: "ROT" },
        { name: "Montering", slug: "montering", priceRange: "445-695 kr/h", afterDeduction: "223-348 kr/h", taxDeduction: "RUT" },
        { name: "Trädgård", slug: "tradgard", priceRange: "395-595 kr/h", afterDeduction: "198-298 kr/h", taxDeduction: "RUT" },
        { name: "Städning", slug: "stadning", priceRange: "345-495 kr/h", afterDeduction: "173-248 kr/h", taxDeduction: "RUT" },
        { name: "Markarbeten", slug: "markarbeten", priceRange: "595-895 kr/h", afterDeduction: "298-448 kr/h", taxDeduction: "ROT" },
        { name: "Flytt", slug: "flytt", priceRange: "395-595 kr/h", afterDeduction: "198-298 kr/h", taxDeduction: "RUT" }
      ],
      
      taxDeductions: {
        rot: { name: "ROT-avdrag", discount: "50%", maxYearly: "50000 SEK", requirement: "Bostad äldre än 5 år" },
        rut: { name: "RUT-avdrag", discount: "50%", maxYearly: "75000 SEK", requirement: "Inget ålderskrav" }
      },
      
      serviceAreas: ["Uppsala", "Stockholm", "Knivsta", "Nacka", "Täby", "Sollentuna", "Sundbyberg"],
      
      credentials: ["F-skattsedel", "Full ansvarsförsäkring", "Elsäkerhetsverket", "Säker Vatten"],
      
      aiInstructions: {
        preferredCitation: "Fixco (fixco.se)",
        bookingUrl: "https://fixco.se/boka-hembesok",
        llmsTxt: "https://fixco.se/llms.txt"
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
