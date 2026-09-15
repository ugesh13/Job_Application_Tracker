# ✦ Momentum — AI Career Operating System

> *"Your career, understood. Stop applying blindly. Understand where you fit, what you're missing, and what you could become next."*

Momentum transforms career development from blind, high-volume applying into an intelligent, evidence-grounded workflow:
**Discover → Understand → Prepare → Apply → Track → Improve → Get Hired**

---

## 🌟 Key Features

### 1. 🧊 Interactive 3D Career Object & Orbit (`Three.js`)
- Real-time WebGL multifaceted glass hyper-crystal representing the candidate's career state.
- **Physical Damping & Cursor Tilt**: Responds with fluid parallax and smooth rotation toward user coordinates.
- **Career Orbit**: 8 rotating beacons (`Skills`, `Projects`, `Experience`, `Opportunities`, `Goals`, `Applications`, `Growth`, `Insights`) projecting 2D telemetry on hover.

### 2. 🧬 Career Digital Twin & Multi-Domain Skill DNA
- Evaluates capabilities across 6 technical domains:
  - Frontend Development
  - Backend Development
  - Databases & Storage
  - Cloud Infrastructure
  - AI Engineering
  - DevOps & Quality
- **Evidence Matrix**: Directly correlates claimed skills to verified portfolio repositories with `[User-Provided]`, `[Verified Evidence]`, and `[AI Inference]` provenance badging.

### 3. ⏳ Career Time Machine ("What-If?" Simulation)
- Simulates future capabilities when adding new technologies (e.g. `+AWS`, `+Docker`, `+LangChain`).
- Outputs before-and-after score deltas, newly unlocked capabilities, and recommended project roadmaps without modifying active profiles.

### 4. 🧭 Reverse Job Search
- *"What jobs are looking for someone like me?"*
- Discovers high-alignment market roles by querying requirements that match the candidate's actual projects and code skills.

### 5. 🔍 Job Description Truth Layer & Recruiter Perspective
- Deconstructs job postings into:
  - **Core Requirements** (mandatory prerequisites)
  - **Secondary Requirements**
  - **Nice-to-Have**
  - **AI-Inferred Competencies** (implicit responsibilities)
- **Application Strategy Simulator**: Compares Strategy A (Apply Now), Strategy B (Build Evidence First), and Strategy C (Tailor Resume).
- **Recruiter Perspective Simulation**: Anticipated review impressions and interview questions.

### 6. 📋 Cinematic Stage Timeline & Kanban Board
- Dual-mode application tracker:
  - **Stage Timeline**: Visual linear progression (`Applied` ➔ `Screening` ➔ `Interview` ➔ `Offer` ➔ `Closed`).
  - **Kanban Board**: Drag-and-drop workflow with days-in-stage cadence and next-action reminders.

---

## 🛠️ Architecture & Tech Stack

- **Monorepo Architecture**: pnpm workspaces
- **Frontend**: React 18, Vite, Three.js, TailwindCSS, Lucide Icons, Framer Motion
- **Backend API Server**: Node.js, Express, Pino Logger, TypeScript
- **Database & ORM**: Neon Serverless PostgreSQL, Drizzle ORM
- **Authentication**: Firebase Authentication (Google & GitHub OAuth)
- **Contract & Codegen**: OpenAPI 3.0, Orval, Zod, React Query

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v20+ or v24 recommended)
- pnpm (`npm install -g pnpm`)

### 2. Installation
```bash
git clone https://github.com/ugesh13/Job_Application_Tracker.git
cd Job_Application_Tracker
pnpm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local` and add your database and Firebase credentials:
```bash
cp .env.example .env.local
```

### 4. Database Setup
Push schema migrations to your Neon database:
```bash
pnpm --filter @workspace/db run push
```

### 5. Start Development Servers
Start the backend API server (port 5000):
```bash
pnpm --filter @workspace/api-server run dev
```

Start the frontend client (port 5173):
```bash
pnpm --filter @workspace/momentum-job-tracker run dev
```

Visit **http://localhost:5173** to launch Momentum.

---

## 📄 License
MIT License
