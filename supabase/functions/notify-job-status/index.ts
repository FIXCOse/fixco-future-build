import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotifyJobStatusRequest {
  jobId: string;
  eventType: 'on_way' | 'completed';
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobId, eventType }: NotifyJobStatusRequest = await req.json();

    if (!jobId || !eventType) {
      throw new Error("Missing required fields: jobId and eventType");
    }

    if (!['on_way', 'completed'].includes(eventType)) {
      throw new Error("Invalid eventType. Must be 'on_way' or 'completed'");
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch job with related data
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .select(`
        *,
        customer:customers(id, email, name),
        worker:profiles!jobs_assigned_to_fkey(id, full_name)
      `)
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      throw new Error(`Job not found: ${jobError?.message}`);
    }

    if (!job.customer?.email) {
      throw new Error("Customer email not found");
    }

    const customerEmail = job.customer.email;
    const customerName = job.customer.name || "Kund";
    const workerName = job.worker?.full_name?.split(' ')[0] || "Hantverkare";

    let emailSubject = "";
    let emailHtml = "";

    // Build email content based on event type
    if (eventType === 'on_way') {
      emailSubject = `${workerName} är på väg till dig`;
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .content { padding: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; color: #2c3e50;">Hej ${customerName}!</h1>
            </div>
            <div class="content">
              <p><strong>${workerName}</strong> är nu på väg till dig för att påbörja arbetet.</p>
              <p>Om något har hänt eller om du har några frågor, ring gärna vårt kontor:</p>
              <p style="font-size: 18px; margin: 15px 0;">
                📞 <strong>079-335 02 28</strong>
              </p>
              <p>Vi ser fram emot att hjälpa dig!</p>
            </div>
            <div class="footer">
              <p><strong>Fixco AB</strong></p>
              <p>
                Telefon: 079-335 02 28<br>
                E-post: info@fixco.se<br>
                Webb: www.fixco.se
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (eventType === 'completed') {
      emailSubject = "Ditt projekt är slutfört!";
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .content { padding: 20px 0; }
            .highlight { background-color: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; color: #2c3e50;">Tack ${customerName}!</h1>
            </div>
            <div class="content">
              <p>Vi är glada att meddela att ditt projekt nu är <strong>slutfört</strong>. 🎉</p>
              <p>${workerName} har avslutat arbetet och vi hoppas att du är nöjd med resultatet.</p>
              
              <div class="highlight">
                <p style="margin: 0;"><strong>📄 Faktura</strong></p>
                <p style="margin: 5px 0 0 0;">Din faktura skickas inom 1-5 arbetsdagar.</p>
              </div>

              <p>Har du några frågor eller synpunkter? Hör gärna av dig till oss!</p>
              <p style="font-size: 18px; margin: 15px 0;">
                📞 <strong>079-335 02 28</strong><br>
                📧 <strong>info@fixco.se</strong>
              </p>
              <p>Tack för att du valde Fixco!</p>
            </div>
            <div class="footer">
              <p><strong>Fixco AB</strong></p>
              <p>
                Telefon: 079-335 02 28<br>
                E-post: info@fixco.se<br>
                Webb: www.fixco.se
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "Fixco <info@fixco.se>",
      to: [customerEmail],
      subject: emailSubject,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    // Log event in job_events table
    const eventName = eventType === 'on_way' ? 'email.on_way_sent' : 'email.completed_sent';
    const { error: logError } = await supabase
      .from('job_events')
      .insert({
        job_id: jobId,
        event: eventName,
        meta: {
          customer_email: customerEmail,
          sent_at: new Date().toISOString(),
          email_id: emailResponse.id,
        }
      });

    if (logError) {
      console.error("Failed to log event:", logError);
      // Don't throw - email was sent successfully
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailResponse.id,
        message: `Email sent to ${customerEmail}`
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error in notify-job-status function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
