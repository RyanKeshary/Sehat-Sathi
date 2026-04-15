"use client";

import React, { useEffect, useRef } from "react";
import { 
  Camera, 
  Mic, 
  Megaphone, 
  Video, 
  CheckCircle2, 
  ShieldAlert 
} from "lucide-react";
import { useMediaStream } from "@/hooks/use-media-stream";

interface WaitingRoomProps {
  onJoin: (stream: MediaStream) => void;
  doctorInfo: {
    name: string;
    specialization: string;
    image: string;
  };
}

export function WaitingRoom({ onJoin, doctorInfo }: WaitingRoomProps) {
  const { stream, error, status, devices, getMedia } = useMediaStream();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    getMedia();
  }, [getMedia]);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleDeviceChange = (kind: 'video' | 'audioIn' | 'audioOut', id: string) => {
    if (kind === 'audioOut') {
      const videos = document.querySelectorAll('video, audio') as NodeListOf<HTMLMediaElement & { setSinkId?: (id: string) => Promise<void> }>;
      videos.forEach(v => v.setSinkId?.(id));
      return;
    }
    
    const videoId = kind === 'video' ? id : (devices.video[0]?.deviceId);
    const audioId = kind === 'audioIn' ? id : (devices.audioIn[0]?.deviceId);
    getMedia(videoId, audioId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#060F1E] to-[#0A2540] flex items-center justify-center p-6 overflow-y-auto">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Self Preview & Device Settings */}
        <div className="space-y-8">
          <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl">
            {stream ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover mirror"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40">
                {error === 'PERMISSIONS_DENIED' ? (
                  <ShieldAlert className="w-16 h-16 mb-4 text-rose-500" />
                ) : (
                  <Video className="w-16 h-16 mb-4 animate-pulse" />
                )}
                <p className="font-medium text-center px-6">
                    {error === 'PERMISSIONS_DENIED' 
                        ? "Camera & Microphone access is required. Please enable permissions in your browser settings."
                        : error || "Preparing your video preview..."}
                </p>
              </div>
            )}
            
            <div className="absolute top-4 left-4">
              <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-bold text-white flex items-center gap-2">
                <span className={status.includes('✓') ? 'text-emerald-500' : 'text-amber-500'}>●</span>
                {status}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-white/60 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Camera size={14} /> Camera
              </label>
              <select 
                onChange={(e) => handleDeviceChange('video', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00C896]"
              >
                {devices.video.map(d => <option key={d.deviceId} value={d.deviceId} className="bg-[#0A2540]">{d.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-white/60 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Mic size={14} /> Mic
              </label>
              <select 
                onChange={(e) => handleDeviceChange('audioIn', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00C896]"
              >
                {devices.audioIn.map(d => <option key={d.deviceId} value={d.deviceId} className="bg-[#0A2540]">{d.label}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-white/60 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Megaphone size={14} /> Speaker
              </label>
               <select 
                onChange={(e) => handleDeviceChange('audioOut', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00C896]"
              >
                {devices.audioOut.map(d => <option key={d.deviceId} value={d.deviceId} className="bg-[#0A2540]">{d.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Right Side: Doctor Card & Join */}
        <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/10">
          <div className="text-center mb-10">
            <img src={doctorInfo.image} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-[#00C896] shadow-lg object-cover" alt="" />
            <h2 className="text-white text-2xl font-bold">{doctorInfo.name}</h2>
            <p className="text-[#00C896] font-medium">{doctorInfo.specialization}</p>
          </div>

          <div className="space-y-6 mb-12">
            {[
               { icon: <CheckCircle2 className="text-emerald-500" />, text: "Camera & Microphone Ready" },
               { icon: <CheckCircle2 className="text-emerald-500" />, text: "Secure End-to-End Encryption" },
               { icon: <CheckCircle2 className="text-emerald-500" />, text: "Verified Medical Professional" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-white/70">
                {item.icon}
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => stream && onJoin(stream)}
            disabled={!stream}
            className="w-full bg-[#00C896] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#00b084] text-white py-5 rounded-2xl font-bold text-lg shadow-[0_10px_30px_-5px_rgba(0,200,150,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Enter Consultation Room
          </button>
          
          <p className="text-white/30 text-xs text-center mt-6 uppercase tracking-wider">
            ABHA Sync Active • Secure HIPAA-ready link
          </p>
        </div>
      </div>

      <style jsx>{`
        .mirror { transform: scaleX(-1); }
      `}</style>
    </div>
  );
}
