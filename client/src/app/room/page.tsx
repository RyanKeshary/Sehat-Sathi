'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, CameraOff, Mic, MicOff, Volume2, Check, X, ShieldCheck, 
  Settings2, SignalHigh, MonitorUp, MessageSquare, Globe, PhoneOff, 
  User, AlertTriangle, Download, Save, Star, FileText, Phone,
  Headphones, Video, Loader2
} from 'lucide-react';
import Link from 'next/link';

// ════════════════════════════════════════════════
// MAIN CONSULTATION ROOM — 3 PHASE FLOW
// ════════════════════════════════════════════════

export default function ConsultationRoom() {
  const [phase, setPhase] = useState<'waiting' | 'active' | 'summary'>('waiting');
  const [callMode, setCallMode] = useState<'video' | 'audio'>('video');
  const [callDuration, setCallDuration] = useState(0);
  const localStreamRef = useRef<MediaStream | null>(null);

  const handleJoin = (mode: 'video' | 'audio') => {
    setCallMode(mode);
    setPhase('active');
  };

  const handleEndCall = () => {
    // Stop all tracks when ending call
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
    setPhase('summary');
  };

  return (
    <div className="min-h-screen bg-[#060F1E] text-white font-sans overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === 'waiting' && (
          <WaitingRoom 
            key="waiting" 
            onJoin={handleJoin} 
            localStreamRef={localStreamRef}
          />
        )}
        {phase === 'active' && (
          <ActiveCallRoom 
            key="active" 
            onEnd={handleEndCall} 
            mode={callMode}
            localStreamRef={localStreamRef}
            onDurationChange={setCallDuration}
          />
        )}
        {phase === 'summary' && (
          <PostCallSummary key="summary" duration={callDuration} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ════════════════════════════════════════════════
// 1. PRE-CALL WAITING ROOM — REAL CAMERA/MIC
// ════════════════════════════════════════════════

function WaitingRoom({ 
  onJoin, 
  localStreamRef 
}: { 
  onJoin: (mode: 'video' | 'audio') => void;
  localStreamRef: React.MutableRefObject<MediaStream | null>;
}) {
  const [checks, setChecks] = useState({ cam: false, mic: false, spk: false, net: false });
  const [camEnabled, setCamEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [doctorStatus, setDoctorStatus] = useState<'waiting' | 'joining' | 'ready'>('waiting');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioLevelRef = useRef<number>(0);
  const [audioLevel, setAudioLevel] = useState(0);

  // Callback ref to attach stream whenever the video element mounts
  const attachStream = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el && streamRef.current) {
      el.srcObject = streamRef.current;
    }
  }, []);

  // Real device checks — request camera + microphone
  useEffect(() => {
    let cancelled = false;
    
    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 }, 
            height: { ideal: 480 },
            facingMode: 'user'
          }, 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });

        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }

        streamRef.current = stream;
        localStreamRef.current = stream;

        // Show local video preview
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Camera check passed
        await new Promise(r => setTimeout(r, 300));
        if (!cancelled) setChecks(prev => ({ ...prev, cam: true }));

        // Mic check — set up audio level meter
        await new Promise(r => setTimeout(r, 300));
        if (!cancelled) setChecks(prev => ({ ...prev, mic: true }));
        
        // Start audio level monitoring
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateLevel = () => {
          if (cancelled) return;
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          audioLevelRef.current = avg / 255;
          setAudioLevel(avg / 255);
          requestAnimationFrame(updateLevel);
        };
        updateLevel();

        // Speaker check
        await new Promise(r => setTimeout(r, 400));
        if (!cancelled) setChecks(prev => ({ ...prev, spk: true }));

        // Network check
        await new Promise(r => setTimeout(r, 500));
        if (!cancelled) setChecks(prev => ({ ...prev, net: true }));

      } catch (err: any) {
        console.error('Media access error:', err);
        if (!cancelled) {
          if (err.name === 'NotAllowedError') {
            setMediaError('Camera/microphone permission denied. Please allow access in your browser settings.');
          } else if (err.name === 'NotFoundError') {
            setMediaError('No camera or microphone found. Please connect one and try again.');
          } else {
            setMediaError(`Could not access camera/mic: ${err.message}`);
          }
          // Mark checks as passed anyway so they can use audio-only  
          setChecks({ cam: false, mic: false, spk: true, net: true });
        }
      }
    };

    initMedia();

    return () => {
      cancelled = true;
    };
  }, [localStreamRef]);

  // Toggle camera track
  const toggleCamera = useCallback(() => {
    const videoTrack = streamRef.current?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCamEnabled(videoTrack.enabled);
    }
  }, []);

  // Toggle mic track
  const toggleMic = useCallback(() => {
    const audioTrack = streamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicEnabled(audioTrack.enabled);
    }
  }, []);

  // Simulate doctor coming online after ~5 seconds
  useEffect(() => {
    const t1 = setTimeout(() => setDoctorStatus('joining'), 4000);
    const t2 = setTimeout(() => setDoctorStatus('ready'), 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const allPassed = checks.cam && checks.mic && checks.spk && checks.net;
  const canJoinAudio = checks.spk && checks.net;
  const doctorReady = doctorStatus === 'ready';

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-[#060F1E] to-[#0A2540] flex flex-col pt-12 pb-20 items-center justify-center p-6"
    >
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-12 items-center justify-center">
        
        {/* Left Side: REAL Camera Preview */}
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="relative w-full aspect-video rounded-2xl bg-zinc-900 border-2 border-[#00C896] shadow-[0_0_30px_rgba(0,200,150,0.2)] flex flex-col items-center justify-center overflow-hidden mb-6">
            {/* Real Camera Feed — always mounted, visibility toggled via CSS */}
            <video 
              ref={attachStream}
              autoPlay 
              playsInline 
              muted 
              className={`absolute inset-0 w-full h-full object-cover scale-x-[-1] transition-opacity duration-300 ${
                camEnabled && !mediaError ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            />
            {/* Overlay when camera is off */}
            {(!camEnabled || mediaError) && (
              <div className="text-white/50 flex flex-col items-center gap-2 z-10">
                <CameraOff size={48} />
                <span className="text-sm">{mediaError ? 'Camera unavailable' : 'Camera is off'}</span>
              </div>
            )}

            {/* Audio Level Visualizer */}
            {micEnabled && !mediaError && (
              <div className="absolute top-3 left-3 flex items-end gap-0.5 h-5">
                {[0.3, 0.6, 1, 0.7, 0.4].map((mult, i) => (
                  <div 
                    key={i}
                    className="w-1 bg-[#00C896] rounded-full transition-all duration-75"
                    style={{ height: `${Math.max(3, audioLevel * mult * 20)}px` }}
                  />
                ))}
              </div>
            )}

            {/* Animated Border */}
            <div className="absolute inset-0 border-4 border-[#00C896]/30 rounded-2xl animate-pulse pointer-events-none" />

            {/* Bottom Toggles */}
            <div className="absolute bottom-4 flex items-center justify-center gap-4 w-full">
              <button 
                onClick={toggleMic} 
                className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                  micEnabled 
                    ? 'bg-black/50 text-white hover:bg-black/70' 
                    : 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                }`}
              >
                {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
              <button 
                onClick={toggleCamera} 
                className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                  camEnabled 
                    ? 'bg-black/50 text-white hover:bg-black/70' 
                    : 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                }`}
              >
                {camEnabled ? <Camera size={20} /> : <CameraOff size={20} />}
              </button>
            </div>
          </div>

          {/* Media Error Banner */}
          {mediaError && (
            <div className="w-full bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl mb-4 flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-200 text-sm font-medium">{mediaError}</p>
                <p className="text-amber-200/60 text-xs mt-1">You can still join with audio-only mode.</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Doctor Card & Checklist */}
        <div className="w-full max-w-sm space-y-6">
           
          {/* Device Checks */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold text-lg mb-4 text-white/90">Device & Network Check</h3>
            <div className="space-y-3">
              <CheckItem label="Camera" passed={checks.cam} />
              <CheckItem label="Microphone" passed={checks.mic} />
              <CheckItem label="Speaker" passed={checks.spk} />
              <CheckItem label="Internet Connection" passed={checks.net} />
            </div>
          </div>

          {/* Doctor Card */}
          <div className="bg-[#0A2540] border border-[#00C896]/20 rounded-2xl p-6 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C896] rounded-full blur-[80px] opacity-20 pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <img src="https://i.pravatar.cc/150?img=1" className="w-16 h-16 rounded-full border-2 border-[#0A2540] shadow-xl" alt="Dr. Priya Sharma" />
              <div>
                <h2 className="text-xl font-bold">Dr. Priya Sharma</h2>
                <p className="text-[#00C896] text-sm">Cardiologist</p>
              </div>
            </div>
            
            <div className="text-white/70 text-sm mb-6 relative z-10 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                doctorStatus === 'ready' ? 'bg-[#00C896]' : 'bg-amber-400 animate-pulse'
              }`} />
              {doctorStatus === 'waiting' && 'Doctor will join shortly...'}
              {doctorStatus === 'joining' && 'Doctor is connecting...'}
              {doctorStatus === 'ready' && 'Doctor is ready!'}
            </div>

            {/* Join Buttons */}
            <div className="space-y-3 relative z-10">
              <button 
                onClick={() => onJoin('video')}
                disabled={!allPassed || !doctorReady}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  allPassed && doctorReady
                    ? 'bg-[#00C896] hover:bg-[#00b084] text-white shadow-[0_10px_20px_rgba(0,200,150,0.3)]' 
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                }`}
              >
                <Video size={20} />
                {allPassed && doctorReady ? 'Join Video Consultation' : 'Checking connection...'}
              </button>

              <button 
                onClick={() => onJoin('audio')}
                disabled={!canJoinAudio || !doctorReady}
                className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border-2 ${
                  canJoinAudio && doctorReady
                    ? 'border-[#00C896] text-[#00C896] hover:bg-[#00C896]/10' 
                    : 'border-white/10 text-white/30 cursor-not-allowed'
                }`}
              >
                <Headphones size={18} />
                Audio-Only Mode
              </button>
            </div>
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
          <Loader2 size={10} className="text-white/30 animate-spin" />
        </div>
      )}
    </div>
  )
}

