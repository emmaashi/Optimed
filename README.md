Optimed is a full-stack healthcare platform that helps Canadians triage injuries, view live ER wait times, and reserve spots in hospital queues. Designed to reduce ER strain for non-life-threatening cases, it combines AI-powered symptom checking, queue booking, and location-based insights.

> 🧠 Endorsed by Dr. Craig Earle (Sunnybrook Hospital)  
> 🏆 Previously incubated 2 years at Ontario Tech’s start-up entrepreneurship program, Brilliant Catalyst.

<img width="1462" height="745" alt="Screenshot 2025-07-16 at 12 53 56 PM" src="https://github.com/user-attachments/assets/47e5a782-88f9-42df-8b9c-1d5586d4fe06" />

## Features

- **AI Symptom Checker** — GPT-powered assistant to assess injury severity
- **Live ER Wait Times** — Mapbox integration with nearby hospitals
- **Queue Booking** — Secure your spot, see countdown to your time
- **Patient Profile** — Store health card, phone, and condition info
- **Telehealth & Emergency Routing** — Redirect based on urgency

---

## Tech Stack

**Frontend:**  
- React, TypeScript, Next.js (App Router)  
- Chakra UI, Tailwind CSS  
- Mapbox, Lucide Icons

**Backend & AI:**  
- OpenAI GPT-3.5 via `@ai-sdk/openai`  
- Supabase (PostgreSQL, Realtime, Auth)  
- `streamText`, React Query

---

## Local Setup

```bash
git clone https://github.com/emmaashi/optimed.git
npm install
npm run dev
