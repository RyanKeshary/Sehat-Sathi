"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, AlertTriangle, SignalHigh, SignalLow, SignalMedium } from "lucide-react";
import { cn } from "@/utils/cn";

interface ConnectionQualityIndicatorProps {
  peerConnection?: RTCPeerConnection | null;
  className?: string; // Add optional className
}

export default function ConnectionQualityIndicator({ peerConnection, className }: ConnectionQualityIndicatorProps) {
  const [qualityScore, setQualityScore] = useState(95); // 0-100
  const [issue, setIssue] = useState<string | null>(null);

  useEffect(() => {
    const checkQuality = async () => {
      if (!peerConnection) {
        // Mock fluctuations for demo
        setQualityScore(prev => {
          const change = Math.random() > 0.8 ? -20 : (Math.random() > 0.5 ? 5 : -5);
          const next = Math.max(10, Math.min(100, prev + change));
          if (next < 40) setIssue("High packet loss");
          else if (next < 70) setIssue("Low bandwidth");
          else setIssue(null);
          return next;
        });
        return;
      }

      try {
        const stats = await peerConnection.getStats();
        let score = 100;
        let currentIssue: string | null = null;

        stats.forEach(report => {
          if (report.type === 'inbound-rtp' && report.kind === 'video') {
            const lossRate = report.packetsLost / (report.packetsReceived + report.packetsLost);
            if (lossRate > 0.05) {
               score -= 30;
               currentIssue = `High packet loss (${(lossRate * 100).toFixed(1)}%)`;
            }
          }
          if (report.type === 'remote-candidate' && report.roundTripTime) {
             if (report.roundTripTime > 0.3) {
               score -= 20;
               currentIssue = currentIssue || `High latency (${(report.roundTripTime * 1000).toFixed(0)}ms)`;
             }
          }
        });

        setQualityScore(Math.max(0, score));
        setIssue(currentIssue);
      } catch (err) {
        console.error("Failed to get stats", err);
      }
    };

    const interval = setInterval(checkQuality, 2000);
    return () => clearInterval(interval);
  }, [peerConnection]);

  const barCount = qualityScore > 90 ? 4 : qualityScore > 60 ? 3 : qualityScore > 30 ? 2 : 1;
  const color = qualityScore > 60 ? "bg-[#00C896]" : qualityScore > 30 ? "bg-amber-500" : "bg-rose-500";

  return (
    <div className={cn("flex flex-col items-center gap-1 group relative", className)}>
      <div className="flex items-end gap-[2px] h-5 w-8 justify-center">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ height: "20%" }}
            animate={{ 
               height: i <= barCount ? `${25 * i}%` : "20%",
               opacity: i <= barCount ? 1 : 0.2
            }}
            className={cn("w-1 rounded-sm transition-colors duration-500", i <= barCount ? color : "bg-white/20")}
          />
        ))}
      </div>

      {issue && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          <div className="bg-[#0A2540] border border-white/10 px-3 py-1.5 rounded-lg shadow-2xl whitespace-nowrap flex items-center gap-2">
            <AlertTriangle className={cn("w-3.5 h-3.5", qualityScore > 30 ? "text-amber-500" : "text-rose-500")} />
            <span className="text-white text-[10px] font-bold uppercase tracking-wider">{issue}</span>
          </div>
          <div className="w-2 h-2 bg-[#0A2540] border-r border-b border-white/10 rotate-45 mx-auto -mt-1 shadow-2xl" />
        </div>
      )}
    </div>
  );
}
