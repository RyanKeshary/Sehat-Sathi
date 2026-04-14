export const runtime = "edge";

const SERVICES = [
  "WebRTC/Mediasoup", "FastAPI Backend", "HAPI FHIR",
  "Redis/BullMQ", "WhatsApp API", "Bhashini API",
  "Claude AI API", "ABHA OAuth", "AWS Mumbai"
];

function generateEvent() {
  const service = SERVICES[Math.floor(Math.random() * SERVICES.length)];
  const latency = Math.floor(Math.random() * 200) + 20;
  const status = Math.random() > 0.05 ? "operational" : Math.random() > 0.5 ? "degraded" : "outage";
  const uptime = (99 + Math.random()).toFixed(2);

  return {
    service,
    latency,
    status,
    uptime: parseFloat(uptime),
    timestamp: new Date().toISOString(),
    activeConnections: Math.floor(Math.random() * 500) + 50,
    requestsPerSecond: Math.floor(Math.random() * 200) + 10,
  };
}

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial batch
      const initial = SERVICES.map(service => ({
        service,
        latency: Math.floor(Math.random() * 150) + 20,
        status: "operational" as const,
        uptime: parseFloat((99 + Math.random()).toFixed(2)),
        timestamp: new Date().toISOString(),
        activeConnections: Math.floor(Math.random() * 500) + 50,
        requestsPerSecond: Math.floor(Math.random() * 200) + 10,
      }));

      controller.enqueue(encoder.encode(`data: ${JSON.stringify(initial)}\n\n`));

      const interval = setInterval(() => {
        try {
          const event = generateEvent();
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        } catch {
          clearInterval(interval);
          controller.close();
        }
      }, 3000);

      // Auto-close after 5 minutes
      setTimeout(() => {
        clearInterval(interval);
        controller.close();
      }, 300000);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
