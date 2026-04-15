"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, ActivitySquare, Phone, X, AlertCircle, Loader2 } from "lucide-react";
import ChatInterface, { Message } from "@/components/symptom-checker/ChatInterface";
import TriageResult, { TriageData } from "@/components/symptom-checker/TriageResult";
import LanguageSelector, { Language, LANGUAGES } from "@/components/symptom-checker/LanguageSelector";

// ────────────────────────────────────────────
// OFFLINE SYMPTOM ENGINE — Works without API
// ────────────────────────────────────────────
const OFFLINE_RULES: { keywords: string[]; message: string; triage: any }[] = [
  {
    keywords: ["chest", "heart", "cardiac", "chhati", "seene", "dil"],
    message: "🔴 **EMERGENCY — Possible Cardiac Event**\n\n⚠️ You are OFFLINE but this sounds urgent.\n\n**Do this NOW:**\n1. Call **108** (Ambulance) immediately\n2. Chew one Aspirin 325mg if available\n3. Sit upright, do NOT lie flat\n4. Stay calm, breathe slowly\n\n_This offline guidance is limited. Get medical help ASAP._",
    triage: { triageLevel: "red", symptoms: ["Chest Pain"], confidence: 0.90, requiresEmergency: true },
  },
  {
    keywords: ["breathe", "breathing", "breathless", "suffocate", "saans", "dum"],
    message: "🔴 **EMERGENCY — Breathing Difficulty**\n\n⚠️ OFFLINE mode — seek help immediately.\n\n**Do this NOW:**\n1. Call **108** for ambulance\n2. Sit upright — do NOT lie down\n3. Use inhaler if available (asthma)\n4. Open windows for fresh air\n\n_Reconnect for full AI analysis._",
    triage: { triageLevel: "red", symptoms: ["Breathing Difficulty"], confidence: 0.88, requiresEmergency: true },
  },
  {
    keywords: ["fever", "temperature", "bukhar", "taap", "chills", "shivering"],
    message: "🟡 **Fever — Home Care Guide (Offline)**\n\n• Take **Paracetamol (Dolo 650mg)** every 6-8 hours\n• Drink plenty of fluids — ORS, water, nimbu paani\n• Rest in a cool room\n• Place damp cloth on forehead\n\n**See doctor if:** Fever > 3 days, rash, severe body pain, or bleeding.\n\n_Your symptoms are saved and will be analyzed when online._",
    triage: { triageLevel: "yellow", symptoms: ["Fever"], confidence: 0.82, requiresEmergency: false },
  },
  {
    keywords: ["stomach", "vomit", "diarrhea", "loose", "nausea", "pet", "ulti", "dast"],
    message: "🟡 **Stomach Issue — Home Care (Offline)**\n\n• **ORS is #1 priority** — mix 6 tsp sugar + ½ tsp salt in 1 liter clean water\n• BRAT diet: Bananas, Rice, Apple, Toast\n• Avoid spicy and oily food\n• Take antacid for acidity\n\n**Rush to hospital if:** Blood in stool, can't keep fluids down, or severe pain.\n\n_Saved offline — will sync when connected._",
    triage: { triageLevel: "yellow", symptoms: ["Stomach Pain"], confidence: 0.84, requiresEmergency: false },
  },
  {
    keywords: ["headache", "head", "sir", "sar", "migraine"],
    message: "🟢 **Headache — Self-Care (Offline)**\n\n• Take **Paracetamol 500mg** with water\n• Rest in a dark, quiet room\n• Apply cold compress on forehead\n• **Drink water** — dehydration is the #1 cause\n\n**See doctor if:** Worst headache ever, with stiff neck, or after head injury.\n\n_Offline mode — will provide full analysis when reconnected._",
    triage: { triageLevel: "green", symptoms: ["Headache"], confidence: 0.85, requiresEmergency: false },
  },
  {
    keywords: ["cough", "cold", "throat", "khansi", "zukam", "gala"],
    message: "🟢 **Cold & Cough — Self-Care (Offline)**\n\n• Warm salt water gargle 3-4 times daily\n• Drink ginger tea with honey, haldi doodh\n• Steam inhalation with eucalyptus/Vicks\n• Paracetamol for mild fever\n\n**See doctor if:** Cough > 2 weeks, coughing blood, or high fever.\n\n_Offline mode active._",
    triage: { triageLevel: "green", symptoms: ["Cough", "Cold"], confidence: 0.83, requiresEmergency: false },
  },
  {
    keywords: ["injury", "wound", "cut", "bleeding", "burn", "fracture", "chot", "ghav"],
    message: "🟡 **Injury — First Aid (Offline)**\n\n• **Cuts:** Wash with clean water, apply pressure, use antiseptic\n• **Burns:** Cool water 10-20 min, do NOT use toothpaste/ice\n• **Fracture:** Don't move it, splint with stick/cardboard\n• Get **Tetanus injection** if not taken in 5 years\n\n**Go to hospital if:** Deep wound, bone visible, or snake/animal bite.\n\n_Offline — full analysis when reconnected._",
    triage: { triageLevel: "yellow", symptoms: ["Injury"], confidence: 0.85, requiresEmergency: false },
  },
  {
    keywords: ["pain", "body", "joint", "knee", "back", "dard", "kamar", "weakness", "tired"],
    message: "🟢 **Body Pain — Self-Care (Offline)**\n\n• Take **Paracetamol 500-650mg** (max 4/day)\n• Ice pack for new pain, warm compress for old pain\n• Rest and avoid heavy lifting\n• Gentle massage with warm oil\n\n**See doctor if:** Pain > 2 weeks, or with numbness/tingling.\n\n_Offline mode — symptoms saved locally._",
    triage: { triageLevel: "green", symptoms: ["Body Pain"], confidence: 0.80, requiresEmergency: false },
  },
];

