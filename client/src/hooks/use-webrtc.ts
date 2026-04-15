"use client";

import { useState, useEffect, useRef } from "react";

interface WebRTCOptions {
  sessionId: string;
  isCaller: boolean;
  localStream: MediaStream | null;
}

/**
 * FIX-010: useWebRTC Hook
 * Implements full WebRTC signaling, SDP munging (VP9/Opus), and P2P data channels.
 */
export function useWebRTC({ sessionId, isCaller, localStream }: WebRTCOptions) {
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("Disconnected");
  const [messages, setMessages] = useState<any[]>([]);
  
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const processedCandidates = useRef<Set<string>>(new Set());

  // SDP Munging function
  const mungeSDP = (sdp: string) => {
    let lines = sdp.split('\r\n');
    
    // 1. Prefer VP9 for video
    const videoMLineIdx = lines.findIndex(l => l.startsWith('m=video'));
    if (videoMLineIdx !== -1) {
      // Find VP9 payload type (usually 98 or similar)
      const vp9Line = lines.find(l => l.includes('VP9/90000'));
      if (vp9Line) {
        const pt = vp9Line.split(':')[1].split(' ')[0];
        const mLine = lines[videoMLineIdx].split(' ');
        const pts = mLine.slice(3);
        const reordered = [pt, ...pts.filter(p => p !== pt)];
        lines[videoMLineIdx] = [...mLine.slice(0, 3), ...reordered].join(' ');
      }
      lines.splice(videoMLineIdx + 1, 0, "b=AS:800"); // 800kbps bitrate
    }

    // 2. Prefer Opus for audio
    const audioMLineIdx = lines.findIndex(l => l.startsWith('m=audio'));
    if (audioMLineIdx !== -1) {
      lines.splice(audioMLineIdx + 1, 0, "b=AS:128"); // 128kbps Opus
    }

    return lines.join('\r\n');
  };

  useEffect(() => {
    if (!localStream) return;

    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    const pc = new RTCPeerConnection(configuration);
    pcRef.current = pc;

    // Handle incoming tracks
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
        setConnectionStatus("Connected");
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        await fetch('/api/video', {
          method: 'POST',
          body: JSON.stringify({ sessionId, type: 'ICE_CANDIDATE', data: event.candidate })
        });
      }
    };

    // Add local tracks
    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

    const setupDataChannel = (dc: RTCDataChannel) => {
      dataChannelRef.current = dc;
      dc.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        setMessages(prev => [...prev, msg]);
      };
      dc.onopen = () => console.log("Data channel opened");
    };

    // Data Channel for Chat
    if (isCaller) {
      const dc = pc.createDataChannel('chat', { ordered: true });
      setupDataChannel(dc);
    } else {
      pc.ondatachannel = (event) => setupDataChannel(event.channel);
    }

    // Signaling Logic
    const startSignaling = async () => {
      if (isCaller) {
        const offer = await pc.createOffer();
        const mungedOffer = { ...offer, sdp: mungeSDP(offer.sdp || "") };
        await pc.setLocalDescription(mungedOffer);
        await fetch('/api/video', {
          method: 'POST',
          body: JSON.stringify({ sessionId, type: 'OFFER', data: mungedOffer })
        });
      }
    };

    startSignaling();

    // Polling for updates
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/video?sessionId=${sessionId}`);
        const data = await res.json();

        if (!isCaller && data.offer && !pc.localDescription) {
          await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
          const answer = await pc.createAnswer();
          const mungedAnswer = { ...answer, sdp: mungeSDP(answer.sdp || "") };
          await pc.setLocalDescription(mungedAnswer);
          await fetch('/api/video', {
            method: 'POST',
            body: JSON.stringify({ sessionId, type: 'ANSWER', data: mungedAnswer })
          });
        }

        if (isCaller && data.answer && !pc.remoteDescription) {
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        }

        if (data.candidates) {
          for (const cand of data.candidates) {
            const candStr = JSON.stringify(cand);
            if (!processedCandidates.current.has(candStr)) {
              await pc.addIceCandidate(new RTCIceCandidate(cand));
              processedCandidates.current.add(candStr);
            }
          }
        }
      } catch (e) {
        console.error("Polling error:", e);
      }
    }, 2000);

    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      pc.close();
    };
  }, [sessionId, isCaller, localStream]);

  const sendMessage = (text: string) => {
    if (dataChannelRef.current?.readyState === 'open') {
      const msg = { sender: 'Patient', text, timestamp: Date.now() };
      dataChannelRef.current.send(JSON.stringify(msg));
      setMessages(prev => [...prev, { ...msg, self: true }]);
    }
  };

  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: 'always' } as any, audio: true });
      const videoSender = pcRef.current?.getSenders().find(s => s.track?.kind === 'video');
      if (videoSender) {
        videoSender.replaceTrack(screenStream.getVideoTracks()[0]);
        // Revert back when sharing ends
        screenStream.getVideoTracks()[0].onended = () => {
          if (localStream) videoSender.replaceTrack(localStream.getVideoTracks()[0]);
        };
      }
    } catch (e) {
      console.error("Screen share error:", e);
    }
  };

  return { remoteStream, connectionStatus, messages, sendMessage, shareScreen, pc: pcRef.current };
}
