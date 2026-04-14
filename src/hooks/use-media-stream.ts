"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface DeviceInfo {
  deviceId: string;
  label: string;
}

/**
 * FIX-010: useMediaStream Hook
 * Manages camera/mic access, enumeration, and device switching.
 */
export function useMediaStream() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("Initializing...");
  const [devices, setDevices] = useState<{
    video: DeviceInfo[];
    audioIn: DeviceInfo[];
    audioOut: DeviceInfo[];
  }>({ video: [], audioIn: [], audioOut: [] });

  const streamRef = useRef<MediaStream | null>(null);

  const getMedia = useCallback(async (videoDeviceId?: string, audioDeviceId?: string) => {
    try {
      setStatus("Requesting Permissions...");
      
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: videoDeviceId ? { exact: videoDeviceId } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          deviceId: audioDeviceId ? { exact: audioDeviceId } : undefined,
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000
        }
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Stop old tracks if they exist
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      streamRef.current = newStream;
      setStream(newStream);
      setError(null);
      setStatus("✓ Camera & Mic Ready");

      // Enumerate devices after permission granted
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      setDevices({
        video: allDevices.filter(d => d.kind === 'videoinput').map(d => ({ deviceId: d.deviceId, label: d.label || "Default Camera" })),
        audioIn: allDevices.filter(d => d.kind === 'audioinput').map(d => ({ deviceId: d.deviceId, label: d.label || "Default Mic" })),
        audioOut: allDevices.filter(d => d.kind === 'audiooutput').map(d => ({ deviceId: d.deviceId, label: d.label || "Default Speaker" }))
      });

    } catch (err: any) {
      console.error("Media Access Error:", err);
      if (err.name === 'NotAllowedError') {
        setError("PERMISSIONS_DENIED");
        setStatus("Access Denied");
      } else if (err.name === 'NotFoundError') {
        setError("DEVICE_NOT_FOUND");
        setStatus("Device Not Found");
      } else {
        setError(err.message);
        setStatus("Error Encountered");
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const toggleTrack = (kind: 'video' | 'audio', enabled: boolean) => {
    if (!stream) return;
    const tracks = kind === 'video' ? stream.getVideoTracks() : stream.getAudioTracks();
    tracks.forEach(t => t.enabled = enabled);
  };

  return { stream, error, status, devices, getMedia, toggleTrack };
}
