import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import { Resend } from 'npm:resend@4.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question_id, answer, customer_email } = await req.json();

    if (!question_id || !answer) {
      return new Response(
        JSON.stringify({ error: 'Fråge-ID och svar krävs' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Hämta frågan och offerten
    const { data: question, error: fetchError } = await supabase
      .from('quote_questions')
      .select(`
        *,
        quote:quotes_new!inner(
          id,
          number,
          title,
          public_token,
          customer:customers(name, email)
        )
      `)
      .eq('id', question_id)
      .single();

    if (fetchError || !question) {
      return new Response(
        JSON.stringify({ error: 'Fråga hittades inte' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Uppdatera frågan med svar
    const { error: updateError } = await supabase
      .from('quote_questions')
      .update({
        answered: true,
        answer: answer,
        answered_at: new Date().toISOString()
      })
      .eq('id', question_id);

    if (updateError) throw updateError;

    // Skicka email till kund om email finns
    const emailToSend = customer_email || question.quote.customer?.email || question.customer_email;
    
    if (emailToSend) {
      try {
        const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
        const quoteUrl = `https://fixco.se/offert/${question.quote.public_token}`;

        await resend.emails.send({
          from: 'Fixco <info@fixco.se>',
          to: [emailToSend],
          subject: `Svar på din fråga om offert ${question.quote.number}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #0066cc;">Vi har svarat på din fråga!</h2>
              
              <p>Hej ${question.customer_name},</p>
              
              <p>Tack för din fråga om offert <strong>${question.quote.number}</strong> - ${question.quote.title}.</p>
              
              <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #666; font-size: 14px;"><strong>Din fråga:</strong></p>
                <p style="margin: 10px 0 0 0;">${question.question}</p>
              </div>
              
              <div style="background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0066cc;">
                <p style="margin: 0; color: #0066cc; font-size: 14px;"><strong>Vårt svar:</strong></p>
                <p style="margin: 10px 0 0 0;">${answer}</p>
              </div>
              
              <p style="margin-top: 30px;">
                <a href="${quoteUrl}" style="background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Se offerten
                </a>
              </p>
              
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Har du fler frågor? Svara på detta mail eller besök offerten för att ställa nya frågor.
              </p>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
              
              <p style="color: #999; font-size: 12px;">
                Med vänliga hälsningar,<br>
                Fixco
              </p>
            </div>
          `
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Continue even if email fails
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Serverfel' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
