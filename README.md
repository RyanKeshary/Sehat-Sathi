# 🏥 Sehat Sathi — India's Rural Telemedicine Platform

> Offline-first, ABHA-integrated, DPDPA-compliant digital healthcare for Bharat.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 🚀 One-Command Deploy

```bash
vercel --prod
```

## 📋 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-org/sehat-sathi.git
cd sehat-sathi/sehat-sathi-web

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000
```

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Optional | Claude AI for symptom chat & call scripts |
| `NEXT_PUBLIC_APP_URL` | Optional | Application URL (defaults to localhost) |
| `WHATSAPP_API_TOKEN` | Optional | WhatsApp Business API integration |
| `ABHA_CLIENT_ID` | Optional | ABDM sandbox client ID |
| `ABHA_CLIENT_SECRET` | Optional | ABDM sandbox client secret |
| `DATABASE_URL` | Optional | PostgreSQL connection string |

> **Note**: The app works fully with mock data when environment variables are not configured. Perfect for demo and development.

## 🗺️ Platform Routes

### Patient Journey
| Route | Description |
|-------|-------------|
| `/` | Landing page with magnetic cursor effect |
| `/onboarding` | Patient language & mode selection |
| `/register-abha` | ABHA ID registration wizard |
| `/symptom-checker` | AI-powered symptom assessment (Claude API) |
| `/voice-intake` | Web Speech API voice intake |
| `/symptom-summary` | AI severity analysis with radial gauge |
| `/waiting-room` | Live queue with countdown & health tips |
| `/consultation` | Real-time video/voice call interface |
| `/records` | Offline-accessible health records |
| `/reminders` | Medication adherence tracker |
| `/abha-id` | ABHA consent management hub |
| `/passport` | Digital health passport |

### Doctor Dashboard
| Route | Description |
|-------|-------------|
| `/doctor/login` | 2FA authentication with MCI verification |
| `/doctor/dashboard` | Patient queue with drag-to-reorder |
| `/doctor/consultation` | Split-screen clinical workspace |
| `/doctor/post-consultation` | SOAP notes with ICD-10 autocomplete |
| `/doctor/history` | FHIR R4 patient timeline |

### Clinic Operations
| Route | Description |
|-------|-------------|
| `/clinic/dashboard` | Real-time KPI monitoring |
| `/clinic/escalations` | Non-adherence escalation queue |
| `/clinic/call-prep` | AI call script generation (Claude API) |
| `/clinic/register-patient` | 3-step patient registration wizard |
| `/clinic/communications` | Multi-channel reminder centre |
| `/clinic/ops-desk` | Multi-clinic shared ops console |
| `/clinic/compliance` | DPDPA audit trail & compliance log |

### Platform Admin
| Route | Description |
|-------|-------------|
| `/admin/clinics` | Clinic management with revenue tracking |
| `/admin/analytics` | BI dashboard with Chart.js |
| `/admin/health` | System monitoring with SSE telemetry |
| `/admin/ivr-flow` | IVR flow visualization canvas |

### Demo & System
| Route | Description |
|-------|-------------|
| `/demo/whatsapp` | WhatsApp bot mockup (Pixel 8 Pro frame) |
| `/demo/notifications` | Notification centre drawer |
| `/demo/errors` | 404/Offline resilience states |

## 🏗️ Architecture

```
sehat-sathi-web/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API Routes
│   │   │   ├── chat/         # Claude AI symptom chat
│   │   │   ├── generate-script/ # AI call script generation
│   │   │   └── events/       # SSE health telemetry
│   │   ├── doctor/           # Doctor dashboard routes
│   │   ├── clinic/           # Clinic ops routes
│   │   ├── admin/            # Platform admin routes
│   │   ├── demo/             # Demo/showcase routes
│   │   └── not-found.tsx     # Global 404 with offline detection
│   ├── components/           # Shared UI components
│   │   ├── AppShell.tsx      # Role-aware navigation layout
│   │   ├── MagneticCursor.tsx # Canvas cursor trail effect
│   │   └── PageProgress.tsx  # Route transition progress bar
│   ├── context/
│   │   └── AuthContext.tsx    # Role-based auth provider
│   └── hooks/
│       └── useScrollReveal.ts # IntersectionObserver animations
├── middleware.ts              # Route protection
├── vercel.json                # Deployment config
└── .env.example               # Environment template
```

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#0891B2` | CTAs, active states, links |
| Secondary | `#059669` | Success, positive indicators |
| Gold | `#B45309` | ABHA branding, premium badges |
| Background | `#FAFCFF` | Page background |
| Surface | `#FFFFFF` | Card backgrounds |
| Text Primary | `#0C4A6E` | Headings |
| Text Secondary | `#475569` | Body text |

## 🔒 Compliance

- **DPDPA**: Data Protection headers, consent management, audit trail
- **ABDM**: ABHA ID integration, FHIR R4 health records
- **WCAG 2.1**: Accessible design patterns, keyboard navigation
- **MCI**: Medical Council of India doctor verification

## 📄 License

MIT License — Built for India's healthcare future.
