"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Video, 
  MoreVertical, 
  CheckCheck, 
  Phone, 
  Mic, 
  Check,
  ChevronRight,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Sub-components ---

const TypewriterText = ({ text, onComplete }: { text: string, onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

const ChatBubble = ({ message, isBot, delay = 0, onAppeared }: any) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!visible) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      onAnimationComplete={onAppeared}
      className={cn(
        "max-w-[85%] rounded-[12px] p-2.5 relative mb-2 shadow-sm text-[13px] leading-relaxed",
        isBot ? "bg-[#262636] text-white self-start ml-2 rounded-tl-none" : "bg-[#005c4b] text-white self-end mr-2 rounded-tr-none"
      )}
    >
       <p>
         {isBot ? <TypewriterText text={message.text} /> : message.text}
       </p>
       <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[10px] opacity-40 uppercase">14:2{message.id}</span>
          {!isBot && <CheckCheck size={12} className="text-[#53bdeb]" />}
       </div>
       {/* Tail */}
       <div className={cn(
         "absolute top-0 w-2 h-2",
         isBot ? "-left-2 bg-[#262636] [clip-path:polygon(100%_0,0_0,100%_100%)]" : "-right-2 bg-[#005c4b] [clip-path:polygon(0_0,100%_0,0_100%)]"
       )} />
    </motion.div>
  );
};

const QuickReply = ({ chips, delay = 0 }: { chips: string[], delay?: number }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!visible) return null;

  return (
    <div className="flex flex-wrap gap-2 px-4 mb-4 mt-2">
      {chips.map((chip, i) => (
        <motion.button 
          key={chip}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1.05, 1], opacity: 1 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className="bg-white/10 hover:bg-white/20 border border-white/5 px-4 py-2 rounded-full text-[13px] font-medium text-[#25d366] whitespace-nowrap"
        >
          {chip}
        </motion.button>
      ))}
    </div>
  );
};

// --- Page Component ---

