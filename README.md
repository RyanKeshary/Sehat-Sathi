# Sehat Sathi — Healthcare That Reaches Every Corner of India

**Sehat Sathi** is a robust, offline-first digital rural telemedicine platform built to bridge the healthcare gap between urban doctors, remote clinics, and underserved communities across India. Built as a high-performance Progressive Web App (PWA) with Next.js App Router, it focuses strictly on solving challenges unique to "Bharat" — low bandwidth, linguistic barriers, device constraints, and missing digital health literacy.

The platform is designed to be fully **ABDM** (Ayushman Bharat Digital Mission) integrated and **DPDPA** (Digital Personal Data Protection Act) compliant out of the box, ensuring secure, standardized access to health records nationwide.

---

## 🌟 Key Features & Capabilties

### 💻 Platform Architecture & Infrastructure
- **Offline-First Resilience:** Employs PWA caching strategies and a dedicated `not-found.tsx` handler that detects network dropouts and automatically redirects to a specialized offline "Health Vault" mode where previously synced records and reminders are guaranteed available.
- **Dynamic AI Integration:** Integrated with Claude AI for intelligent, multi-language symptom triage and automated Voice/IVR script generations directly to the edge via serverless route handlers (`/api/chat`, `/api/generate-script`).
- **Global Design System:** Provides a highly premium, "glassmorphic" medical aesthetic powered by Tailwind CSS and Framer Motion, utilizing deep teal (`#0891B2`), emerald (`#059669`), and accessibility-friendly surfaces (`#FAFCFF`) to convey trust.
- **Ambient Feedback Layer:** Uses custom `useScrollReveal` hooks, route-based progress ribbons, loading shimmer skeletons, and beautiful Canvas-rendered ambient cursor glows to establish a cutting-edge aesthetic that never sacrifices performance.

---

### 🧍 For Patients — Accessibility First
- **Multi-lingual Intake:** Overcomes language barriers with highly visual, icon-driven interfaces supporting numerous regional frameworks natively.
- **ABHA Single Sign-On:** Frictionless onboarding leveraging the national health ID infrastructure. No complex credential management required.
- **AI Symptom Checker & Voice Triage:** Translates complex patient explanations into structured medical intake reports that are passed directly to the physician before a consultation begins. 
- **Offline Health Vault:** Secures latest prescriptions, reminders, and lab results for quick retrieval even in intermittent network environments.

### ⚕️ For Doctors — Streamlined Action
- **Queue & Video Dashboard:** Real-time visibility into the clinic queue with one-click transitions into high-fidelity video consultations.
- **FHIR R4 Patient Context Timeline:** An intuitive sidebar interface dynamically aggregating the patient's entire medical history natively from ABDM endpoints so the doctor has crucial context *during* the call.
- **Post-Consult Automation:** Generates precise, structured SOAP notes, discharge instructions, and automated follow-up schedules instantly utilizing AI extraction, vastly reducing administrative load.

### 🏥 For Clinic Ops & Admins — Scalability and Compliance
- **Real-time Telemetry:** A comprehensive health and systems monitor built on Server-Sent Events (SSE) detailing latency of components like WebRTC, HAPI FHIR Servers, BullMQ, and Bhashini AI APIs.
- **BI & Analytics Command Center:** Financial and operational metrics mapping MRR, patient churn, active clinics, and regional choropleth distributions for founders and stakeholders.
- **Escalation & Communication Desks:** Dedicated tools to manage missed follow-ups, non-compliance alerts, and emergency overrides seamlessly through integrated VoIP and WhatsApp workflows.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 16.2 (App Router, Turbopack)
- **UI & Styling:** React 19, Tailwind CSS (Custom animation utility layers), Framer Motion, Lucide Icons
- **State & Access:** React Context API (`AuthContext`) handling mock JWT authentication & Role-based Access Control (Patient, Doctor, Clinic, Admin) middleware integration.
- **Visualization:** Pure CSS grids, SVG Arc generation, Canvas API (Ambient Cursor Effect).
- **Deployment & Edge:** Deployed on **Vercel** with strict security headers, optimized function caching configuration, and custom PWA manifests.

---

## 🗺️ Platform Routing Guide

*The platform encapsulates 30+ distinct views organized by role access:*

### Patient Experiences
- `/onboarding` — Multi-language entry path
- `/register-abha` / `/abha-id` — ABDM authentication workflows
- `/symptom-checker` / `/voice-intake` / `/symptom-summary` — Pre-consult triage logic
- `/waiting-room` / `/consultation` — Live interaction 
- `/records` / `/reminders` / `/passport` — Post-care engagement

### Professional Experiences (Protected)
- `/doctor/login` → `/doctor/dashboard` → `/doctor/history` → `/doctor/consultation`
- `/clinic/dashboard` → Queue & Desk workflows (`/clinic/ops-desk`, `/clinic/call-prep`, `/clinic/escalations`, `/clinic/compliance`)
- `/admin/clinics` → Platform Overviews (`/admin/analytics`, `/admin/health`, `/admin/ivr-flow`)

---

## 🚀 Setup & Deployment

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   Duplicate `.env.example` to `.env.local` and apply applicable API keys for LLMs. If keys are missing, the APIs gracefully default to high-fidelity mock data suitable for demonstrations.

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to interact with the platform. Use the floating Role Switcher (bottom-left) to simulate transitioning between Patient, Doctor, Clinic, and Admin contexts seamlessly.

4. **Deploy**
   Fully optimized for immediate, zero-config deployment to Vercel.
   ```bash
   vercel --prod
   ```

---
*Built as a high-fidelity blueprint for the future of connected digital healthcare infrastructure in rural India.*
