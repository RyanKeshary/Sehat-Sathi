'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, CameraOff, Mic, MicOff, Volume2, Check, X, ShieldCheck, 
  Settings2, SignalHigh, MonitorUp, MessageSquare, Globe, PhoneOff, 
  User, AlertTriangle, Download, Save, Star, FileText, Plus
} from 'lucide-react';
import Link from 'next/link';
import ConnectionQualityIndicator from '@/components/video/ConnectionQualityIndicator';

export default function ConsultationRoom() {
  const [phase, setPhase] = useState<'waiting' | 'active' | 'summary'>('waiting');
  
  // Handlers
  const handleJoin = () => setPhase('active');
  const handleEndCall = () => setPhase('summary');

  return (
    <div className="min-h-screen bg-[#060F1E] text-white font-sans overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === 'waiting' && <WaitingRoom key="waiting" onJoin={handleJoin} />}
        {phase === 'active' && <ActiveCallRoom key="active" onEnd={handleEndCall} />}
        {phase === 'summary' && <PostCallSummary key="summary" />}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// 1. PRE-CALL WAITING ROOM
// ============================================

function WaitingRoom({ onJoin }: { onJoin: () => void }) {
  const [checks, setChecks] = useState({ cam: false, mic: false, spk: false, net: false });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [camEnabled, setCamEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);

  // Simulate device checks completion
  useEffect(() => {
    const sequence = async () => {
      await new Promise(r => setTimeout(r, 500));
      setChecks(prev => ({ ...prev, cam: true }));
      await new Promise(r => setTimeout(r, 500));
      setChecks(prev => ({ ...prev, mic: true }));
      await new Promise(r => setTimeout(r, 500));
      setChecks(prev => ({ ...prev, spk: true }));
      await new Promise(r => setTimeout(r, 800));
      setChecks(prev => ({ ...prev, net: true }));
    };
    sequence();
  }, []);

  const allPassed = checks.cam && checks.mic && checks.spk && checks.net;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-[#060F1E] to-[#0A2540] flex flex-col pt-12 pb-20 items-center justify-center p-6"
    >
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-12 items-center justify-center">
        
        {/* Left Side: Self Preview & Toggles */}
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="relative w-full aspect-video rounded-2xl bg-zinc-900 border-2 border-[#00C896] shadow-[0_0_30px_rgba(0,200,150,0.2)] flex flex-col items-center justify-center overflow-hidden mb-6 group">
             {camEnabled ? (
                <User size={64} className="text-white/20" />
             ) : (
                <div className="text-white/50 flex flex-col items-center"><CameraOff size={48} className="mb-2" /> <span>Camera is off</span></div>
             )}
             
             {/* Animated Ring Border logic simplified via CSS shadow */}
             <div className="absolute inset-0 border-4 border-[#00C896]/30 rounded-2xl animate-pulse pointer-events-none"></div>

             {/* Bottom Overlay Toggles */}
             <div className="absolute bottom-4 flex items-center justify-center gap-4 w-full">
                <button onClick={() => setMicEnabled(!micEnabled)} className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${micEnabled ? 'bg-black/50 text-white hover:bg-black/70' : 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}>
                   {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
                </button>
                <button onClick={() => setCamEnabled(!camEnabled)} className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${camEnabled ? 'bg-black/50 text-white hover:bg-black/70' : 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}>
                   {camEnabled ? <Camera size={20} /> : <CameraOff size={20} />}
                </button>
                <button className="w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md bg-black/50 text-white hover:bg-black/70 transition-colors">
                   <Volume2 size={20} />
                </button>
             </div>
          </div>
          
          <div className="w-full bg-white/5 border border-white/10 p-3 rounded-lg flex items-center justify-between cursor-pointer" onClick={() => setSettingsOpen(!settingsOpen)}>
             <div className="flex items-center gap-2 text-sm text-white/70">
                <Settings2 size={16} /> Connection Settings
             </div>
             {settingsOpen && (
               <span className="text-xs text-[#00C896] font-mono">Using VP9 · Adaptive Bitrate · 480p</span>
             )}
          </div>
        </div>

        {/* Right Side: Doctor Card & Checklist */}
        <div className="w-full max-w-sm space-y-8">
           
           {/* Checklist */}
           <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4 text-white/90">Device & Network Check</h3>
              <div className="space-y-3">
                 <CheckItem label="Camera" passed={checks.cam} />
                 <CheckItem label="Microphone" passed={checks.mic} />
                 <CheckItem label="Speaker" passed={checks.spk} />
                 <CheckItem label="Internet: Good (12 Mbps)" passed={checks.net} />
              </div>
           </div>

           {/* Doctor Card */}
           <div className="bg-[#0A2540] border border-[#00C896]/20 rounded-2xl p-6 flex flex-col relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C896] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
             
             <div className="flex items-center gap-4 mb-4 relative z-10">
                <img src="https://i.pravatar.cc/150?img=1" className="w-16 h-16 rounded-full border-2 border-[#0A2540] shadow-xl" />
                <div>
                   <h2 className="text-xl font-bold">Dr. Priya Sharma</h2>
                   <p className="text-[#00C896] text-sm">Cardiologist</p>
                </div>
             </div>
            <div className="text-white/70 text-sm mb-6 relative z-10 flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
               Doctor will join in approx. 3 minutes...
            </div>

             <button 
                onClick={onJoin}
                disabled={!allPassed}
                className={`w-full py-4 rounded-xl font-bold transition-all relative z-10 flex items-center justify-center gap-2 ${
                  allPassed 
                    ? 'bg-[#00C896] hover:bg-[#00b084] text-white shadow-[0_10px_20px_rgba(0,200,150,0.3)]' 
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                }`}
             >
                {allPassed ? 'Join Consultation' : 'Checking connection...'}
             </button>
           </div>

        </div>
      </div>
    </motion.div>
  );
}

function CheckItem({ label, passed }: { label: string, passed: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-white/80">{label}</span>
      {passed ? (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 rounded-full bg-[#00C896]/20 text-[#00C896] flex items-center justify-center">
           <Check size={12} strokeWidth={3} />
        </motion.div>
      ) : (
        <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
           <div className="w-1 h-1 rounded-full bg-white/20"></div>
        </div>
      )}
    </div>
  )
}

// ============================================
// 2. ACTIVE CALL INTERFACE
// ============================================

function ActiveCallRoom({ onEnd }: { onEnd: () => void }) {
  const [controlsVisible, setControlsVisible] = useState(true);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [duration, setDuration] = useState(0);
  const [isAudioOnly, setIsAudioOnly] = useState(false);
  
  // Controls auto hide
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const trigger = () => {
      setControlsVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setControlsVisible(false), 5000);
    };
    window.addEventListener('mousemove', trigger);
    trigger();
    return () => { window.removeEventListener('mousemove', trigger); clearTimeout(timeout); };
  }, []);

  // Timer
  useEffect(() => {
    const t = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Simulate network drop
  useEffect(() => {
    const t = setTimeout(() => setIsAudioOnly(true), 20000);
    return () => clearTimeout(t);
  }, []);

  const formatSecs = (s: number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <div className="relative w-full h-screen bg-[#000000] overflow-hidden flex">
       {/* Main Sub-Viewport */}
       <div className="flex-1 h-full relative cursor-default">
          
          {/* Remote Video Container (Doctor) */}
          <div className="absolute inset-2 md:inset-4 rounded-3xl overflow-hidden bg-zinc-900 border border-[#00C896]/50 shadow-[0_0_40px_rgba(0,200,150,0.15)] transition-all flex items-center justify-center">
             {!isAudioOnly ? (
               <div className="w-full h-full bg-gradient-to-t from-[#060F1E] to-[#0A2540] relative flex items-center justify-center">
                  <User size={120} className="text-white/5" />
                  
                  {/* AI Translation Overlay */}
                  <AnimatePresence>
                    {aiPanelOpen && (
                      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="absolute bottom-24 left-1/2 -translate-x-1/2 max-w-2xl w-11/12 bg-black/70 backdrop-blur-md rounded-xl p-4 text-center border border-[#00C896]/20">
                         <span className="text-[#00C896] text-xs font-bold uppercase tracking-widest mb-1 block">Live Translation (Hindi)</span>
                         <p className="text-lg md:text-xl font-medium text-white shadow-sm leading-snug">क्या आप अभी भी सीने में दर्द महसूस कर रहे हैं?</p>
                         <p className="text-xs text-white/50 italic mt-1">Are you still experiencing the chest pain?</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
             ) : (
               <div className="w-full h-full bg-[#060F1E] flex flex-col items-center justify-center">
                  <div className="w-32 h-32 rounded-full border-4 border-[#00C896] shadow-[0_0_50px_rgba(0,200,150,0.3)] bg-gradient-to-tr from-[#00C896]/20 to-transparent flex items-center justify-center mb-6">
                     <User size={64} className="text-[#00C896]" />
                  </div>
                  <h2 className="text-2xl font-bold">Dr. Priya Sharma</h2>
                  <div className="text-[#00C896] mt-2 font-mono flex flex-col items-center gap-2">
                    <SignalHigh size={20} />
                    Audio-Only Mode for better quality
                  </div>
               </div>
             )}
          </div>

          {/* Top Status Bar */}
          <AnimatePresence>
            {controlsVisible && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 flex items-center gap-4 shadow-xl z-30 pointer-events-auto">
                 <div className="font-mono text-lg font-bold min-w-[50px] text-center">{formatSecs(duration)}</div>
                 <div className="w-px h-4 bg-white/20"></div>
                 <ConnectionQualityIndicator className="scale-75" />
                 <div className="hidden md:flex items-center gap-3 text-[10px] font-mono text-white/50 bg-white/5 px-2 py-1 rounded-md">
                    <span>↓ {isAudioOnly ? '0.1' : '1.2'} Mbps</span>
                    <span>↑ {isAudioOnly ? '0.05' : '0.8'} Mbps</span>
                 </div>
                 <div className="w-px h-4 bg-white/20"></div>
                 <div className="hidden md:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#00C896]">
                    <ShieldCheck size={14} /> 🔒 End-to-End Encrypted
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Weak Connection Overrides */}
          <AnimatePresence>
             {isAudioOnly && (
               <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-24 left-1/2 -translate-x-1/2 z-30 bg-amber-500/20 backdrop-blur-md border border-amber-500/50 px-5 py-3 rounded-full flex flex-col md:flex-row items-center gap-4 text-amber-500 shadow-2xl">
                  <div className="flex items-center gap-2 text-sm font-bold">
                     <AlertTriangle size={16} /> Low bandwidth: Audio-only mode activated
                  </div>
                  <button onClick={() => setIsAudioOnly(false)} className="text-xs bg-amber-500 text-black px-4 py-1.5 rounded-full font-bold hover:bg-amber-400">
                    Keep Video
                  </button>
               </motion.div>
             )}
          </AnimatePresence>

          {/* Local PIP Video */}
          <motion.div 
            drag dragConstraints={{ left: 20, right: typeof window !== 'undefined' ? window.innerWidth - 200 : 800, top: 20, bottom: typeof window !== 'undefined' ? window.innerHeight - 200 : 800 }}
            dragElastic={0} dragMomentum={false}
            className="absolute bottom-28 md:bottom-8 right-8 w-32 md:w-48 aspect-[3/4] bg-zinc-800 rounded-2xl overflow-hidden border-2 border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-40 cursor-grab active:cursor-grabbing group/pip"
          >
             {camOn ? (
               <div className="w-full h-full bg-zinc-800 flex justify-center items-center">
                  <User size={48} className="text-white/20" />
               </div>
             ) : (
               <div className="w-full h-full bg-zinc-900 flex justify-center items-center text-white/50">
                  <CameraOff size={32} />
               </div>
             )}
             <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-bold backdrop-blur">You</div>
             {!micOn && (
               <div className="absolute top-2 right-2 bg-red-500 p-1.5 rounded-full text-white shadow-lg">
                  <MicOff size={14} />
               </div>
             )}
          </motion.div>

          {/* Control Tray Floating Pill */}
          <AnimatePresence>
            {controlsVisible && (
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-2xl border border-white/15 px-6 py-4 rounded-full flex items-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                 <button onClick={() => setMicOn(!micOn)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${micOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'}`} title="Mute/Unmute (M)">
                    {micOn ? <Mic size={24} /> : <MicOff size={24} />}
                 </button>
                 <button onClick={() => setCamOn(!camOn)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${camOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'}`} title="Camera On/Off (V)">
                    {camOn ? <Camera size={24} /> : <CameraOff size={24} />}
                 </button>
                 
                 <div className="w-px h-10 bg-white/10 mx-2 hidden md:block"></div>
                 
                 <button className="w-12 h-12 rounded-full hidden md:flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all text-white/80" title="Share Screen">
                    <MonitorUp size={20} />
                 </button>
                 <button className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-all text-white/80 relative" title="Chat">
                    <MessageSquare size={20} />
                 </button>
                 <button onClick={() => setAiPanelOpen(!aiPanelOpen)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${aiPanelOpen ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)]' : 'bg-white/10 hover:bg-white/20 text-white/80'}`} title="AI Assistant">
                    <Globe size={20} />
                 </button>

                 <div className="w-px h-10 bg-white/10 mx-2"></div>

                 <button onClick={onEnd} className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-all transform hover:scale-105" title="End Call">
                    <PhoneOff size={28} />
                 </button>
              </motion.div>
            )}
          </AnimatePresence>

       </div>

       {/* AI Features Right Panel */}
       <AnimatePresence>
          {aiPanelOpen && (
             <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 400, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="h-full bg-[#060F1E] border-l border-white/10 flex flex-col shrink-0 relative z-40 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] hidden lg:flex">
                <div className="p-5 border-b border-white/10 flex items-center justify-between">
                   <h3 className="font-bold flex items-center gap-2"><Globe size={18} className="text-blue-400" /> AI Assistant</h3>
                   <button onClick={() => setAiPanelOpen(false)} className="text-white/50 hover:text-white"><X size={18} /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-5 space-y-8 pb-32">
                   
                   {/* Smart Notes */}
                   <section>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#00C896] mb-4 flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-[#00C896] animate-pulse"></div> Live Smart Notes
                      </h4>
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
                         <div>
                            <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">Symptoms Identified</p>
                            <p className="text-sm">Severe chest pain, shortness of breath, radiating pain to left arm. Duration: 2 hours.</p>
                         </div>
                         <div>
                            <p className="text-[10px] text-blue-400 uppercase font-bold tracking-wider mb-1 border-t border-white/10 pt-3">Medication Mentioned</p>
                            <div className="flex gap-2 items-center bg-[#060F1E] border border-white/5 p-2 rounded-lg mt-2">
                               <div className="w-8 h-8 rounded shrink-0 bg-blue-500/20 text-blue-400 flex justify-center items-center text-lg">💊</div>
                               <div className="text-xs">
                                  <div className="font-bold text-white">Sorbiline 10mg</div>
                                  <div className="text-white/50">Sublingual immediately</div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </section>

                   {/* Live Transcript Pipeline */}
                   <section>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-4">Live Bhashini Transcript</h4>
                      <div className="space-y-4 font-mono text-sm">
                         <div className="flex flex-col gap-1 items-end">
                            <span className="text-[10px] text-white/40 font-bold uppercase">You (Hindi)</span>
                            <div className="bg-blue-600/20 border border-blue-500/30 text-white p-3 rounded-2xl rounded-tr-sm self-end max-w-[85%] text-xs">
                               मुझे कल से सीने में बहुत भारीपन महसूस हो रहा है। (I have been feeling a lot of heaviness in my chest since yesterday.)
                            </div>
                         </div>
                         <div className="flex flex-col gap-1 items-start">
                            <span className="text-[10px] text-[#00C896] font-bold uppercase">Dr. Sharma</span>
                            <div className="bg-white/5 border border-white/10 text-white/80 p-3 rounded-2xl rounded-tl-sm max-w-[85%] text-xs">
                               Are you also experiencing shortness of breath or sweating?
                            </div>
                         </div>
                      </div>
                   </section>
                </div>

                <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-[#060F1E] via-[#060F1E]/90 to-transparent pt-10 text-center">
                   <p className="text-[10px] text-white/30 italic">AI features are for assistance only. Doctor has final authority.</p>
                </div>
             </motion.div>
          )}
       </AnimatePresence>

    </div>
  );
}

// ============================================
// 3. POST-CALL SUMMARY
// ============================================

function PostCallSummary() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-10 flex flex-col items-center">
       
       <div className="w-full max-w-3xl flex flex-col items-center">
         
         <motion.div 
           initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5, delay: 0.5 }}
           className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 drop-shadow-lg"
         >
            <Check size={48} strokeWidth={3} />
         </motion.div>
         
         <h1 className="text-3xl font-bold text-[#0A2540] mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Consultation Complete 🎉</h1>
         <p className="text-slate-500 font-medium mb-10 flex items-center gap-2">Duration: 14m 32s <span className="w-1 h-1 rounded-full bg-slate-300"></span> Dr. Priya Sharma</p>

         {/* Summary Document Engine */}
         <div className="w-full bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-10 space-y-8 mb-8 text-left">
            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-3 border-b border-slate-100 pb-2">Symptoms Discussed</h3>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">Patient reported acute chest heaviness originating 24 hours prior, mild left-arm radiation, and slight dyspnea upon exertion. No previous history of cardiac events. Blood pressure self-reported at 140/90.</p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-3 border-b border-slate-100 pb-2">Doctor's Assessment</h3>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">Suspected angina or anxiety-induced tightness. Requires immediate ECG baseline to rule out ischemic events. Patient stable currently during video assessment but observation required.</p>
            </div>

            {/* Simulated Rx Card */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 relative overflow-hidden">
               <div className="absolute top-0 right-4 w-12 h-16 bg-blue-100/50 text-blue-300 font-serif italic text-4xl flex items-end justify-center pb-2">Rx</div>
               <div className="mb-4">
                 <h4 className="font-bold text-[#0A2540]">Dr. Priya Sharma</h4>
                 <div className="text-xs text-slate-500">Reg: MCI-847291 · 15 April 2026</div>
               </div>
               <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">1. Sorbitrate 10mg Tablet</h5>
                    <p className="text-xs font-semibold text-blue-700 mb-1">To be taken Sublingual (Under tongue) ONLY if pain worsens</p>
                    <p className="text-[10px] text-slate-500">Qty: 5 Tablets</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">2. ECG (Electrocardiogram)</h5>
                    <p className="text-xs font-semibold text-blue-700 mb-1">Diagnostic Test ASAP</p>
                    <p className="text-[10px] text-slate-500">Refer locally</p>
                  </div>
               </div>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-3 border-b border-slate-100 pb-2">Follow-up Instructions</h3>
              <ul className="text-sm text-slate-700 font-medium list-disc pl-5 space-y-1">
                 <li>Visit the nearest Primary Health Center for an ECG today.</li>
                 <li>Upload the ECG report to Sehat Sathi securely.</li>
                 <li>Schedule a follow-up text consult in 2 days.</li>
              </ul>
            </div>
         </div>

         {/* Action Engine */}
         <div className="w-full flex justify-between items-center gap-4 flex-col md:flex-row mb-12">
            <button className="w-full bg-white border-2 border-[#0A2540] text-[#0A2540] hover:bg-slate-50 py-4 rounded-xl font-bold transition-all flex justify-center items-center gap-2">
               <Download size={20} /> Download Prescription
            </button>
            <button className="w-full bg-[#00C896] hover:bg-[#00b084] text-white shadow-lg py-4 rounded-xl font-bold transition-all flex justify-center items-center gap-2">
               <Save size={20} /> Save to Health Records
            </button>
         </div>

         {/* Rating Engine */}
         <div className="w-full max-w-sm text-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Rate Your Experience</p>
            <div className="flex justify-center gap-2 mb-6">
               {[1, 2, 3, 4, 5].map(star => (
                 <motion.button key={star} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-amber-400 p-1">
                   <Star size={32} className={star <= 4 ? "fill-amber-400" : "text-slate-300"} />
                 </motion.button>
               ))}
            </div>
            <textarea placeholder="Tell us how we can improve... (Optional)" className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-[#00C896] resize-none pb-8" rows={2} />
            <div className="flex justify-between items-center mt-3">
               <Link href="/dashboard" className="text-sm font-bold text-slate-500 hover:text-slate-800">Return to Dashboard</Link>
               <button className="bg-slate-200 hover:bg-slate-300 text-slate-600 px-6 py-2 rounded-lg text-sm font-bold transition-colors">Submit</button>
            </div>
         </div>

       </div>
    </motion.div>
  );
}
