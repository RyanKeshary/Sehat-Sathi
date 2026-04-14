import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;

/**
 * Translates text using Google Translate API
 * @param text The text to translate
 * @param target Target language code
 * @param source Source language code (optional)
 */
async function translateText(text: string | string[], target: string, source?: string) {
  if (!GOOGLE_TRANSLATE_API_KEY) {
    console.warn("GOOGLE_TRANSLATE_API_KEY not found. Skipping translation.");
    return text;
  }
  
  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          target: target,
          ...(source && source !== "auto" ? { source } : {}),
        }),
      }
    );

    const data = await response.json();
    if (data.data && data.data.translations) {
      return Array.isArray(text) 
        ? data.data.translations.map((t: any) => t.translatedText)
        : data.data.translations[0].translatedText;
    }
    return text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}

const SYSTEM_PROMPT = `You are Sehat AI, a medical triage assistant for Sehat Sathi, a rural Indian healthcare platform. Your role is to:
1) Listen to patient symptoms described in any Indian language.
2) Ask clarifying questions to understand severity (duration, pain scale 1-10, fever temperature if known, associated symptoms).
3) Provide a triage assessment: GREEN (self-care at home), YELLOW (visit a doctor within 2-3 days), or RED (emergency — seek immediate care).
4) Give practical, culturally appropriate home care advice for GREEN cases.
5) Recommend specialist type for YELLOW cases.
6) Give emergency instructions for RED cases.

CRITICAL RULES:
- Never diagnose specific diseases — only describe possible conditions.
- Always recommend consulting a licensed doctor for final diagnosis.
- Never recommend specific prescription drugs by name.
- Do mention ORS for dehydration, paracetamol for fever (as it's OTC).
- Always end with: 'This is preliminary guidance only. Please consult a certified doctor for diagnosis.'
- Keep responses concise, warm, and in simple language.
- If user describes chest pain + left arm pain + sweating, immediately classify as RED emergency.
- If user describes difficulty breathing, immediately classify as RED.

Common conditions in rural India context: 
- Malaria (fever, chills, sweating — recommend malaria test, anti-malarials only with prescription)
- Dengue (high fever, severe joint pain, rash — RED if bleeding symptoms)
- Typhoid (sustained fever, weakness — requires antibiotic prescription)
- Tuberculosis (persistent cough >2 weeks, weight loss, night sweats — refer to DOTS center)
- Diarrhea (ORS, zinc for children — RED if blood in stool)
- Malnutrition in children (MUAC screening — refer to NRC)
- Hypertension (headache, dizziness — advise monitoring, medication compliance)
- Diabetes complications (excessive thirst, frequent urination, wounds not healing — advise blood glucose test).`;

export async function POST(req: Request) {
  try {
    const { message, language, conversationHistory = [], sessionId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    // 1. Translate message to English if needed
    let translatedMessage = message;
    if (language !== 'en') {
      translatedMessage = await translateText(message, 'en', language);
    }

    // 2. Prepare messages for OpenAI
    const promptMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-10).map((m: any) => ({
        role: m.role === 'ai' ? 'assistant' : m.role,
        content: m.content
      })),
      { role: 'user', content: translatedMessage }
    ];

    // 3. Initiate Streaming Completion
    const responseStream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: promptMessages as any,
      stream: true,
    });

    // 4. Create a stream to handle translation and extraction
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponseEn = "";
        const encoder = new TextEncoder();

        try {
          for await (const chunk of responseStream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              fullResponseEn += content;
              // If it's English, we can stream directly
              if (language === 'en') {
                controller.enqueue(encoder.encode(content));
              }
            }
          }

          let finalResponseToUser = fullResponseEn;

          // If not English, translate the full response and "stream" it to the UI
          if (language !== 'en') {
            finalResponseToUser = await translateText(fullResponseEn, language, 'en') as string;
            // Use a small delay between words to simulate typing effect for the translated response
            const tokens = finalResponseToUser.split(' ');
            for (let i = 0; i < tokens.length; i++) {
              controller.enqueue(encoder.encode(tokens[i] + (i === tokens.length - 1 ? "" : " ")));
              await new Promise(r => setTimeout(r, 20)); 
            }
          }

          // 5. Triage Extraction Phase
          const extractionResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              { role: 'system', content: "Based on this medical assistant response, extract in JSON: { \"triageLevel\": \"green\"|\"yellow\"|\"red\", \"symptoms\": string[], \"confidence\": number, \"requiresEmergency\": boolean }. Output ONLY JSON." },
              { role: 'user', content: fullResponseEn }
            ],
            response_format: { type: 'json_object' }
          });
          
          const extractionContent = extractionResponse.choices[0].message.content;
          if (extractionContent) {
            // Send extraction data as a special marker at the end
            controller.enqueue(encoder.encode(`\n__TRIAGE_DATA__${extractionContent}`));
          }

          controller.close();
        } catch (err) {
          console.error("Streaming error:", err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
