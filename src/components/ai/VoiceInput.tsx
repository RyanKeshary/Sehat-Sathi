"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Square, XCircle } from "lucide-react";
import { cn } from "@/utils/cn";

interface VoiceInputProps {
  language: string;
  onTranscript: (text: string, language: string) => void;
  className?: string;
}

const LANGUAGE_MAP: Record<string, string> = {
  'hi': 'hi-IN',
  'en': 'en-IN',
  'pa': 'pa-IN',
  'bn': 'bn-IN',
  'te': 'te-IN',
  'ta': 'ta-IN',
  'mr': 'mr-IN',
  'gu': 'gu-IN',
  'kn': 'kn-IN',
  'ml': 'ml-IN'
};

export default function VoiceInput({ language, onTranscript, className }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [permissionError, setPermissionError] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number[]>([0.1, 0.1, 0.1, 0.1, 0.1]);
  
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = LANGUAGE_MAP[language] || 'en-IN';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            onTranscript(event.results[i][0].transcript, language);
            setTranscript("");
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(interimTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === 'not-allowed') setPermissionError(true);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [language, onTranscript]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setupAudioAnalysis(stream);
      setIsRecording(true);
      setPermissionError(false);
      
      if (recognitionRef.current) {
        recognitionRef.current.lang = LANGUAGE_MAP[language] || 'en-IN';
        recognitionRef.current.start();
      }
    } catch (err) {
      console.error("Mic Access Error:", err);
      setPermissionError(true);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognitionRef.current?.stop();
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const setupAudioAnalysis = (stream: MediaStream) => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const update = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Map frequency data to 5 visual bars
        const newLevels = [
          dataArray[4] / 255,
          dataArray[12] / 255,
          dataArray[24] / 255,
          dataArray[12] / 255,
          dataArray[4] / 255
        ].map(v => Math.max(0.1, v * 2));
        
        setAudioLevel(newLevels);
        animationFrameRef.current = requestAnimationFrame(update);
      };
      update();
    } catch (e) {
      console.error("Audio analysis setup failed", e);
    }
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Ripple Animation */}
      <AnimatePresence>
        {isRecording && (
          <>
             {[1, 2].map((i) => (
               <motion.div
                 key={i}
                 initial={{ scale: 1, opacity: 0.8 }}
                 animate={{ scale: 2.5, opacity: 0 }}
                 exit={{ opacity: 0 }}
                 transition={{ 
                   duration: 1.5, 
                   repeat: Infinity, 
                   delay: i * 0.75,
                   ease: "easeOut" 
                 }}
                 className="absolute inset-0 bg-[#00C896] rounded-full opacity-20"
               />
             ))}
          </>
        )}
      </AnimatePresence>

      {/* Waveform Visualization */}
      <AnimatePresence>
        {isRecording && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-12 flex items-end gap-1 h-8 bg-[#0A2540]/80 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10"
          >
            {audioLevel.map((level, i) => (
              <motion.div
                key={i}
                animate={{ height: `${level * 100}%` }}
                className="w-1.5 bg-[#00C896] rounded-full min-h-[4px]"
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcription Bubble */}
      <AnimatePresence>
        {isRecording && transcript && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: -80 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="absolute z-50 bg-[#0A2540] border border-[#00C896]/30 px-4 py-2 rounded-2xl shadow-2xl text-white text-sm min-w-[150px] max-w-[250px] text-center backdrop-blur-md"
          >
            <span className="opacity-60 text-[10px] block uppercase tracking-widest mb-1 text-[#00C896] font-bold">Listening...</span>
            <p className="line-clamp-2 italic text-white/90">"{transcript}"</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#0A2540]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={isRecording ? stopRecording : startRecording}
        className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative z-10",
          isRecording 
            ? "bg-[#EF4444] shadow-[0_0_20px_rgba(239,68,68,0.4)]" 
            : "bg-white/5 hover:bg-[#00C896] text-white hover:text-[#060F1E] border border-white/10"
        )}
      >
        <AnimatePresence mode="wait">
          {isRecording ? (
            <motion.div key="stop" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Square className="w-5 h-5 fill-white text-white" />
            </motion.div>
          ) : (
            <motion.div key="mic" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Mic className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Permission Modal */}
      <AnimatePresence>
        {permissionError && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#0A2540] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl text-white"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-[#EF4444]/10 rounded-2xl flex items-center justify-center text-[#EF4444]">
                  <MicOff size={24} />
                </div>
                <button onClick={() => setPermissionError(false)} className="text-white/40 hover:text-white transition-colors">
                   <XCircle size={24} />
                </button>
              </div>
              <h3 className="text-2xl font-bold mb-3">Microphone Access Needed</h3>
              <p className="text-white/60 mb-6 leading-relaxed">
                We need your microphone to use voice features. Please allow microphone access in your browser settings.
              </p>
              <button 
                onClick={() => setPermissionError(false)}
                className="w-full bg-[#00C896] text-[#060F1E] font-bold py-3 rounded-xl hover:bg-[#00E0A8] transition-colors"
              >
                Got it
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
