# QUERYLAB

> **Think in Queries. Crack Real Interviews.**

QUERYLAB is a production-quality, premium Data Analytics and SQL Interview Preparation platform engineered for aspiring **Data Analysts, Data Scientists, Business Analysts, and Analytics Engineers**.

Inspired by the authentic learning experience of DataLemur, QUERYLAB introduces an original dark-first design system, an isolated in-memory PostgreSQL execution engine powered by WebAssembly (PGlite), verified company interview questions, a 3-tier progressive Groq AI hint & tutoring assistant, automated duplicate prevention, and personalized performance telemetry.

---

## 🌟 Key Capabilities & Architectural Highlights

### 1. 100% Isolated PostgreSQL Sandbox (PGlite WebAssembly)
- User queries never execute unsafely against production databases.
- Every challenge runs in an isolated, ephemeral in-memory PostgreSQL engine (`@electric-sql/pglite`) in WebAssembly.
- Supports full standard PostgreSQL syntax: Window Functions (`ROW_NUMBER`, `RANK`, `DENSE_RANK`, `LAG`, `LEAD`, `PERCENTILE_CONT`), Common Table Expressions (CTEs), Correlated Subqueries, Interval Arithmetic, and conditional aggregations.
- Queries execute in sub-20ms with detailed column-by-column diff analysis and `EXPLAIN (VERBOSE, COSTS)` plan generation.

### 2. Transparent Authenticity & Verification System
Every problem in the question catalog is strictly categorized:
- **CATEGORY A — Verified Real Interview Questions**: Sourced from public candidate interview reports, company tech blogs, and documented interview experiences with verifiable source URLs.
- **CATEGORY B — Community Reported Questions**: Candidate-reported problems from recent interview loops, clearly tagged and schema-verified.
- **CATEGORY C — AI Generated Practice**: Synthesized on-demand via Groq (Llama 3.3 70B), verified for deterministic correctness in the PGlite sandbox, and checked for duplicates.

### 3. Groq AI Integration (Server-Side Only)
- **AI Question Generator**: Synthesizes novel interview scenarios with schemas, seeds, solutions, and automated PGlite verification before publishing.
- **Duplicate Prevention Engine**: Employs Jaccard token overlap, normalized Levenshtein distance, and semantic similarity scoring to reject duplicate questions ($> 0.70$ similarity threshold).
- **Progressive 3-Tier AI Hints**:
  - *Tier 1*: High-level relational conceptual direction.
  - *Tier 2*: Relevant SQL function or syntax guidance (`DENSE_RANK`, `PARTITION BY`, `LAG`).
  - *Tier 3*: Step-by-step logic trace without giving away the final code.
- **AI Solution Explainer**: Breaks down query execution order (FROM $\to$ WHERE $\to$ GROUP BY $\to$ HAVING $\to$ SELECT $\to$ WINDOW $\to$ ORDER BY) and provides database indexing recommendations.
- **Timed Mock Technical Interviewer**: Simulates live screening rounds and generates a candidate debrief report with readiness scores and weak concept diagnosis.

### 4. Comprehensive 4-Track Concept Syllabus
1. **SQL Track**: SQL Fundamentals, Aggregations & Grouping, Table Joins, Subqueries & CTEs, Window Functions, and Analytical SQL (Cohort Retention curves, Rolling 7-day metrics).
2. **Python Track**: Pandas DataFrames, boolean indexing, missing value handling, group-by aggregations, and EDA.
3. **Statistics Track**: Summary statistics, probability distributions, A/B testing, p-values, hypothesis tests, and confidence intervals.
4. **Data Analytics Track**: SaaS & consumer product KPIs (LTV, CAC, Churn Rate, ARPU, conversion funnels).

---

## 🛠️ Technology Stack

- **Frontend**: Next.js (App Router), TypeScript (Strict Mode), React, Tailwind CSS, Monaco Editor (`@monaco-editor/react`), Lucide React, Framer Motion, Recharts, Canvas-Confetti.
- **Isolated SQL Execution**: `@electric-sql/pglite` (Official WebAssembly Postgres engine by ElectricSQL).
- **Database & ORM**: Neon Serverless PostgreSQL with Prisma ORM (`@prisma/client`, `prisma`).
- **AI**: Groq API (`groq-sdk`, Llama 3.3 70B Versatile).
- **Caching & Rate Limiting**: Upstash Redis (`@upstash/redis` with automatic memory fallback).
- **Authentication**: Better Auth / Session tokens with `jose`, PBKDF2 cryptographic hashing, and 1-Click Demo Profiles.

