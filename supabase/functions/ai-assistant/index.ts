
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AIRequest {
  type: 'visit_notes' | 'code_suggestions' | 'cover_letter_enhancement' | 'patient_communication';
  prompt: string;
  context?: any;
  model?: 'openai' | 'claude';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, prompt, context, model = 'openai' }: AIRequest = await req.json();
    
    console.log(`Processing AI request: ${type} using ${model}`);

    let systemPrompt = '';
    let enhancedPrompt = prompt;

    // Set system prompts based on request type
    switch (type) {
      case 'visit_notes':
        systemPrompt = 'You are a professional chiropractic assistant. Generate concise, clinical visit notes based on treatment descriptions. Focus on objective findings and treatment provided.';
        break;
      case 'code_suggestions':
        systemPrompt = 'You are a medical coding expert specializing in chiropractic care. Suggest appropriate ICD-10 and CPT codes based on treatment descriptions. Provide explanations for your suggestions.';
        break;
      case 'cover_letter_enhancement':
        systemPrompt = 'You are a professional medical communications specialist. Enhance cover letters for insurance submissions to be clear, professional, and persuasive while maintaining accuracy.';
        break;
      case 'patient_communication':
        systemPrompt = 'You are a compassionate healthcare communication specialist. Create clear, empathetic patient communications that explain medical information in accessible language.';
        break;
    }

    // Add context to prompt if provided
    if (context) {
      enhancedPrompt = `Context: ${JSON.stringify(context)}\n\nRequest: ${prompt}`;
    }

    let response;

    if (model === 'claude' && anthropicApiKey) {
      response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicApiKey,
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: `${systemPrompt}\n\n${enhancedPrompt}`
            }
          ]
        }),
      });

      const data = await response.json();
      console.log('Claude response received');
      
      return new Response(JSON.stringify({ 
        success: true,
        content: data.content[0].text,
        model: 'claude'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else if (openAIApiKey) {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: enhancedPrompt }
          ],
          max_tokens: 2000,
          temperature: 0.7
        }),
      });

      const data = await response.json();
      console.log('OpenAI response received');
      
      return new Response(JSON.stringify({ 
        success: true,
        content: data.choices[0].message.content,
        model: 'openai'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      throw new Error('No API keys available');
    }

  } catch (error) {
    console.error('Error in AI assistant function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