export default function WhatsAppMockup() {
  const [messages, setMessages] = useState<any[]>([
    { id: 1, text: "Hello! Welcome to Sehat Sathi. 🙏 I'm here to help you access healthcare. What language would you like to continue in?", isBot: true, chips: ["English", "Hindi", "Marathi", "Tamil", "More →"], nextDelay: 1000 },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const conversation = [
    { type: 'human', text: "English", next: { type: 'bot', text: "Great! What brings you here today? Please choose your main concern.", chips: ["Fever or Flu", "Chest Pain", "Diabetes Follow-Up", "Something Else"] } },
    { type: 'human', text: "Fever or Flu", next: { type: 'bot', text: "I understand. How long have you been feeling this way?", chips: ["Today", "2–3 Days", "About a Week", "Longer"] } },
    { type: 'human', text: "2–3 Days", next: { type: 'bot', text: "On a scale of 1 to 5, how severe is your discomfort? Tap a face. 😊😐😟😣😰", chips: ["😊", "😐", "😟", "😣", "😰"] } },
    { type: 'human', text: "😟", next: { type: 'bot', text: "Are you currently taking any medications?", chips: ["None", "Yes — I'll type them"] } },
    { type: 'human', text: "None", next: { type: 'bot', text: "✅ Your information has been sent to a doctor. Video call link in 5 minutes. Consultation ID: #SS-2047. Reply CANCEL at any time.", isFinal: true } },
  ];

  const handleNext = () => {
    if (currentStep >= conversation.length) return;
    const step = conversation[currentStep];
    const newMsgHuman = { id: messages.length + 1, text: step.text, isBot: false };
    const newMsgBot = { id: messages.length + 2, text: step.next.text, isBot: true, chips: step.next.chips, delay: 1000 };
    
    setMessages(prev => [...prev, newMsgHuman]);
    setTimeout(() => {
      setMessages(prev => [...prev, newMsgBot]);
      if (step.next.isFinal) {
        setTimeout(() => {
          setMessages(prev => [...prev, 
            { id: prev.length + 1, text: "📞 Using a basic phone? Call 1800-XXX-XXXX to speak with our team.", isBot: true, isTemplate: true }
          ]);
        }, 1500);
      }
    }, 800);
    setCurrentStep(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#FAFCFF] p-10 flex items-center justify-center gap-20 overflow-hidden font-inter">
      
      {/* PHONE FRAME (Pixel 8 Pro Style) */}
      <div className="relative w-[400px] h-[820px] bg-slate-100 rounded-[56px] border-[12px] border-slate-200 shadow-[0_40px_100px_rgba(8,145,178,0.15)] flex items-center justify-center overflow-hidden">
         {/* Glossy bezel ring */}
         <div className="absolute inset-x-0 inset-y-0 border-4 border-sky-100/30 rounded-[44px] pointer-events-none" />
         
         {/* Screen Container */}
         <div className="w-[375px] h-[760px] bg-[#1a1a2e] rounded-[32px] overflow-hidden flex flex-col relative">
            
            {/* WHATSAPP HEADER */}
            <div className="bg-[#1a1a2e]/95 backdrop-blur-md border-b border-white/5 pt-12 pb-3 px-4 flex items-center justify-between sticky top-0 z-50">
               <div className="flex items-center gap-3">
                  <ArrowLeft size={20} className="text-white" />
                  <div className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30">
                     <span className="text-xs font-black text-primary">SS</span>
                  </div>
                  <div>
                     <h3 className="text-sm font-black text-white leading-tight">Sehat Sathi Sahayak</h3>
                     <div className="flex items-center gap-1">
                        <span className="text-[10px] text-[#25d366] font-black uppercase tracking-widest">Verified Health Service</span>
                        <Check size={8} className="bg-[#25d366] text-[#1a1a2e] rounded-full p-0.5" />
                     </div>
                  </div>
               </div>
               <div className="flex items-center gap-4 text-white">
                  <Video size={18} />
                  <Phone size={16} />
                  <MoreVertical size={18} />
               </div>
            </div>

            {/* CHAT THREAD */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col pt-8 bg-[url('https://i.pinimg.com/736x/8c/9b/87/8c9b87e59c0379cb16b3260c883a938c.jpg')] bg-repeat bg-contain opacity-90 transition-all"
            >
               <AnimatePresence mode="popLayout">
                  {messages.map((msg, idx) => (
                    <div key={msg.id} className="flex flex-col">
                       {msg.isTemplate ? (
                         <motion.div 
                           initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                           className="bg-[#3e3411] text-[#ffd666] p-3 rounded-xl mx-4 mb-4 text-[12px] leading-relaxed border-l-4 border-[#ffd666]"
                         >
                            {msg.text}
                         </motion.div>
                       ) : (
                         <>
                           <ChatBubble message={msg} isBot={msg.isBot} delay={msg.delay} />
                           {msg.chips && idx === messages.length - 1 && (
                             <QuickReply chips={msg.chips} delay={1800} />
                           )}
                         </>
                       )}
                    </div>
                  ))}
               </AnimatePresence>
            </div>

            {/* BOT ACTION BUTTON (For Demo Only) */}
            <div className="p-4 bg-white/5 border-t border-white/5 flex items-center gap-4 sticky bottom-0 z-50">
               <div className="flex-1 h-10 bg-white/10 rounded-full px-4 flex items-center justify-between text-white/30 text-xs">
                  <span>Type a message...</span>
                  <div className="flex gap-3">
                     <Check size={14} className="opacity-0" />
                  </div>
               </div>
               <button 
                 onClick={handleNext}
                 className="w-10 h-10 bg-[#00a884] rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 transition-all"
               >
                  <Mic size={18} />
               </button>
            </div>

         </div>
      </div>

      {/* INFO CARD */}
      <div className="max-w-[400px] space-y-8">
         <div className="bg-white p-10 rounded-[40px] border-t-4 border-t-primary border-sky-100 shadow-xl shadow-sky-900/5">
            <h2 className="text-xl font-black text-sky-900 tracking-tight mb-8 flex items-center gap-3">
               How it Works <Info size={20} className="text-primary" />
            </h2>
            <div className="space-y-6">
               {[
                 { t: "Frictionless Onboarding", d: "No app download required. Patient clicks a link or scans a QR to start the session instantly." },
                 { t: "AI Powered Triage", d: "Bot collects symptoms & history using Bhashini-powered multi-lingual conversational AI." },
                 { t: "Hybrid Handoff", d: "Data is synced instantly to the Doctor's dashboard for a seamless video consult handoff." },
               ].map((item, i) => (
                 <div key={i} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-sky-50 flex items-center justify-center text-[10px] font-black text-primary shrink-0">{i+1}</div>
                    <div>
                       <h4 className="text-sm font-black text-sky-900 uppercase tracking-widest mb-1">{item.t}</h4>
                       <p className="text-xs font-bold text-slate-400 leading-relaxed">{item.d}</p>
                    </div>
                 </div>
               ))}
            </div>
            <div className="mt-10 p-6 bg-sky-50 rounded-[32px] border border-sky-100 flex flex-col gap-4">
               <div className="flex justify-between items-center text-[10px] font-black text-primary uppercase tracking-widest">
                  <span>Wait Time Reduction</span>
                  <span className="text-sky-900">42%</span>
               </div>
               <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "42%" }} className="h-full bg-primary" />
               </div>
            </div>
         </div>

         <div className="p-4 bg-primary/10 rounded-2xl flex items-center gap-4 border border-primary/20">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
               <Video size={18} />
            </div>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">Click Mic to Proceed Conversation</p>
         </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
      `}</style>

    </div>
  );
}
