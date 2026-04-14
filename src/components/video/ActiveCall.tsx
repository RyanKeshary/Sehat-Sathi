"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, MicOff, Video, VideoOff, 
  MessageSquare, Monitor, PhoneOff, 
  Settings, Users, Shield, Maximize,
  Send, Sparkles, Activity
} from "lucide-react";
import { RTCQuality } from "@/hooks/use-rtc-stats";

interface ActiveCallProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  connectionStatus: string;
  doctorInfo: { name: string; specialization: string; image: string };
  onEndCall: () => void;
  messages: any[];
  onSendMessage: (text: string) => void;
  onShareScreen: () => void;
  stats: RTCQuality;
}

export function ActiveCall({ 
  localStream, 
  remoteStream, 
  connectionStatus, 
  doctorInfo,
  onEndCall,
  messages,
  onSendMessage,
  onShareScreen,
  stats
}: ActiveCallProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localStream && localVideoRef.current) localVideoRef.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(t => t.enabled = isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(t => t.enabled = isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleSend = () => {
    if (chatInput.trim()) {
      onSendMessage(chatInput);
      setChatInput("");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#060F1E] flex overflow-hidden">
      {/* Main Video Area */}
      <div className="flex-1 relative flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-6 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-4 pointer-events-auto">
            <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-white font-bold text-sm tracking-wide">
                Live with {doctorInfo.name}
              </span>
            </div>
            <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3">
              <Activity size={14} className={stats.status === 'excellent' ? 'text-emerald-500' : 'text-amber-500'} />
              <span className="text-white/70 text-xs font-medium">
                {Math.round(stats.latency)}ms · {stats.fps} FPS
              </span>
            </div>
          </div>
          
          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 pointer-events-auto flex items-center gap-4">
             <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-[#060F1E] bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white">PS</div>
                <div className="w-8 h-8 rounded-full border-2 border-[#060F1E] bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white">ME</div>
             </div>
             <div className="w-px h-4 bg-white/10" />
             <Shield className="text-emerald-500" size={16} />
             <span className="text-white/60 text-xs font-medium uppercase tracking-widest">E2EE Active</span>
          </div>
        </div>

        {/* Remote Video (Doctor) */}
        <div className="absolute inset-0 z-0">
          {remoteStream ? (
            <video 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#0A2540] animate-pulse">
                <img src={doctorInfo.image} className="w-32 h-32 rounded-full border-4 border-white/10 mb-6 object-cover" alt="" />
                <p className="text-white/40 font-medium">Connecting to {doctorInfo.name}...</p>
                <p className="text-accent/60 text-xs mt-2">{connectionStatus}</p>
            </div>
          )}
        </div>

        {/* Local Preview (Patient) */}
        <motion.div 
          drag
          dragConstraints={{ left: -1000, right: 0, top: 0, bottom: 500 }}
          className="absolute bottom-28 right-8 w-48 h-64 md:w-64 md:h-80 bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 z-10 cursor-move"
        >
          {isVideoOff ? (
            <div className="w-full h-full flex items-center justify-center bg-slate-800">
               <span className="text-3xl font-bold text-white/20">ME</span>
            </div>
          ) : (
            <video 
              ref={localVideoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover mirror"
            />
          )}
          <div className="absolute top-2 right-2 bg-black/40 px-2 py-1 rounded-md text-[8px] text-white/60 font-bold uppercase">Self View</div>
        </motion.div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex justify-center">
          <div className="bg-black/60 backdrop-blur-2xl px-8 py-4 rounded-[2.5rem] border border-white/10 flex items-center gap-6 shadow-2xl">
            <ControlBtn icon={isMuted ? MicOff : Mic} active={!isMuted} onClick={toggleMute} color={isMuted ? "bg-rose-500" : "bg-white/10"} />
            <ControlBtn icon={isVideoOff ? VideoOff : Video} active={!isVideoOff} onClick={toggleVideo} color={isVideoOff ? "bg-rose-500" : "bg-white/10"} />
            <div className="w-px h-8 bg-white/10 mx-2" />
            <ControlBtn icon={MessageSquare} active={showChat} onClick={() => setShowChat(!showChat)} color={showChat ? "bg-[#00C896]" : "bg-white/10"} />
            <ControlBtn icon={Monitor} active={false} onClick={onShareScreen} color="bg-white/10" />
            <ControlBtn icon={Maximize} active={false} onClick={() => {}} color="bg-white/10" />
            <div className="w-px h-8 bg-white/10 mx-2" />
            <button 
              onClick={onEndCall}
              className="w-14 h-14 rounded-2xl bg-rose-500 flex items-center justify-center text-white hover:bg-rose-600 hover:rotate-90 transition-all shadow-lg"
            >
              <PhoneOff size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      <AnimatePresence>
        {showChat && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="w-96 bg-[#0A2540] border-l border-white/10 flex flex-col z-30 shadow-2xl"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
               <h3 className="text-white font-bold flex items-center gap-2">
                 <MessageSquare size={18} className="text-[#00C896]" /> Consultation Chat
               </h3>
               <button onClick={() => setShowChat(false)} className="text-white/40 hover:text-white">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
               {messages.map((msg, i) => (
                 <div key={i} className={`flex flex-col ${msg.self ? 'items-end' : 'items-start'}`}>
                   <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${msg.self ? 'bg-[#00C896] text-white rounded-tr-none' : 'bg-white/10 text-white/90 rounded-tl-none'}`}>
                     {msg.text}
                   </div>
                   <span className="text-[10px] text-white/30 mt-1">
                     {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                 </div>
               ))}
               <div ref={chatEndRef} />
            </div>

            <div className="p-6 border-t border-white/10">
               <div className="relative">
                 <input 
                   type="text" 
                   value={chatInput}
                   onChange={(e) => setChatInput(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                   placeholder="Type clinical inquiry..."
                   className="w-full bg-white/5 border border-white/10 rounded-2xl pl-4 pr-12 py-3 text-white text-sm focus:outline-none focus:border-[#00C896]"
                 />
                 <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1.2 top-1 bottom-1 px-3 bg-[#00C896] rounded-xl text-white hover:bg-[#00b084] transition-colors"
                 >
                   <Send size={16} />
                 </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .mirror { transform: scaleX(-1); }
      `}</style>
    </div>
  );
}

function ControlBtn({ icon: Icon, active, onClick, color }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all transform active:scale-95 ${color} ${active ? 'text-white' : 'text-white/40'} hover:scale-110 shadow-lg`}
    >
      <Icon size={22} className={active ? 'animate-pulse-subtle' : ''} />
    </button>
  );
}
