import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PingResponse {
  success: boolean;
  message: string;
  statusCode?: number;
  timestamp: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const sitemapUrl = 'https://fixco.se/sitemap.xml';
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

    console.log(`[Sitemap Ping] Pinging Google for: ${sitemapUrl}`);

    // Ping Google Search Console
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    let googleResponse: Response;
    let statusCode: number;
    let responseMessage: string;
    let status: 'success' | 'error';

    try {
      googleResponse = await fetch(googlePingUrl, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      statusCode = googleResponse.status;
      
      if (googleResponse.ok) {
        status = 'success';
        responseMessage = `Successfully pinged Google Search Console. Status: ${statusCode}`;
        console.log(`[Sitemap Ping] ✅ Success: ${responseMessage}`);
      } else {
        status = 'error';
        const errorText = await googleResponse.text().catch(() => 'No response body');
        responseMessage = `Google returned error status ${statusCode}: ${errorText}`;
        console.error(`[Sitemap Ping] ❌ Error: ${responseMessage}`);
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        status = 'error';
        statusCode = 0;
        responseMessage = 'Request timeout after 10 seconds';
      } else {
        status = 'error';
        statusCode = 0;
        responseMessage = fetchError instanceof Error ? fetchError.message : 'Unknown fetch error';
      }
      console.error(`[Sitemap Ping] ❌ Fetch error: ${responseMessage}`);
    }

    // Get user ID from auth header (if authenticated)
    const authHeader = req.headers.get('authorization');
    let userId: string | null = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && user) {
        userId = user.id;
      }
    }

    // Log to database
    const { error: dbError } = await supabase
      .from('sitemap_pings')
      .insert({
        pinged_by: userId,
        status,
        response_code: statusCode,
        response_message: responseMessage,
        sitemap_url: sitemapUrl,
      });

    if (dbError) {
      console.error('[Sitemap Ping] Database logging error:', dbError);
      // Don't fail the request if logging fails
    }

    const response: PingResponse = {
      success: status === 'success',
      message: responseMessage,
      statusCode,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(response), {
      status: status === 'success' ? 200 : 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[Sitemap Ping] Unexpected error:', error);
    
    const errorResponse: PingResponse = {
      success: false,
      message: error instanceof Error ? error.message : 'Unexpected error occurred',
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
