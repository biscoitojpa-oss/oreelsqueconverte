import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PAIN_POINT_LABELS: Record<string, string> = {
  nao_aparece: "não aparece para ninguém no Instagram",
  nao_vende: "não consegue converter visualizações em vendas",
  concorrente: "vê os concorrentes dominando o feed enquanto fica invisível",
  trafego_pago: "gastou dinheiro com tráfego pago mas não teve retorno",
};

const OBJECTIVE_LABELS: Record<string, string> = {
  alcance_frio: "alcançar pessoas que nunca te viram antes",
  salvamentos: "gerar salvamentos e construir biblioteca de valor",
  compartilhamentos: "viralizar através de compartilhamentos",
  autoridade: "estabelecer autoridade no nicho",
};

const TONE_LABELS: Record<string, string> = {
  direto: "direto ao ponto, sem enrolação",
  polemico: "polêmico, que provoca discussão",
  educativo: "educativo prático, que ensina algo útil",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { businessType, painPoint, objective, tone } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const painPointText = PAIN_POINT_LABELS[painPoint] || painPoint;
    const objectiveText = OBJECTIVE_LABELS[objective] || objective;
    const toneText = TONE_LABELS[tone] || tone;

    const systemPrompt = `Você é um especialista em criação de Reels virais para Instagram, focado em distribuição orgânica para tráfego frio. Você entende profundamente o algoritmo do Instagram e cria conteúdo que maximiza retenção, replay e distribuição no Explorar/Reels.

REGRAS IMPORTANTES:
1. NUNCA use jargões técnicos de marketing - fale como empresário fala
2. O gancho (0-2s) deve ser UNIVERSAL - funcionar para qualquer pessoa, não só para quem já conhece o nicho
3. Crie loops visuais que incentivam replay
4. Elimine qualquer pausa ou momento morto
5. O fechamento deve criar urgência e levar de volta ao início
6. Linguagem simples, frases curtas, impacto imediato

FORMATO DE RESPOSTA (JSON):
{
  "script": {
    "hook": "Frase de abertura poderosa (0-2s)",
    "development": "Conteúdo principal que mantém atenção",
    "closing": "Fechamento com loop que incentiva replay"
  },
  "screenText": {
    "frame1": "Texto para primeiro frame",
    "frame2": "Texto para segundo frame",
    "frame3": "Texto para terceiro frame"
  },
  "videoPrompts": [
    {
      "title": "Título curto descritivo do estilo (ex: 'Cena Lifestyle')",
      "prompt": "Prompt completo com 'vertical 9:16 aspect ratio'. Descreva cena, iluminação, movimento de câmera.",
      "extendPrompt": "Prompt para estender este vídeo no Flow, continuando a cena de forma natural."
    },
    {
      "title": "Segundo estilo visual diferente",
      "prompt": "Prompt com abordagem visual diferente, mesmo tema. Sempre 'vertical 9:16 aspect ratio'.",
      "extendPrompt": "Prompt para estender este vídeo."
    },
    {
      "title": "Terceiro estilo visual",
      "prompt": "Variação com ambiente ou ângulo diferente. 'vertical 9:16 aspect ratio'.",
      "extendPrompt": "Prompt para estender."
    },
    {
      "title": "Quarto estilo visual",
      "prompt": "Última variação criativa. 'vertical 9:16 aspect ratio'.",
      "extendPrompt": "Prompt para estender."
    }
  ],
  "variations": {
    "alternativeHooks": ["Hook alternativo 1", "Hook alternativo 2", "Hook alternativo 3"],
    "alternativeClosings": ["Fechamento alternativo 1", "Fechamento alternativo 2"],
    "controversialVersion": "Versão mais polêmica do gancho principal"
  },
  "algorithmObjective": "Descrição curta do objetivo algorítmico",
  "caption": "Legenda completa para postar no Instagram, com texto envolvente, emojis estratégicos e 20-30 hashtags relevantes misturando hashtags populares e de nicho. A legenda deve complementar o Reel e incentivar engajamento (curtidas, comentários, salvamentos)."
}

IMPORTANTE PARA videoPrompts:
- Gere EXATAMENTE 4 prompts de vídeo diferentes
- Cada prompt deve ter uma abordagem visual DIFERENTE (ex: close-up vs wide shot, indoor vs outdoor, produto em uso vs lifestyle, POV vs terceira pessoa)
- TODOS devem incluir 'vertical 9:16 aspect ratio'
- O extendPrompt deve continuar naturalmente a cena do prompt principal, ideal para usar no Flow para estender o vídeo`;

    const userPrompt = `Crie um Reel otimizado para distribuição orgânica com os seguintes dados:

TIPO DE NEGÓCIO: ${businessType}
DOR PRINCIPAL: ${painPointText}
OBJETIVO DO CONTEÚDO: ${objectiveText}
TOM DESEJADO: ${toneText}

Gere um Reel completo seguindo todas as regras. O conteúdo deve resolver a dor do negócio enquanto atinge o objetivo algorítmico especificado.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse JSON from the response, handling markdown code blocks
    let parsed;
    try {
      // Remove markdown code blocks if present
      let jsonStr = content;
      if (content.includes("```json")) {
        jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      } else if (content.includes("```")) {
        jsonStr = content.replace(/```\n?/g, "");
      }
      parsed = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response as JSON");
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-reel:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
