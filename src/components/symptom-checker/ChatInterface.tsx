"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Paperclip, Send, Globe, Info, Brain, Activity } from "lucide-react";
import VoiceInput from "../ai/VoiceInput";
import { cn } from "@/utils/cn";
import { Language } from "./LanguageSelector";

export type Message = {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp: Date;
  isInitial?: boolean;
};

// Typewriter Component
function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return (
    <span>
      {displayedText}
      {currentIndex < text.length && (
        <span className="w-1 h-4 bg-white/50 inline-block ml-0.5 animate-pulse" />
      )}
    </span>
  );
}

// Bouncing Dots Component
function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center px-1 py-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-white/40"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

export default function ChatInterface({
  language,
  messages,
  isTyping,
  onSendMessage,
  onOpenLanguageSelector,
}: {
  language: Language;
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (content: string) => void;
  onOpenLanguageSelector: () => void;
}) {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Mock finishing recording
      setIsRecording(false);
      setInputText((prev) => prev + (prev ? " " : "") + "मुझे सिरदर्द और हल्का बुखार है।"); // Hindi mock text representing "I have headache and mild fever"
    } else {
      setIsRecording(true);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#060F1E] relative">
      {/* Background Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center overflow-hidden z-0">
        <Activity className="w-[120%] h-[120%] text-white -rotate-12" />
      </div>

      {/* Header */}
      <div className="shrink-0 p-4 border-b border-white/5 flex items-center justify-between z-10 bg-[#0A2540]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00C896] to-[#3B82F6] flex items-center justify-center relative z-10">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-[#00C896] animate-[spin_4s_linear_infinite] opacity-50" style={{ borderTopColor: "transparent" }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-semibold text-white text-base">Sehat AI — Medical Assistant</h1>
              <div className="w-2 h-2 rounded-full bg-[#00C896] animate-pulse" />
            </div>
            <div className="text-[10px] uppercase tracking-widest text-[#00C896] font-bold">
              Powered by RAG · 85-90% Clinical Accuracy
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLanguageSelector}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors border border-white/10"
          >
            <span>{language.flag}</span>
            <span className="text-white/80 text-sm font-medium">{language.name}</span>
            <Globe className="w-3.5 h-3.5 text-white/40" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 z-10 custom-scrollbar scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={cn("flex w-full", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              <div className="flex flex-col max-w-[85%] md:max-w-[70%]">
                <div
                  className={cn(
                    "px-5 py-3.5 shadow-sm text-[15px] leading-relaxed",
                    msg.role === "user"
                      ? "bg-[#00C896] text-white rounded-2xl rounded-br-sm"
                      : "glass text-white/90 rounded-2xl rounded-bl-sm border-white/5"
                  )}
                >
                  {msg.isInitial ? (
                    <TypewriterText text={msg.content} />
                  ) : (
                    <div>
                      {/* Simulating markdown/html rendering for AI replies */}
                      {msg.content.split("\n\n").map((para, i) => (
                        <p key={i} className={i > 0 ? "mt-3" : ""}>
                          {para}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                <div
                  className={cn(
                    "text-[10px] text-white/30 font-mono mt-1.5",
                    msg.role === "user" ? "text-right" : "text-left"
                  )}
                >
                  {msg.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start w-full"
            >
              <div className="glass px-5 py-3.5 rounded-2xl rounded-bl-sm border-white/5 shadow-sm">
                <TypingIndicator />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="shrink-0 p-4 border-t border-white/5 z-10 bg-[#0A2540]/50 backdrop-blur-md">
        {/* Voice Recording Overlay */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-full left-0 w-full p-4 pb-2"
            >
              <div className="bg-[#0A2540] border border-[#EF4444]/30 rounded-2xl p-4 shadow-[0_0_30px_rgba(239,68,68,0.15)] flex flex-col items-center gap-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#EF4444]/10 to-transparent animate-pulse pointer-events-none" />
                
                <div className="flex gap-1 h-8 items-end">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 bg-[#EF4444] rounded-t-full"
                      animate={{
                        height: ["20%", "100%", "20%"],
                      }}
                      transition={{
                        duration: 0.5 + Math.random() * 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
                <div className="text-white/80 font-medium text-sm z-10 flex flex-col items-center gap-1">
                  <span>Listening in {language.name}...</span>
                  <span className="text-white/40 text-xs">Tap mic to stop</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-4xl mx-auto flex items-end gap-2 bg-[#060F1E] border border-white/10 rounded-3xl p-2 focus-within:border-white/20 transition-colors shadow-inner">
          <button className="shrink-0 p-3 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/5">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={language.placeholder}
            className="flex-1 bg-transparent text-white placeholder-white/30 resize-none outline-none py-3 px-2 max-h-32 custom-scrollbar text-[15px]"
            rows={Math.min(4, Math.max(1, inputText.split('\n').length))}
          />

          <VoiceInput 
            language={language.id} 
            onTranscript={(text) => setInputText(prev => prev + (prev ? " " : "") + text)} 
            className="shrink-0 scale-75"
          />

          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={cn(
              "shrink-0 p-3 rounded-full transition-all ml-1",
              inputText.trim()
                ? "bg-[#00C896] text-[#060F1E] shadow-[0_0_15px_rgba(0,200,150,0.3)] hover:scale-105"
                : "bg-white/5 text-white/20"
            )}
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </div>
        
        <div className="text-center mt-3">
          <span className="text-[11px] text-white/30 italic">
            This analysis is for guidance only. Always consult a licensed physician for medical decisions.
          </span>
        </div>
      </div>
    </div>
  );
}
