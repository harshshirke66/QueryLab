<div align="center">

# `QUERYLAB`

### Think in Queries. Crack Real Interviews.

**A dark-first SQL & Data Analytics interview prep platform that runs real PostgreSQL in your browser, with an AI tutor that teaches instead of spoiling.**

<br />

![Next.js](https://img.shields.io/badge/Next.js-App_Router-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PGlite-WASM_Postgres-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-F55036?style=for-the-badge&logo=lightning&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-A3E635?style=for-the-badge)

<br />

[**Features**](#-features) · [**How It Works**](#-how-it-works) · [**Tech Stack**](#-tech-stack) · [**Author**](#-author)

<br />

</div>

---

## ✨ Why QueryLab?

Most interview-prep tools make you choose: realistic questions **or** a real database **or** useful feedback. QueryLab combines all three.

| | Typical SQL prep sites | **QueryLab** |
|---|:---:|:---:|
| Real PostgreSQL syntax (windows, CTEs, intervals) | Partial | ✅ Full |
| Queries run in an isolated sandbox | Server-side | ✅ In your browser (WASM) |
| Question source transparency | Rarely | ✅ Every question labeled A / B / C |
| Hints that don't spoil the answer | ❌ | ✅ 3-tier progressive hints |
| Duplicate-free AI-generated questions | ❌ | ✅ Similarity-checked |
| Timed mock interview + debrief | Paid add-on | ✅ Built in |

---

## 🚀 Features

### 🧪 Isolated PostgreSQL Sandbox
Every challenge runs in an **ephemeral in-memory Postgres** compiled to WebAssembly via [`@electric-sql/pglite`](https://github.com/electric-sql/pglite). Nothing touches a production database.

- Window functions: `ROW_NUMBER`, `RANK`, `DENSE_RANK`, `LAG`, `LEAD`, `PERCENTILE_CONT`
- CTEs, correlated subqueries, interval arithmetic, conditional aggregation
- Column-by-column **result diff** against the expected output
- `EXPLAIN (VERBOSE, COSTS)` plan viewer

### ✅ Transparent Question Authenticity
Every question carries a visible provenance badge:

| Badge | Category | Meaning |
|:---:|---|---|
| 🟢 **A** | **Verified Real** | Sourced from public interview reports, company tech blogs, or documented experiences, **with a source URL** |
| 🟡 **B** | **Community Reported** | Candidate-reported from recent interview loops, schema-verified |
| 🔵 **C** | **AI Generated** | Synthesized by Groq, verified in the PGlite sandbox, and duplicate-checked |

### 🤖 Groq AI Toolkit *(server-side only, keys never reach the browser)*

<table>
<tr>
<td width="50%" valign="top">

**🪄 AI Question Generator**
Creates novel scenarios with schema, seed data, and a reference solution, then **auto-verifies** them in PGlite before publishing.

**🛡️ Duplicate Prevention Engine**
Jaccard token overlap + normalized Levenshtein distance + semantic scoring. Anything above **0.70 similarity** is rejected.

**🔍 AI Solution Explainer**
Walks through logical execution order and suggests indexing strategies:
`FROM → WHERE → GROUP BY → HAVING → SELECT → WINDOW → ORDER BY`

</td>
<td width="50%" valign="top">

**💡 3-Tier Progressive Hints**

| Tier | You get |
|:---:|---|
| 1 | Conceptual, relational direction |
| 2 | The right function or syntax (`DENSE_RANK`, `PARTITION BY`, `LAG`) |
| 3 | A step-by-step logic trace, **never the final code** |

**🎙️ Timed Mock Interviewer**
Simulates a live screening round, then produces a debrief with a **readiness score** and **weak-concept diagnosis**.

</td>
</tr>
</table>

### 📚 4-Track Concept Syllabus

| Track | What you'll cover |
|---|---|
| 🗄️ **SQL** | Fundamentals · Aggregations · Joins · Subqueries & CTEs · Window Functions · Analytical SQL (cohort retention, rolling 7-day metrics) |
| 🐍 **Python** | Pandas DataFrames · boolean indexing · missing values · group-by · EDA |
| 📊 **Statistics** | Summary stats · distributions · A/B testing · p-values · hypothesis tests · confidence intervals |
| 📈 **Data Analytics** | SaaS & consumer KPIs: LTV, CAC, churn, ARPU, conversion funnels |

### 📊 Progress & Motivation
- 16-week GitHub-style **activity heatmap**
- Recharts **performance telemetry**
- Global **leaderboard** with XP podium
- Unlockable **badges**, bookmarks, and `Cmd+K` global search
- One-click **demo profiles** so you can explore instantly

---

## 🧠 How It Works

**Solving a question**

```text
  ┌──────────────────────┐     ┌──────────────────────┐
  │  Write SQL           │ ──▶ │  Run in PGlite       │
  │  (Monaco Editor)     │     │  (in-browser Postgres)│
  └──────────────────────┘     └──────────┬───────────┘
            ▲                             │
            │                    Matches expected output?
            │                      │                │
            │                     NO               YES
            │                      ▼                ▼
            │            ┌───────────────────┐  ┌─────────────────────────┐
            │            │ Column-level diff │  │ XP + heatmap + badges   │
            │            └─────────┬─────────┘  │ + analytics/leaderboard │
            │                      ▼            └─────────────────────────┘
            │            ┌───────────────────┐
            └─────────── │ 3-tier AI hints   │
                         │ (Groq, server)    │
                         └───────────────────┘
```

**Publishing an AI-generated question**

```text
  Groq generates question
            │
            ▼
  Run reference solution in PGlite sandbox
            │
            ▼
  Compare against existing questions
  (Jaccard + Levenshtein + semantic score)
            │
     ┌──────┴───────────────┐
     ▼                      ▼
  similarity > 0.70     similarity <= 0.70
  REJECTED (duplicate)  PUBLISHED as Category C
```

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|---|---|
| **Frontend** | Next.js (App Router) · React · TypeScript (strict) · Tailwind CSS |
| **UI & Motion** | Monaco Editor · Framer Motion · Lucide React · Recharts · canvas-confetti |
| **SQL Engine** | `@electric-sql/pglite` (WebAssembly Postgres by ElectricSQL) |
| **Database / ORM** | Neon Serverless PostgreSQL · Prisma |
| **AI** | Groq API · Llama 3.3 70B Versatile (`groq-sdk`) |
| **Cache / Rate limit** | Upstash Redis (automatic in-memory fallback) |
| **Auth** | Better Auth / session tokens via `jose` · PBKDF2 hashing · demo profiles |

</div>

---

## 🎨 Design System

A dark-first interface inspired by Linear, Vercel, and Stripe.

| Token | Hex | Preview |
|---|---|:---:|
| Base background | `#0B0D10` | ![](https://placehold.co/60x20/0B0D10/0B0D10) |
| Secondary background | `#11151B` | ![](https://placehold.co/60x20/11151B/11151B) |
| Surface | `#171C24` | ![](https://placehold.co/60x20/171C24/171C24) |
| Elevated surface | `#1D2430` | ![](https://placehold.co/60x20/1D2430/1D2430) |
| Border | `#29313D` | ![](https://placehold.co/60x20/29313D/29313D) |
| **Primary accent** (Lime) | `#A3E635` | ![](https://placehold.co/60x20/A3E635/A3E635) |
| **Secondary accent** (Indigo) | `#7C9EFF` | ![](https://placehold.co/60x20/7C9EFF/7C9EFF) |

**Typography:** Geist / Inter for UI, Geist Mono for SQL.

---

## 👨‍💻 Author

**Designed and built by [Harsh Shirke](https://github.com/harshshirke66)**

[![GitHub](https://img.shields.io/badge/GitHub-harshshirke66-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/harshshirke66)

---


## 🛡️ License
MIT License. Built for production interview preparation.
