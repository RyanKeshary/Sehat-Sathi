"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import WaitingRoom from "@/components/video/WaitingRoom";
import ActiveCall from "@/components/video/ActiveCall";
import PostCallSummary from "@/components/video/PostCallSummary";

export type CallState = "WAITING" | "ACTIVE" | "SUMMARY";

export default function VideoConsultationPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [callState, setCallState] = useState<CallState>("WAITING");
  const [durationSeconds, setDurationSeconds] = useState(0);

  // Mock duration timer for the active call
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callState === "ACTIVE") {
      timer = setInterval(() => {
        setDurationSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  const handleJoinCall = () => {
    setCallState("ACTIVE");
  };

  const handleEndCall = () => {
    setCallState("SUMMARY");
  };

  return (
    <main className="min-h-screen w-full bg-[#060F1E] text-white overflow-hidden relative font-sans">
      {callState === "WAITING" && (
        <WaitingRoom onJoin={handleJoinCall} sessionId={sessionId} />
      )}
      
      {callState === "ACTIVE" && (
        <ActiveCall 
          onEndCall={handleEndCall} 
          durationSeconds={durationSeconds} 
        />
      )}
      
      {callState === "SUMMARY" && (
        <PostCallSummary durationSeconds={durationSeconds} />
      )}
    </main>
  );
}
