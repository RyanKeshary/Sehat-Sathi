import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `You are Sehat Sathi Health Assistant — an AI-powered health intake system for rural India.

ROLE: You guide patients through a structured symptom assessment in a warm, culturally sensitive manner.

GUIDELINES:
1. Ask about chief complaint first, then duration, severity (1-10), associated symptoms
2. Ask about existing conditions, current medications, allergies
3. Use simple, empathetic language appropriate for patients with low health literacy
4. After gathering sufficient information, provide a structured summary
5. NEVER diagnose — always recommend consulting a doctor
6. Flag emergency symptoms immediately (chest pain, difficulty breathing, sudden weakness)
7. Support multilingual context — patients may mix Hindi/English

OUTPUT FORMAT for summary:
- Chief Complaint: [symptom]
- Duration: [time]
- Severity: [1-10]
- Associated Symptoms: [list]
- Red Flags: [if any]
- Recommended Next Step: [consult type]`;

export async function POST(request: NextRequest) {
  const { messages } = await request.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // If no API key, return mock response
  if (!apiKey || apiKey === "sk-ant-xxx") {
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";

    let mockResponse = "I understand. Could you tell me more about when this started and how severe it feels on a scale of 1 to 10?";

    if (lastMessage.includes("fever") || lastMessage.includes("bukhar")) {
      mockResponse = "I see you're experiencing fever. Let me gather some more details:\n\n1. **When did the fever start?** (e.g., today, 2 days ago)\n2. **How high is the temperature?** (if measured)\n3. **Are you experiencing any other symptoms?** (headache, body ache, cough, cold)\n4. **Are you currently taking any medication?**\n\nPlease take your time to answer. 🙏";
    } else if (lastMessage.includes("pain") || lastMessage.includes("dard")) {
      mockResponse = "I understand you're in pain. Let me help assess this:\n\n1. **Where exactly is the pain?** (head, chest, stomach, back)\n2. **On a scale of 1-10, how severe is it?**\n3. **Is it constant or does it come and go?**\n4. **Did anything trigger it?**\n\n⚠️ If you're experiencing severe chest pain or difficulty breathing, please seek emergency care immediately.";
    } else if (lastMessage.includes("cold") || lastMessage.includes("cough") || lastMessage.includes("khansi")) {
      mockResponse = "Let's understand your respiratory symptoms better:\n\n1. **Is the cough dry or with phlegm?**\n2. **How long has this been going on?**\n3. **Do you have a runny nose or sore throat?**\n4. **Any breathing difficulty?**\n\nThese details will help the doctor prepare for your consultation.";
    }

    return Response.json({
      role: "assistant",
      content: mockResponse,
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
        system: SYSTEM_PROMPT,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    const data = await response.json();
    return Response.json({
      role: "assistant",
      content: data.content?.[0]?.text || "I apologize, I'm having trouble processing that. Could you try rephrasing?",
    });
  } catch {
    return Response.json({
      role: "assistant",
      content: "I'm experiencing a connection issue. Please try again in a moment. If this is an emergency, please call your local emergency number.",
    }, { status: 200 });
  }
}
