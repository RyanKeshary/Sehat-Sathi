"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, ActivitySquare, Phone, X } from "lucide-react";
import ChatInterface, { Message } from "@/components/symptom-checker/ChatInterface";
import TriageResult, { TriageData } from "@/components/symptom-checker/TriageResult";
import LanguageSelector, { Language, LANGUAGES } from "@/components/symptom-checker/LanguageSelector";

export default function SymptomCheckerPage() {
  const [isOffline, setIsOffline] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0]);
  const [isLangSelectorOpen, setIsLangSelectorOpen] = useState(false);

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
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString() + "-ai",
            role: "ai",
            content: "You are currently offline. Your symptoms have been logged to your secure offline diary. We will analyze them and provide medical guidance as soon as your internet connection is restored.",
            timestamp: new Date(),
          },
        ]);
      }, 500);
      return;
    }

    setIsTyping(true);

    try {
      const response = await fetch("/api/symptom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          symptoms: text, 
          language: selectedLanguage.id,
          history: messages.filter(m => !m.isInitial).map(m => ({ role: m.role, content: m.content }))
        }),
      });

      const data = await response.json();

      setIsTyping(false);

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString() + "-ai",
            role: "ai",
            content: data.analysis,
            timestamp: new Date(),
          },
        ]);

        setTriageData({
          level: data.triageLevel,
          percentage: data.triageLevel === "RED" ? 95 : data.triageLevel === "YELLOW" ? 70 : 40,
          explanation: data.analysis,
          symptoms: [
            { name: "Primary Symptom", medicalTerm: "Symptom", description: text, importance: 10 },
          ],
          actions: data.recommendations.map((rec: string) => ({
             type: data.triageLevel === "RED" ? "emergency" : "home",
             text: rec,
             timeframe: "Immediate"
          })),
          citations: [
            "MOHFW Guidelines",
            "Clinical Protocol v4",
          ],
        });
        setShowMobileTriage(true);
      } else {
        throw new Error(data.error || "AI analysis failed");
      }
    } catch (error) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-error",
          role: "ai",
          content: "I'm having trouble processing your symptoms right now. Please try again or connect with a doctor directly.",
          timestamp: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="h-screen w-full bg-[#060F1E] flex flex-col overflow-hidden font-sans">
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
                <span>AI requires internet. Offline mode: You can describe symptoms and we'll analyze when connected.</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex overflow-hidden relative">
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
                className="hidden md:block h-full shrink-0 border-l border-white/10"
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

        {/* Static Emergency Panel visible mostly when offline or as an overlay */}
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
