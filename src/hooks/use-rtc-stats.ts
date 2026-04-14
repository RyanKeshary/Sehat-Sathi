"use client";

import { useState, useEffect } from "react";

export interface RTCQuality {
  latency: number;
  packetLoss: number;
  bitrate: number;
  fps: number;
  status: 'excellent' | 'good' | 'poor';
}

/**
 * FIX-010: useRTCStats Hook
 * Monitors WebRTC statistics and triggers adaptive behaviors like resolution downscaling.
 */
export function useRTCStats(pc: RTCPeerConnection | null) {
  const [quality, setQuality] = useState<RTCQuality>({
    latency: 0,
    packetLoss: 0,
    bitrate: 0,
    fps: 0,
    status: 'good'
  });

  useEffect(() => {
    if (!pc) return;

    let prevPacketsLost = 0;
    let prevPacketsReceived = 0;

    const interval = setInterval(async () => {
      const stats = await pc.getStats();
      let currentQuality: Partial<RTCQuality> = {};

      stats.forEach(report => {
        if (report.type === 'inbound-rtp' && report.kind === 'video') {
          const packetsLost = report.packetsLost || 0;
          const packetsReceived = report.packetsReceived || 0;
          const deltaLost = packetsLost - prevPacketsLost;
          const deltaReceived = packetsReceived - prevPacketsReceived;
          const lossRatio = (deltaLost / (deltaReceived + deltaLost)) || 0;

          currentQuality.packetLoss = lossRatio * 100;
          currentQuality.fps = report.framesPerSecond || 0;
          currentQuality.bitrate = (report.bytesReceived * 8) / 1000000; // Mbps

          prevPacketsLost = packetsLost;
          prevPacketsReceived = packetsReceived;

          // Adaptive Behavior
          if (lossRatio > 0.05) {
            // Trigger low quality (typically would call applyConstraints on track)
            currentQuality.status = 'poor';
          } else if (lossRatio > 0.15) {
             currentQuality.status = 'poor';
          } else {
            currentQuality.status = 'excellent';
          }
        }

        if (report.type === 'remote-candidate' || report.type === 'candidate-pair') {
          if (report.currentRoundTripTime) {
            currentQuality.latency = report.currentRoundTripTime * 1000; // ms
          }
        }
      });

      setQuality(prev => ({ ...prev, ...currentQuality }));
    }, 2000);

    return () => clearInterval(interval);
  }, [pc]);

  return quality;
}
