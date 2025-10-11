import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  type: 'home_analysis' | 'cost_prediction' | 'project_assistant';
  userInput: {
    homeType?: string;
    homeSize?: string;
    buildYear?: string;
    budget?: string;
    priorities?: string;
    currentIssues?: string;
    projectType?: string;
    description?: string;
  };
  sessionId: string;
  userId?: string;
}

interface AIResponse {
  analysis: any;
  recommendations: any[];
  insights: string[];
  confidence: number;
  nextSteps: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    
    if (!lovableKey) {
      throw new Error('Lovable API key not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const requestData: AnalysisRequest = await req.json();

    console.log('Processing AI analysis request:', {
      type: requestData.type,
      sessionId: requestData.sessionId,
      userId: requestData.userId
    });

    // Fetch learning patterns to improve AI responses
    const { data: patterns } = await supabase
      .from('ai_learning_patterns')
      .select('*')
      .eq('pattern_type', requestData.type)
      .order('success_rate', { ascending: false })
      .limit(5);

    console.log('Retrieved learning patterns:', patterns?.length || 0);

    // Get previous user conversations for context
    const { data: previousConversations } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('user_id', requestData.userId || null)
      .eq('conversation_type', requestData.type)
      .order('created_at', { ascending: false })
      .limit(3);

    // Build intelligent prompt based on user input and learning data
    const intelligentPrompt = buildIntelligentPrompt(
      requestData.type,
      requestData.userInput,
      patterns || [],
      previousConversations || []
    );

    console.log('Generated intelligent prompt for Lovable AI');

    // Call Lovable AI Gateway with contextual, learning-based prompt
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Du är Fixcos AI-assistent som specialiserat dig på svenska hemförbättringar och ROT/RUT-avdrag. Du MÅSTE:
            1. Analysera input MYCKET noggrant och anpassa dina svar
            2. Ge SPECIFIKA, personliga rekommendationer baserat på exakt vad användaren skriver
            3. Inkludera exakta kostnadsberäkningar baserade på svensk marknad
            4. Förklara ROT/RUT-avdrag för varje rekommendation
            5. Vara kreativ men realistisk i dina förslag
            6. Lära från tidigare lyckade mönster
            7. Ge handlingsbara nästa steg
            
            Svara ALLTID i JSON-format med denna struktur:
            {
              "analysis": { detaljerad analys av användarens situation },
              "recommendations": [ lista med specifika rekommendationer ],
              "insights": [ personliga insikter baserade på input ],
              "confidence": nummer mellan 0-100,
              "nextSteps": [ konkreta nästa steg ]
            }`
          },
          {
            role: 'user',
            content: intelligentPrompt
          }
        ]
      }),
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json();
      console.error('Lovable AI API error:', errorData);
      
      // Handle specific errors
      if (aiResponse.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (aiResponse.status === 402) {
        throw new Error('Insufficient credits. Please add funds to your Lovable AI workspace.');
      }
      
      throw new Error(`Lovable AI API error: ${aiResponse.status}`);
    }

    const aiResult = await aiResponse.json();
    let parsedResponse: AIResponse;

    try {
      parsedResponse = JSON.parse(aiResult.choices[0].message.content);
    } catch (e) {
      // Fallback if JSON parsing fails
      console.error('Failed to parse AI response as JSON:', e);
      parsedResponse = {
        analysis: { error: "Kunde inte tolka AI-svar", raw: aiResult.choices[0].message.content },
        recommendations: [],
        insights: ["AI-analys misslyckades"],
        confidence: 0,
        nextSteps: ["Försök igen med mer specifik information"]
      };
    }

    console.log('Generated AI response with confidence:', parsedResponse.confidence);

    // Store conversation for learning
    const conversationData = {
      user_id: requestData.userId || null,
      session_id: requestData.sessionId,
      conversation_type: requestData.type,
      user_input: requestData.userInput,
      ai_response: parsedResponse
    };

    const { error: storeError } = await supabase
      .from('ai_conversations')
      .insert(conversationData);

    if (storeError) {
      console.error('Failed to store conversation:', storeError);
    } else {
      console.log('Conversation stored successfully');
    }

    // Update learning patterns based on this interaction
    await updateLearningPatterns(supabase, requestData.type, requestData.userInput, parsedResponse);

    return new Response(JSON.stringify({
      success: true,
      data: parsedResponse,
      metadata: {
        sessionId: requestData.sessionId,
        confidence: parsedResponse.confidence,
        patternsUsed: patterns?.length || 0
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage,
      fallbackResponse: generateFallbackResponse('general')
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function buildIntelligentPrompt(
  type: string,
  userInput: any,
  patterns: any[],
  previousConversations: any[]
): string {
  let prompt = `Analystyp: ${type}\n\nAnvändarens input:\n`;
  
  // Add all user input details
  Object.entries(userInput).forEach(([key, value]) => {
    if (value) {
      prompt += `${key}: ${value}\n`;
    }
  });

  // Add context from successful patterns
  if (patterns.length > 0) {
    prompt += `\nFramgångsrika mönster att lära från:\n`;
    patterns.forEach((pattern, idx) => {
      prompt += `${idx + 1}. Mönster med ${pattern.success_rate}% framgång: ${JSON.stringify(pattern.input_pattern)}\n`;
    });
  }

  // Add context from user's previous conversations
  if (previousConversations.length > 0) {
    prompt += `\nAnvändarens tidigare konversationer (för kontext):\n`;
    previousConversations.forEach((conv, idx) => {
      prompt += `${idx + 1}. Tidigare input: ${JSON.stringify(conv.user_input)}\n`;
    });
  }

  prompt += `\nAnvända denna information för att ge MYCKET specifika, personliga rekommendationer som är anpassade efter exakt vad användaren har skrivit. Var kreativ men praktisk.`;

  return prompt;
}

async function updateLearningPatterns(
  supabase: any,
  type: string,
  userInput: any,
  aiResponse: AIResponse
) {
  try {
    // Create pattern signature from user input
    const inputPattern = {
      homeType: userInput.homeType?.toLowerCase(),
      budgetRange: categorizeBudget(userInput.budget),
      priorities: extractPriorities(userInput.priorities),
      hasIssues: !!userInput.currentIssues
    };

    // Check if pattern exists
    const { data: existingPattern } = await supabase
      .from('ai_learning_patterns')
      .select('*')
      .eq('pattern_type', type)
      .contains('input_pattern', inputPattern)
      .single();

    if (existingPattern) {
      // Update existing pattern
      const newUsageCount = existingPattern.usage_count + 1;
      const newSuccessRate = calculateSuccessRate(existingPattern, aiResponse.confidence);

      await supabase
        .from('ai_learning_patterns')
        .update({
          usage_count: newUsageCount,
          success_rate: newSuccessRate,
          successful_outputs: [
            ...existingPattern.successful_outputs.slice(-4), // Keep last 4
            {
              recommendations: aiResponse.recommendations.slice(0, 3),
              confidence: aiResponse.confidence,
              timestamp: new Date().toISOString()
            }
          ],
          updated_at: new Date().toISOString()
        })
        .eq('id', existingPattern.id);
    } else {
      // Create new pattern
      await supabase
        .from('ai_learning_patterns')
        .insert({
          pattern_type: type,
          input_pattern: inputPattern,
          successful_outputs: [{
            recommendations: aiResponse.recommendations.slice(0, 3),
            confidence: aiResponse.confidence,
            timestamp: new Date().toISOString()
          }],
          usage_count: 1,
          success_rate: aiResponse.confidence
        });
    }

    console.log('Learning patterns updated successfully');
  } catch (error) {
    console.error('Failed to update learning patterns:', error);
  }
}

function categorizeBudget(budget?: string): string {
  if (!budget) return 'unknown';
  const num = parseInt(budget.replace(/\D/g, ''));
  if (num < 50000) return 'low';
  if (num < 150000) return 'medium';
  if (num < 300000) return 'high';
  return 'premium';
}

function extractPriorities(priorities?: string): string[] {
  if (!priorities) return [];
  const keywords = ['energi', 'säkerhet', 'komfort', 'värde', 'miljö', 'design', 'funktionalitet'];
  return keywords.filter(keyword => 
    priorities.toLowerCase().includes(keyword)
  );
}

function calculateSuccessRate(existingPattern: any, newConfidence: number): number {
  const currentRate = existingPattern.success_rate || 0;
  const count = existingPattern.usage_count || 1;
  return (currentRate * count + newConfidence) / (count + 1);
}

function generateFallbackResponse(type: string): AIResponse {
  const fallbacks = {
    home_analysis: {
      analysis: { message: "Grundläggande hemanalys baserad på svenska standarder" },
      recommendations: [
        { title: "Energieffektivisering", description: "Förbättra isolering och fönster", estimatedCost: 85000 },
        { title: "Säkerhetsuppdatering", description: "Moderna lås och alarmsystem", estimatedCost: 25000 }
      ],
      insights: ["Ditt hem har potential för förbättringar", "ROT-avdrag kan minska kostnaderna med 50%"],
      confidence: 60,
      nextSteps: ["Boka hembesök", "Begär detaljerad offert"]
    },
    cost_prediction: {
      analysis: { message: "Kostnadsbedömning baserad på svenska marknadsdata" },
      recommendations: [
        { title: "Standardrenovering", description: "Grundläggande förbättringar", estimatedCost: 120000 }
      ],
      insights: ["Priserna varierar beroende på region och kvalitet"],
      confidence: 70,
      nextSteps: ["Få exakt offert från Fixco"]
    },
    project_assistant: {
      analysis: { message: "Projektförslag baserat på vanliga svenska hemförbättringar" },
      recommendations: [
        { title: "Badrumrenovering", description: "Modernisera med miljövänliga material", estimatedCost: 180000 }
      ],
      insights: ["Planering är nyckeln till framgång"],
      confidence: 65,
      nextSteps: ["Diskutera med expert", "Planera projektets faser"]
    }
  };

  return fallbacks[type as keyof typeof fallbacks] || fallbacks.project_assistant;
}