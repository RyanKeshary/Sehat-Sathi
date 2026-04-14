"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { WaitingRoom } from "@/components/video/WaitingRoom";
import { ActiveCall } from "@/components/video/ActiveCall";
import { useWebRTC } from "@/hooks/use-webrtc";
import { useRTCStats } from "@/hooks/use-rtc-stats";
import { useMediaStream } from "@/hooks/use-media-stream";

/**
 * FIX-010: Real Video Consultation Room
 * Orchestrates MediaStream, WebRTC, and UI states.
 */
export default function ConsultationRoom() {
  const { sessionId } = useParams();
  const router = useRouter();
  const [inCall, setInCall] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  // Real hooks
  const { 
    remoteStream, 
    connectionStatus, 
    messages, 
    sendMessage, 
    shareScreen, 
    pc 
  } = useWebRTC({
    sessionId: sessionId as string,
    isCaller: true, // For demo purposes, we assume patient is caller
    localStream
  });

  const stats = useRTCStats(pc);

  const doctorInfo = {
    name: "Dr. Priya Sharma",
    specialization: "General Medicine specialist",
    image: "https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=200"
  };

  const handleJoin = (stream: MediaStream) => {
    setLocalStream(stream);
    setInCall(true);
  };

  const handleEndCall = () => {
    localStream?.getTracks().forEach(t => t.stop());
    router.push('/dashboard');
  };

  if (!inCall) {
    return <WaitingRoom onJoin={handleJoin} doctorInfo={doctorInfo} />;
  }

  return (
    <ActiveCall 
      localStream={localStream}
      remoteStream={remoteStream}
      connectionStatus={connectionStatus}
      doctorInfo={doctorInfo}
      onEndCall={handleEndCall}
      messages={messages}
      onSendMessage={sendMessage}
      onShareScreen={shareScreen}
      stats={stats}
    />
  );
}
