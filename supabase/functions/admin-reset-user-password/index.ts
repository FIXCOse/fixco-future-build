import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Verify the user is an admin
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Check if user is admin/owner
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'owner'].includes(profile.role)) {
      throw new Error('Access denied');
    }

    const { email } = await req.json();

    if (!email) {
      throw new Error('Email is required');
    }

    // Get user details for personalization
    const { data: profileData } = await supabaseClient
      .from('profiles')
      .select('first_name, last_name')
      .eq('email', email)
      .single();

    const userName = profileData?.first_name 
      ? `${profileData.first_name} ${profileData.last_name || ''}`
      : email;

    // Generate password reset link
    const { data, error } = await supabaseClient.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${Deno.env.get('SUPABASE_URL').replace('.supabase.co', '.lovableproject.com')}/mitt-fixco`,
      }
    });

    if (error) {
      throw error;
    }

    console.log('Password reset link generated for:', email);

    // Send email with Resend
    const emailResponse = await resend.emails.send({
      from: 'Fixco <noreply@fixco.se>',
      to: [email],
      subject: 'Återställ ditt lösenord - Fixco',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                border-radius: 8px 8px 0 0;
                text-align: center;
              }
              .content {
                background: #ffffff;
                padding: 30px;
                border: 1px solid #e5e7eb;
                border-top: none;
              }
              .button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 14px 28px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                margin: 20px 0;
              }
              .footer {
                background: #f9fafb;
                padding: 20px;
                border: 1px solid #e5e7eb;
                border-top: none;
                border-radius: 0 0 8px 8px;
                text-align: center;
                font-size: 14px;
                color: #6b7280;
              }
              .warning {
                background: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 12px;
                margin: 20px 0;
                border-radius: 4px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0;">Återställ ditt lösenord</h1>
            </div>
            <div class="content">
              <p>Hej ${userName},</p>
              <p>Vi har fått en förfrågan om att återställa lösenordet för ditt Fixco-konto. Om du inte har gjort denna förfrågan kan du ignorera detta meddelande.</p>
              
              <p>För att återställa ditt lösenord, klicka på knappen nedan:</p>
              
              <div style="text-align: center;">
                <a href="${data.properties.action_link}" class="button">
                  Återställ lösenord
                </a>
              </div>
              
              <div class="warning">
                <strong>⏰ Viktigt:</strong> Denna länk är giltig i 1 timme och kan endast användas en gång.
              </div>
              
              <p>Om knappen inte fungerar kan du kopiera och klistra in följande länk i din webbläsare:</p>
              <p style="background: #f3f4f6; padding: 12px; border-radius: 4px; word-break: break-all; font-size: 14px;">
                ${data.properties.action_link}
              </p>
              
              <p>Efter att du har återställt ditt lösenord kan du logga in på Mitt Fixco med ditt nya lösenord.</p>
              
              <p>Vänliga hälsningar,<br>Fixco-teamet</p>
            </div>
            <div class="footer">
              <p>Detta är ett automatiskt meddelande, vänligen svara inte på detta e-postmeddelande.</p>
              <p>&copy; ${new Date().getFullYear()} Fixco. Alla rättigheter förbehållna.</p>
            </div>
          </body>
        </html>
      `,
    });

    if (emailResponse.error) {
      console.error('Resend error:', emailResponse.error);
      throw new Error('Failed to send email');
    }

    console.log('Password reset email sent successfully to:', email);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Återställningslänk har skickats till användarens e-post'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});