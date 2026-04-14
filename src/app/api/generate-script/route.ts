import { NextRequest } from "next/server";

const SCRIPT_SYSTEM_PROMPT = `You are an AI assistant for Sehat Sathi clinic operations.
Generate empathetic, culturally-sensitive IVR/phone call scripts for health workers to use when calling patients.

TONE OPTIONS:
- Gentle: Warm, reassuring, family-like tone. Use "aap" (formal you). Express care.
- Firm: Professional, direct. Emphasize medical importance. Use clear action items.
- Urgent: Serious, concerned. Highlight consequences of non-compliance. Maintain respect.

OUTPUT FORMAT:
1. Greeting (personalized with patient name)
2. Purpose statement (why calling)
3. Health status check
4. Key message (medication/follow-up reminder)
5. Motivational close
6. Next steps with clear dates

Keep scripts under 200 words. Use simple Hindi-English mix where culturally appropriate.`;

export async function POST(request: NextRequest) {
  const { patientName, condition, tone, context } = await request.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Mock response when no API key
  if (!apiKey || apiKey === "sk-ant-xxx") {
    const scripts: Record<string, string> = {
      Gentle: `🙏 Namaste ${patientName} ji,

Main Sehat Sathi se bol rahi hoon. Aapki health ke baare mein check karna tha.

**Health Check:**
Aapki ${condition} ki recent reports ke mutabiq, humein aapka follow-up check karna hai. Koi naya symptom toh nahi aa raha?

**Important Reminder:**
Doctor sahab ne jo dawai di thi — please woh roz time pe lein. Agar koi problem ho toh hum yahan hain.

**Agle Steps:**
- Next appointment: 3 din mein
- Lab test: HbA1c pending hai

Aap apna khayal rakhein. Hum sab aapke saath hain. 💚`,

      Firm: `Namaste ${patientName} ji,

Sehat Sathi clinic se call kar rahe hain regarding your ${condition} management.

**Status Update:**
Aapki last 2 appointments miss ho gayi hain. Yeh aapki health ke liye concerning hai.

**Action Required:**
1. Medication Adherence: Daily prescribed dose jaruri hai
2. Lab Test: HbA1c overdue by 18 days — please get done this week
3. Follow-up: Schedule within 48 hours

**Medical Note:**
Consistent monitoring is critical for managing ${condition}. Please prioritize this.

Contact us at the clinic for any assistance.`,

      Urgent: `⚠️ ${patientName} ji — Urgent Health Follow-up

Sehat Sathi se emergency follow-up call. Aapki recent health indicators attention maangte hain.

**Critical Items:**
- Missed medication for 5+ days
- Lab test 18 days overdue
- No follow-up since last consultation

**Immediate Action Needed:**
Please visit the clinic TOMORROW or call us back today. If you experience any emergency symptoms (chest pain, breathlessness, severe weakness), call 108 immediately.

We are concerned about your wellbeing. This is important.`
    };

    return Response.json({
      script: scripts[tone] || scripts.Gentle,
      tone,
      generatedAt: new Date().toISOString(),
    });
  }

  // Real Claude API call
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SCRIPT_SYSTEM_PROMPT,
        messages: [{
          role: "user",
          content: `Generate a ${tone} tone call script for patient "${patientName}" with condition "${condition}". Context: ${context || "routine follow-up"}`,
        }],
      }),
    });

    const data = await response.json();
    return Response.json({
      script: data.content?.[0]?.text || "Script generation failed. Using default template.",
      tone,
      generatedAt: new Date().toISOString(),
    });
  } catch {
    return Response.json({
      script: `Namaste ${patientName} ji, Sehat Sathi se bol rahe hain. Aapki ${condition} ke follow-up ke liye call kar rahe hain. Please apni next appointment schedule karein.`,
      tone,
      generatedAt: new Date().toISOString(),
    }, { status: 200 });
  }
}
