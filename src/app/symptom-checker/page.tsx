"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cross, 
  Mic, 
  Send, 
  Square, 
  ChevronRight, 
  Languages,
  AlertTriangle,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-components ---

const AI_AVATAR = (
  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20">
    <Cross className="text-white w-6 h-6 rotate-45" />
  </div>
);

const TypingIndicator = () => (
  <div className="flex gap-1.5 p-4 bg-white border border-sky-100 rounded-2xl shadow-sm self-start mb-6">
    {[0, 1, 2].map(i => (
      <motion.div
        key={i}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        className="w-1.5 h-1.5 bg-primary rounded-full"
      />
    ))}
  </div>
);

const PainScale = ({ onSelect }: { onSelect: (val: number) => void }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [isFlipping, setIsFlipping] = useState<number | null>(null);

  const options = [
    { score: 1, emoji: "😊", label: "Great" },
    { score: 2, emoji: "😐", label: "OK" },
    { score: 3, emoji: "😟", label: "Mild" },
    { score: 4, emoji: "😣", label: "Hard" },
    { score: 5, emoji: "😰", label: "Severe" },
  ];

  const handleSelect = (idx: number) => {
    setIsFlipping(idx);
    setTimeout(() => {
      setSelected(idx);
      setIsFlipping(null);
    }, 400);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex justify-between items-end px-2">
        {options.map((opt, i) => (
          <div key={opt.score} className="flex flex-col items-center gap-2">
            <motion.button
              onClick={() => handleSelect(i)}
              animate={isFlipping === i ? { rotateY: [0, 90, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center text-3xl border transition-all duration-300",
                selected === i 
                  ? "bg-primary border-primary shadow-lg shadow-primary/20" 
                  : "bg-white border-sky-100 hover:border-primary/50"
              )}
            >
              <span className={selected === i ? "filter grayscale brightness-200" : ""}>
                {opt.emoji}
              </span>
            </motion.button>
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest transition-colors",
              selected === i ? "text-primary" : "text-slate-400"
            )}>
              {opt.label}
            </span>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {selected !== null && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => onSelect(selected + 1)}
            className="w-full py-4 bg-primary text-white font-black rounded-xl shadow-lg shadow-primary/20"
          >
            Confirm Selection
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

const Waveform = () => (
  <div className="flex items-center gap-1 overflow-hidden h-8">
    {Array(24).fill(0).map((_, i) => (
      <motion.div
        key={i}
        animate={{ height: [4, Math.random() * 24 + 4, 4] }}
        transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.05 }}
        className="w-1 bg-primary rounded-full"
      />
    ))}
  </div>
);

// --- Main Chat Page ---

export default function SymptomChecker() {
  const [messages, setMessages] = useState<any[]>([
    { id: 1, role: "ai", text: "Hello! I'm here to help. What's your main concern today?" },
    { id: 2, role: "patient", text: "I've had a fever for 2 days." },
    { id: 3, role: "ai", text: "I understand. How high has your temperature been?" },
    { id: 4, role: "patient", text: "Around 101°F." },
    { id: 5, role: "ai", text: "On a scale of 1 to 5, how are you feeling right now?", component: "pain-scale" },
  ]);

  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;
    const userMsg = { id: Date.now(), role: "patient", text: userText };
    const newMessages = [...messages, userMsg];
    setMessages([...messages, userMsg]);
    setInput("");
    
    setIsTyping(true);
    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: newMessages.map(m => ({
            role: m.role === "ai" ? "assistant" : "user",
            content: m.text
          }))
        })
      });
      
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: "ai",
        text: data.content || "Thank you for sharing that. I'm processing your symptoms now."
      }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: "ai",
        text: "I encountered a connection error. Please try again."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F0F9FF] font-inter overflow-hidden">
      
      {/* TOP BAR */}
      <header className="h-[64px] bg-white border-b border-sky-100 px-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          {AI_AVATAR}
          <div>
            <h3 className="text-[17px] font-black text-sky-900 leading-tight">Sehat Sathi AI</h3>
            <span className="text-xs font-bold text-slate-400">Symptom Check — Step 3 of 7</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-3 py-1 bg-white border border-sky-100 rounded-full flex items-center gap-2 shadow-sm cursor-pointer hover:bg-slate-50">
             <Languages className="w-3.5 h-3.5 text-primary" />
             <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">English</span>
           </div>
           <div className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full flex items-center gap-2 animate-pulse">
             <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
             <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">Not a diagnosis</span>
           </div>
        </div>
      </header>

      {/* CHAT AREA */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-10 flex flex-col gap-8 scroll-smooth"
      >
        {messages.map((msg, i) => {
          const isAI = msg.role === "ai";
          const showAvatar = isAI && (i === 0 || messages[i-1].role !== "ai");
          
          return (
            <div key={msg.id} className="flex flex-col gap-2">
              {i % 3 === 0 && (
                <div className="flex items-center justify-center gap-4 my-4 opacity-30 select-none">
                  <div className="h-px flex-1 bg-slate-300" />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Today, 5:48 PM</span>
                  <div className="h-px flex-1 bg-slate-300" />
                </div>
              )}
              
              <div className={cn("flex gap-3", isAI ? "justify-start" : "justify-end")}>
                {isAI && <div className="w-8" />} {/* Avatar spacer */}
                
                <motion.div
                  initial={{ width: 40, opacity: 0, scale: 0.9 }}
                  whileInView={{ width: "auto", opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "relative max-w-[85%] p-4 min-w-[60px]",
                    isAI 
                      ? "bg-white border border-sky-100 rounded-2xl shadow-[0_2px_8px_rgba(8,145,178,0.06)]"
                      : "bg-[#F0F9FF] border border-primary/20 border-l-[3px] border-l-primary rounded-2xl"
                  )}
                >
                  {showAvatar && (
                    <div className="absolute -left-10 top-0">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-md">
                        <Cross className="text-white w-4 h-4 rotate-45" />
                      </div>
                    </div>
                  )}
                  
                  <p className={cn("text-[17px] leading-relaxed", isAI ? "text-slate-700 font-medium" : "text-sky-900 font-bold")}>
                    {msg.text}
                  </p>
                  
                  {msg.component === "pain-scale" && (
                    <div className="mt-8 border-t border-sky-50 pt-8">
                       <PainScale onSelect={(val) => {
                          setMessages(prev => [...prev, { id: Date.now(), role: "patient", text: `I'm feeling around a ${val} on the scale.` }]);
                       }} />
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          );
        })}

        {isTyping && <TypingIndicator />}
      </div>

      {/* FOOTER ZONE */}
      <footer className="bg-white border-t border-sky-100 pb-8 relative">
        {/* Progress Arc */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden w-[180px] h-[30px] flex items-end justify-center pointer-events-none">
           <svg width="180" height="180" viewBox="0 0 180 180" className="opacity-20 translate-y-[60px]">
              <circle cx="90" cy="90" r="88" fill="none" stroke="#0891B2" strokeWidth="2" strokeDasharray="552" strokeDashoffset={552 * (1 - 0.45)} />
           </svg>
        </div>

        {/* QUICK REPLY CHIPS */}
        <div className="flex overflow-x-auto gap-3 py-4 px-6 no-scrollbar">
          {["Fever", "Headache", "Cough", "More options →"].map(chip => (
            <button
              key={chip}
              onClick={() => setInput(chip)}
              className="px-6 py-2 bg-white border border-sky-100 rounded-full text-sm font-bold text-slate-700 whitespace-nowrap shadow-sm hover:border-primary/40 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* INPUT BAR */}
        <div className="h-[72px] px-6 flex items-center gap-4">
          <button 
            onClick={() => setIsRecording(!isRecording)}
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
              isRecording ? "bg-red-50 text-red-500" : "bg-primary/10 text-primary"
            )}
          >
            {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-6 h-6" />}
          </button>
          
          <div className="flex-1 h-12 relative flex items-center bg-slate-50/50 rounded-2xl px-4 border border-sky-50 focus-within:border-primary/30 transition-all">
             {isRecording ? (
                <div className="flex-1 flex justify-center"><Waveform /></div>
             ) : (
               <input
                type="text"
                placeholder="Type your symptoms..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="w-full bg-transparent outline-none text-base font-medium text-sky-900 placeholder:text-slate-400"
              />
             )}
          </div>

          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 disabled:opacity-30 disabled:grayscale transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </footer>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