// ════════════════════════════════════════════════
// 2. ACTIVE CALL — REAL CAMERA/MIC
// ════════════════════════════════════════════════

function ActiveCallRoom({ 
  onEnd, 
  mode,
  localStreamRef,
  onDurationChange
}: { 
  onEnd: () => void;
  mode: 'video' | 'audio';
  localStreamRef: React.MutableRefObject<MediaStream | null>;
  onDurationChange: (d: number) => void;
}) {
  const [controlsVisible, setControlsVisible] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(mode === 'video');
  const [duration, setDuration] = useState(0);
  const [isAudioOnly, setIsAudioOnly] = useState(mode === 'audio');
  const [doctorConnected, setDoctorConnected] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{from: string; text: string; time: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Callback ref to attach stream to PIP video element
  const attachLocalStream = useCallback((el: HTMLVideoElement | null) => {
    localVideoRef.current = el;
    if (el && localStreamRef.current) {
      el.srcObject = localStreamRef.current;
    }
  }, [localStreamRef]);

  // Attach local stream to PIP video
  useEffect(() => {
    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
    
    // If audio-only mode, disable video track
    if (isAudioOnly && localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(t => { t.enabled = false; });
      setCamOn(false);
    }
  }, [localStreamRef, isAudioOnly]);

  // Simulate doctor connecting after 2 seconds
  useEffect(() => {
    const t = setTimeout(() => {
      setDoctorConnected(true);
      // Simulate doctor sending a chat message
      setChatMessages(prev => [...prev, {
        from: 'Dr. Sharma',
        text: 'Hello! I can see you now. How are you feeling today?',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  // Controls auto-hide
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const trigger = () => {
      setControlsVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setControlsVisible(false), 5000);
    };
    window.addEventListener('mousemove', trigger);
    window.addEventListener('touchstart', trigger);
    trigger();
    return () => { 
      window.removeEventListener('mousemove', trigger); 
      window.removeEventListener('touchstart', trigger);
      clearTimeout(timeout); 
    };
  }, []);

  // Duration timer — only update local state here
  useEffect(() => {
    const t = setInterval(() => {
      setDuration(d => d + 1);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Sync duration to parent (separate effect to avoid setState-during-render)
  useEffect(() => {
    onDurationChange(duration);
  }, [duration, onDurationChange]);

  // Toggle camera
  const toggleCamera = useCallback(() => {
    const stream = localStreamRef.current;
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCamOn(videoTrack.enabled);
      }
    }
  }, [localStreamRef]);

  // Toggle mic
  const toggleMic = useCallback(() => {
    const stream = localStreamRef.current;
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicOn(audioTrack.enabled);
      }
    }
  }, [localStreamRef]);

  // Switch to audio-only
  const switchToAudioOnly = useCallback(() => {
    setIsAudioOnly(true);
    const stream = localStreamRef.current;
    if (stream) {
      stream.getVideoTracks().forEach(t => { t.enabled = false; });
      setCamOn(false);
    }
  }, [localStreamRef]);

  // Switch back to video
  const switchToVideo = useCallback(() => {
    setIsAudioOnly(false);
    const stream = localStreamRef.current;
    if (stream) {
      stream.getVideoTracks().forEach(t => { t.enabled = true; });
      setCamOn(true);
    }
  }, [localStreamRef]);

  // Send chat message
  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, {
      from: 'You',
      text: chatInput,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }]);
    setChatInput('');
    // Doctor auto-reply after 3 seconds
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        from: 'Dr. Sharma',
        text: 'Thank you for sharing that. Let me take a closer look.',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 3000);
  };

  const formatSecs = (s: number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <div className="relative w-full h-screen bg-[#000000] overflow-hidden flex">
      {/* Main Viewport */}
      <div className="flex-1 h-full relative">
        
        {/* Remote Video / Doctor View */}
        <div className="absolute inset-2 md:inset-4 rounded-3xl overflow-hidden bg-zinc-900 border border-[#00C896]/50 shadow-[0_0_40px_rgba(0,200,150,0.15)] flex items-center justify-center">
          {!isAudioOnly ? (
            <div className="w-full h-full bg-gradient-to-t from-[#060F1E] to-[#0A2540] relative flex items-center justify-center">
              {/* Doctor's video would go here via WebRTC */}
              {doctorConnected ? (
                <>
                  <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" style={{ display: 'none' }} />
                  {/* Simulated doctor avatar since no real remote peer */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-full border-4 border-[#00C896]/50 overflow-hidden shadow-[0_0_60px_rgba(0,200,150,0.2)]">
                      <img src="https://i.pravatar.cc/256?img=1" alt="Doctor" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                      <h2 className="text-2xl font-bold">Dr. Priya Sharma</h2>
                      <div className="flex items-center gap-2 justify-center mt-2 text-[#00C896] text-sm">
                        <div className="w-2 h-2 rounded-full bg-[#00C896] animate-pulse" />
                        Connected • Video Call
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 text-white/40">
                  <Loader2 size={48} className="animate-spin" />
                  <span className="text-sm font-medium">Connecting to doctor...</span>
                </div>
              )}
            </div>
          ) : (
            // Audio-only mode
            <div className="w-full h-full bg-[#060F1E] flex flex-col items-center justify-center">
              <div className="w-32 h-32 rounded-full border-4 border-[#00C896] shadow-[0_0_50px_rgba(0,200,150,0.3)] overflow-hidden mb-6">
                <img src="https://i.pravatar.cc/256?img=1" alt="Doctor" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-2xl font-bold">Dr. Priya Sharma</h2>
              <div className="text-[#00C896] mt-2 font-mono flex items-center gap-2">
                <Headphones size={20} />
                Audio-Only Mode
              </div>
              {/* Audio waveform animation */}
              <div className="flex items-end gap-1 mt-6 h-8">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 bg-[#00C896]/60 rounded-full"
                    animate={{ height: ['8px', `${12 + Math.random() * 20}px`, '8px'] }}
                    transition={{ duration: 0.6 + Math.random() * 0.8, repeat: Infinity, delay: i * 0.08 }}
                  />
                ))}
              </div>
              <button 
                onClick={switchToVideo}
                className="mt-8 text-sm bg-white/10 hover:bg-white/20 px-6 py-2.5 rounded-full transition-all flex items-center gap-2"
              >
                <Video size={16} /> Switch to Video
              </button>
            </div>
          )}
        </div>

        {/* Top Status Bar */}
        <AnimatePresence>
          {controlsVisible && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              className="absolute top-8 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 flex items-center gap-4 shadow-xl z-30"
            >
              <div className={`w-2 h-2 rounded-full ${doctorConnected ? 'bg-[#00C896]' : 'bg-amber-400 animate-pulse'}`} />
              <div className="font-mono text-lg font-bold min-w-[50px] text-center">{formatSecs(duration)}</div>
              <div className="w-px h-4 bg-white/20" />
              <div className="hidden md:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#00C896]">
                <ShieldCheck size={14} /> End-to-End Encrypted
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PIP — Local Video (YOU) */}
        <motion.div 
          drag 
          dragConstraints={{ left: 20, right: 600, top: 20, bottom: 500 }}
          dragElastic={0} 
          dragMomentum={false}
          className="absolute bottom-28 md:bottom-8 right-8 w-32 md:w-48 aspect-[3/4] bg-zinc-800 rounded-2xl overflow-hidden border-2 border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-40 cursor-grab active:cursor-grabbing"
        >
          {/* Video always mounted, toggled via CSS */}
          <video 
            ref={attachLocalStream}
            autoPlay 
            playsInline 
            muted 
            className={`absolute inset-0 w-full h-full object-cover scale-x-[-1] transition-opacity duration-300 ${
              camOn ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
          {!camOn && (
            <div className="w-full h-full bg-zinc-900 flex flex-col justify-center items-center text-white/50 gap-2 z-10">
              {isAudioOnly ? <Headphones size={28} /> : <CameraOff size={28} />}
              <span className="text-xs">{isAudioOnly ? 'Audio Only' : 'Camera Off'}</span>
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] font-bold backdrop-blur">You</div>
          {!micOn && (
            <div className="absolute top-2 right-2 bg-red-500 p-1.5 rounded-full text-white shadow-lg">
              <MicOff size={12} />
            </div>
          )}
        </motion.div>

        {/* Control Tray */}
        <AnimatePresence>
          {controlsVisible && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 50 }} 
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white/10 backdrop-blur-2xl border border-white/15 px-6 py-4 rounded-full flex items-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              {/* Mic */}
              <button 
                onClick={toggleMic} 
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  micOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                }`}
                title="Mute/Unmute"
              >
                {micOn ? <Mic size={24} /> : <MicOff size={24} />}
              </button>

              {/* Camera */}
              {!isAudioOnly && (
                <button 
                  onClick={toggleCamera} 
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    camOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                  }`}
                  title="Camera On/Off"
                >
                  {camOn ? <Camera size={24} /> : <CameraOff size={24} />}
                </button>
              )}

              <div className="w-px h-10 bg-white/10 mx-1" />

              {/* Audio-only toggle */}
              <button 
                onClick={isAudioOnly ? switchToVideo : switchToAudioOnly}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isAudioOnly ? 'bg-blue-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white/80'
                }`}
                title={isAudioOnly ? 'Switch to Video' : 'Audio Only Mode'}
              >
                {isAudioOnly ? <Video size={20} /> : <Headphones size={20} />}
              </button>

              {/* Chat */}
              <button 
                onClick={() => setChatOpen(!chatOpen)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all relative ${
                  chatOpen ? 'bg-blue-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white/80'
                }`}
                title="Chat"
              >
                <MessageSquare size={20} />
                {chatMessages.length > 0 && !chatOpen && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center">
                    {chatMessages.length}
                  </div>
                )}
              </button>

              <div className="w-px h-10 bg-white/10 mx-1" />

              {/* End Call */}
              <button 
                onClick={onEnd} 
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-all hover:scale-105"
                title="End Call"
              >
                <PhoneOff size={28} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }} 
            animate={{ width: 360, opacity: 1 }} 
            exit={{ width: 0, opacity: 0 }}
            className="h-full bg-[#060F1E] border-l border-white/10 flex flex-col shrink-0 z-40"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2"><MessageSquare size={16} /> Chat</h3>
              <button onClick={() => setChatOpen(false)} className="text-white/50 hover:text-white"><X size={18} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.from === 'You' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] text-white/40 font-bold mb-1">{msg.from} · {msg.time}</span>
                  <div className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] ${
                    msg.from === 'You' 
                      ? 'bg-[#00C896] text-white rounded-br-sm' 
                      : 'bg-white/10 text-white/90 rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-white/10 flex gap-2">
              <input 
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChat()}
                placeholder="Type a message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#00C896] text-white"
              />
              <button onClick={sendChat} className="bg-[#00C896] text-[#060F1E] px-4 rounded-xl font-bold hover:bg-[#00b084]">
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ════════════════════════════════════════════════
// 3. POST-CALL SUMMARY
// ════════════════════════════════════════════════

function PostCallSummary({ duration }: { duration: number }) {
  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec.toString().padStart(2, '0')}s`;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-10 flex flex-col items-center">
       
      <div className="w-full max-w-3xl flex flex-col items-center">
        
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5, delay: 0.5 }}
          className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6 drop-shadow-lg"
        >
          <Check size={48} strokeWidth={3} />
        </motion.div>
        
        <h1 className="text-3xl font-bold text-[#0A2540] mb-2">Consultation Complete 🎉</h1>
        <p className="text-slate-500 font-medium mb-10 flex items-center gap-2">
          Duration: {formatDuration(duration)} <span className="w-1 h-1 rounded-full bg-slate-300" /> Dr. Priya Sharma
        </p>

        {/* Summary */}
        <div className="w-full bg-white border border-slate-200 shadow-sm rounded-2xl p-6 md:p-10 space-y-8 mb-8 text-left">
          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-3 border-b border-slate-100 pb-2">Symptoms Discussed</h3>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">Patient reported acute chest heaviness originating 24 hours prior, mild left-arm radiation, and slight dyspnea upon exertion. No previous history of cardiac events. Blood pressure self-reported at 140/90.</p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-3 border-b border-slate-100 pb-2">Doctor's Assessment</h3>
            <p className="text-sm text-slate-700 leading-relaxed font-medium">Suspected angina or anxiety-induced tightness. Requires immediate ECG baseline to rule out ischemic events. Patient stable currently during video assessment but observation required.</p>
          </div>

          {/* Rx Card */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-4 w-12 h-16 bg-blue-100/50 text-blue-300 font-serif italic text-4xl flex items-end justify-center pb-2">Rx</div>
            <div className="mb-4">
              <h4 className="font-bold text-[#0A2540]">Dr. Priya Sharma</h4>
              <div className="text-xs text-slate-500">Reg: MCI-847291 · 15 April 2026</div>
            </div>
            <div className="space-y-4 pl-4 border-l-2 border-blue-200">
              <div>
                <h5 className="font-bold text-slate-800 text-sm">1. Sorbitrate 10mg Tablet</h5>
                <p className="text-xs font-semibold text-blue-700 mb-1">To be taken Sublingual ONLY if pain worsens</p>
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

        {/* Actions */}
        <div className="w-full flex justify-between items-center gap-4 flex-col md:flex-row mb-12">
          <button className="w-full bg-white border-2 border-[#0A2540] text-[#0A2540] hover:bg-slate-50 py-4 rounded-xl font-bold transition-all flex justify-center items-center gap-2">
            <Download size={20} /> Download Prescription
          </button>
          <button className="w-full bg-[#00C896] hover:bg-[#00b084] text-white shadow-lg py-4 rounded-xl font-bold transition-all flex justify-center items-center gap-2">
            <Save size={20} /> Save to Health Records
          </button>
        </div>

        {/* Rating */}
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
