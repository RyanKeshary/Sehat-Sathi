import { NextRequest, NextResponse } from 'next/server';

/**
 * FIX-010: Polling-based Signaling Server for WebRTC
 * Stores session offers, answers, and ICE candidates.
 * Note: For production use Redis or a real Database.
 */

interface SignalingSession {
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  candidates: RTCIceCandidateInit[];
  lastUpdated: number;
}

// Global in-memory store (reset on server restart)
const signalingStore: Record<string, SignalingSession> = {};

export async function POST(req: NextRequest) {
  const { sessionId, type, data } = await req.json();

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }

  if (!signalingStore[sessionId]) {
    signalingStore[sessionId] = { candidates: [], lastUpdated: Date.now() };
  }

  const session = signalingStore[sessionId];
  session.lastUpdated = Date.now();

  switch (type) {
    case 'OFFER':
      session.offer = data;
      break;
    case 'ANSWER':
      session.answer = data;
      break;
    case 'ICE_CANDIDATE':
      session.candidates.push(data);
      break;
    default:
      return NextResponse.json({ error: 'Invalid message type' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }

  const session = signalingStore[sessionId] || { candidates: [], lastUpdated: Date.now() };
  
  return NextResponse.json(session);
}

// Optional: Cleanup old sessions
setInterval(() => {
  const now = Date.now();
  Object.keys(signalingStore).forEach(id => {
    if (now - signalingStore[id].lastUpdated > 1000 * 60 * 60) { // 1 hour
      delete signalingStore[id];
    }
  });
}, 1000 * 60 * 10);