---

## 🎨 Design System & Palette

Crafted with a dark-first, Linear/Vercel/Stripe-inspired aesthetic:
- **Base Background**: `#0B0D10`
- **Secondary Background**: `#11151B`
- **Surface**: `#171C24`
- **Elevated Surface**: `#1D2430`
- **Primary Accent**: `#A3E635` (Subtle Lime)
- **Secondary Accent**: `#7C9EFF` (Soft Indigo)
- **Border Base**: `#29313D`
- **Typography**: System Geist / Inter font stack + Geist Mono for SQL coding.

---

## 📁 Application Structure

```
src/
├── app/
│   ├── page.tsx                     # Landing Page with live SQL preview
│   ├── login/page.tsx               # Authentication & 1-Click Demo accounts
│   ├── dashboard/page.tsx           # Dashboard with 16-week GitHub-style heatmap
│   ├── questions/page.tsx           # Question bank explorer with multi-filters
│   ├── questions/[id]/page.tsx      # Flagship dual-pane SQL Workspace
│   ├── concepts/page.tsx            # 4 Learning Tracks syllabus
│   ├── concepts/[slug]/page.tsx     # Deep concept view with cheatsheet
│   ├── companies/page.tsx           # Company interview directory
│   ├── companies/[slug]/page.tsx    # Company interview profile
│   ├── mock-interview/page.tsx      # Timed mock interview & AI scorecard
│   ├── ai-assistant/page.tsx        # Groq AI Studio & Question Generator
│   ├── analytics/page.tsx           # Recharts performance telemetry
│   ├── leaderboard/page.tsx         # Global rankings & XP podium
│   ├── profile/page.tsx             # Candidate profile & unlocked badges
│   ├── admin/page.tsx               # Admin console & duplicate scanner
│   ├── bookmarks/page.tsx           # Saved questions library
│   └── api/                         # Route handlers (auth, sql, ai, bookmarks)
├── components/
│   ├── Navbar.tsx                   # Main navigation & role switcher
│   ├── CommandMenu.tsx              # Cmd+K Global search modal
│   ├── SqlWorkspace.tsx             # Monaco Editor + PGlite execution pane
│   └── Footer.tsx                   # Footer & authenticity commitment
└── lib/
    ├── types.ts                     # Strict TypeScript interfaces
    ├── sql-runner.ts                # PGlite execution & diff comparator
    ├── groq.ts                      # Groq AI & duplicate prevention logic
    ├── db.ts                        # Prisma Client singleton & mock store
    ├── auth.ts                      # Session encryption & demo profiles
    ├── redis.ts                     # Upstash Redis & in-memory cache
    └── data/mock-data.ts            # 25+ curated real interview datasets
```

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone <repository_url>
cd querylab
pnpm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Configure your credentials:
```env
# Neon Serverless PostgreSQL
DATABASE_URL="postgresql://neondb_owner:password@ep-sample-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://neondb_owner:password@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Groq API for AI Question Generator, Hints & Mock Interviewer
GROQ_API_KEY="gsk_your_groq_api_key_here"
GROQ_MODEL="llama-3.3-70b-versatile"

# Upstash Redis
UPSTASH_REDIS_REST_URL="https://sample-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_upstash_redis_token"

# Authentication
BETTER_AUTH_SECRET="querylab_development_session_secret_1234567890"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```
*(Note: If environment keys are not configured, the application automatically falls back to deterministic local mock datasets and simulated AI responses so that all features remain 100% interactive out of the box).*

### 3. Database Migration & Seeding
```bash
pnpm prisma:generate
pnpm prisma:push
pnpm seed
```

### 4. Start Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Demo Accounts (1-Click Instant Login)

No signup required for evaluation:
- **Candidate Demo**: `candidate@querylab.dev` / `candidate123` (Alex Rivera, 850 XP, 5-day streak)
- **Admin Demo**: `admin@querylab.dev` / `admin123` (Sarah Chen, Lead Interview Architect & Question Verifier)

---

## 🛡️ License
MIT License. Built for production interview preparation.