function getOfflineResponse(text: string): { message: string; triage: any } {
  const lower = text.toLowerCase();
  for (const rule of OFFLINE_RULES) {
    if (rule.keywords.some(kw => lower.includes(kw))) {
      return { message: rule.message, triage: rule.triage };
    }
  }
  return {
    message: "📡 **You're Offline**\n\nI couldn't match your symptoms with my offline knowledge base.\n\n**While offline, you can:**\n• Call **108** for medical emergencies\n• Call **104** for health helpline\n• Take Paracetamol for pain/fever\n• Drink ORS for dehydration\n\nYour message has been saved and will be analyzed when you reconnect.\n\n_For emergencies, always call **108**._",
    triage: null,
  };
}

export default function SymptomCheckerPage() {
  const [isOffline, setIsOffline] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0]);
  const [isLangSelectorOpen, setIsLangSelectorOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "ai",
      content: "Namaste! I'm Sehat AI, your health companion. You can describe your symptoms in Hindi, Punjabi, English, or any language you're comfortable with. I'll help understand what you're feeling and guide you.\n\nHow are you feeling today?",
      timestamp: new Date(),
      isInitial: true,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [triageData, setTriageData] = useState<TriageData | null>(null);
  const [showMobileTriage, setShowMobileTriage] = useState(false);

  // Network offline detection
  useEffect(() => {
    const updateOnlineStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    updateOnlineStatus();
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  const handleSendMessage = async (text: string) => {
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMsg]);

    if (isOffline) {
      // Offline symptom analysis — provide useful guidance without server
      const offlineResponse = getOfflineResponse(text);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString() + "-ai",
            role: "ai",
            content: offlineResponse.message,
            timestamp: new Date(),
          },
        ]);
        if (offlineResponse.triage) {
          setTriageData(offlineResponse.triage);
        }
      }, 800);
      return;
    }

    if (selectedLanguage.id !== 'en') {
      setIsTranslating(true);
    }
    setIsAnalyzing(true);
    setIsTyping(true);

    // Create a placeholder for the AI message
    const aiMessageId = (Date.now() + 2).toString() + "-ai";
    const initialAiMsg: Message = {
      id: aiMessageId,
      role: "ai",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, initialAiMsg]);

    try {
      const response = await fetch("/api/symptom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: text, 
          language: selectedLanguage.id,
          conversationHistory: messages.filter(m => !m.isInitial).map(m => ({ 
            role: m.role === 'ai' ? 'assistant' : m.role, 
            content: m.content 
          })),
          sessionId: "default-session"
        }),
      });

      if (!response.ok) {
        throw new Error("AI service temporarily unavailable");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullContent = "";
      let triageDataJson = "";
      let foundTriageMarker = false;

      // Reset typing states as the stream starts
      setIsTranslating(false);
      setIsAnalyzing(false);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        
        if (chunk.includes("__TRIAGE_DATA__")) {
          foundTriageMarker = true;
          const parts = chunk.split("__TRIAGE_DATA__");
          fullContent += parts[0];
          triageDataJson = parts[1];
        } else if (foundTriageMarker) {
          triageDataJson += chunk;
        } else {
          fullContent += chunk;
          // Update message in real-time
          setMessages((prev) => 
            prev.map(m => m.id === aiMessageId ? { ...m, content: fullContent } : m)
          );
        }
      }

      setIsTyping(false);

      // Parse and apply triage data
      if (triageDataJson) {
        try {
          const extracted = JSON.parse(triageDataJson.trim());
          const levelUpper = (extracted.triageLevel || "green").toUpperCase() as "GREEN" | "YELLOW" | "RED";
          
          setTriageData({
            level: levelUpper,
            percentage: Math.round((extracted.confidence || 0.8) * 100),
            explanation: fullContent.split('\n')[0] || "Analysis complete",
            symptoms: (extracted.symptoms || []).map((s: string) => ({
              name: s,
              medicalTerm: s,
              description: "Identified in symptoms",
              importance: 8
            })),
            actions: [
              {
                type: extracted.requiresEmergency ? "emergency" : (levelUpper === "YELLOW" ? "appointment" : "home"),
                text: extracted.requiresEmergency ? "Seek immediate medical attention" : (levelUpper === "YELLOW" ? "Book a specialist consultation" : "Follow home care guidelines"),
                timeframe: extracted.requiresEmergency ? "Immediate" : (levelUpper === "YELLOW" ? "Within 2-3 days" : "Next 24-48 hours")
              }
            ],
            citations: ["Sehat Sathi Protocol v1.0", "WHO India Guidelines"],
          });
          setShowMobileTriage(true);
        } catch (e) {
          console.error("Failed to parse triage data", e);
        }
      }

    } catch (error: any) {
      setIsTyping(false);
      setIsTranslating(false);
      setIsAnalyzing(false);
      setMessages((prev) => 
        prev.map(m => m.id === aiMessageId 
          ? { ...m, content: "I'm having trouble connecting to my knowledge base. Please try again in a moment. If this is an emergency, please call 108 immediately." } 
          : m
        )
      );
    }
  };

  return (
    <div className="h-screen w-full bg-[#060F1E] flex flex-col overflow-hidden font-sans pt-20">
      {/* Offline Banner */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#EF4444] text-white shrink-0 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-2 flex items-center justify-between text-sm font-medium">
              <div className="flex items-center gap-2">
                <WifiOff className="w-4 h-4" />
                <span>AI requires internet. Offline mode enabled.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Translating Indicator Overlay */}
        <AnimatePresence>
          {(isTranslating || isAnalyzing) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-[#0A2540]/90 border border-white/10 px-4 py-2 rounded-full flex items-center gap-3 backdrop-blur-md shadow-2xl"
            >
              <Loader2 className="w-4 h-4 text-[#00C896] animate-spin" />
              <span className="text-white/90 text-sm font-medium">
                {isTranslating ? "Translating symptoms..." : "Sehat AI is thinking..."}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Conversation Area (65% on Desktop) */}
        <div className="flex-1 h-full flex flex-col relative min-w-0">
          <ChatInterface
            language={selectedLanguage}
            messages={messages}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
            onOpenLanguageSelector={() => setIsLangSelectorOpen(true)}
          />
          
          {/* Mobile Bottom Triage Toggle */}
          <AnimatePresence>
            {triageData && !showMobileTriage && (
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                className="md:hidden absolute bottom-24 left-1/2 -translate-x-1/2 z-20"
              >
                <button
                  onClick={() => setShowMobileTriage(true)}
                  className="bg-[#00C896] text-[#060F1E] px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2"
                >
                  <ActivitySquare className="w-5 h-5" />
                  View Health Analysis
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Triage Results Side Panel (35% on Desktop) */}
        <AnimatePresence>
          {triageData && (
            <>
              {/* Desktop Triage Panel */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "35%", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="hidden md:block h-full shrink-0 border-l border-white/10 bg-[#060F1E]"
              >
                <TriageResult data={triageData} />
              </motion.div>

              {/* Mobile Bottom Sheet Triage */}
              {showMobileTriage && (
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="md:hidden fixed inset-0 z-50 flex flex-col justify-end"
                >
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileTriage(false)} />
                  <div className="relative h-[85vh] w-full bg-[#0A2540] rounded-t-3xl overflow-hidden shadow-2xl flex flex-col">
                    <div className="shrink-0 p-4 border-b border-white/10 flex justify-end">
                      <button onClick={() => setShowMobileTriage(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex-1 overflow-hidden relative">
                      <TriageResult data={triageData} />
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>

        {/* Static Emergency Panel */}
        {isOffline && (
          <div className="absolute top-20 right-4 z-20">
            <div className="bg-[#EF4444] text-white p-4 rounded-2xl shadow-2xl border border-white/20">
              <h3 className="font-bold flex items-center gap-2 mb-3">
                <Phone className="w-4 h-4 fill-current" />
                Emergency Contacts
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-4 bg-white/10 px-3 py-1.5 rounded-lg font-mono">
                  <span>Ambulance</span>
                  <span className="font-bold">108</span>
                </div>
                <div className="flex justify-between gap-4 bg-white/10 px-3 py-1.5 rounded-lg font-mono">
                  <span>Health Helpline</span>
                  <span className="font-bold">104</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <LanguageSelector
        isOpen={isLangSelectorOpen}
        onClose={() => setIsLangSelectorOpen(false)}
        selectedLang={selectedLanguage}
        onSelect={setSelectedLanguage}
      />
    </div>
  );
}
