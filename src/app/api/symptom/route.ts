import { NextResponse } from "next/server";

const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;

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

export async function POST(req: Request) {
  try {
    const { symptoms, language = "en", history } = await req.json();

    if (!symptoms) {
      return NextResponse.json({ error: "No symptoms provided" }, { status: 400 });
    }

    // 1. Translate Input to English if not already in English
    let processedSymptoms = symptoms;
    if (language !== "en") {
      processedSymptoms = await translateText(symptoms, "en", language);
    }

    // Simulate AI Processing Delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulated RAG Logic (using translated symptoms)
    let analysis = "";
    let triageLevel = "GREEN";
    let recommendations: string[] = [];

    const inputLower = processedSymptoms.toLowerCase();

    if (inputLower.includes("chest pain") || inputLower.includes("difficulty breathing") || inputLower.includes("heart")) {
      analysis = "Your symptoms suggest a potentially cardiac or respiratory emergency. Immediate medical assessment is required.";
      triageLevel = "RED";
      recommendations = [
        "Call emergency services immediately",
        "Do not drive yourself to the hospital",
        "Keep a record of when pain started",
      ];
    } else if (inputLower.includes("fever") && (inputLower.includes("cough") || inputLower.includes("body ache"))) {
      analysis = "Your symptoms are consistent with a viral respiratory infection such as Influenza or COVID-19.";
      triageLevel = "YELLOW";
      recommendations = [
        "Monitor your oxygen saturation",
        "Stay hydrated and rest",
        "Schedule a video consultation if fever exceeds 102°F",
      ];
    } else {
      analysis = "Based on your description, your symptoms appear non-emergent at this time. However, persistence warrants a clinical review.";
      triageLevel = "GREEN";
      recommendations = [
        "Observation for 24 hours",
        "Standard OTC support if applicable",
        "Book a routine check-up",
      ];
    }

    // 2. Translate Output back to User's Language
    if (language !== "en") {
      const [translatedAnalysis, translatedRecs] = await Promise.all([
        translateText(analysis, language, "en"),
        translateText(recommendations, language, "en"),
      ]);
      analysis = translatedAnalysis as string;
      recommendations = translatedRecs as string[];
    }

    return NextResponse.json({
      success: true,
      analysis,
      triageLevel,
      recommendations,
      disclaimer: language === "en" 
        ? "This is an AI-powered triage assistant. It is NOT a definitive diagnosis. If you feel very unwell, seek professional help immediately."
        : await translateText("This is an AI-powered triage assistant. It is NOT a definitive diagnosis. If you feel very unwell, seek professional help immediately.", language, "en")
    });
  } catch (error) {
    console.error("AI API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
