import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Terminal, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  BookOpen, 
  Flame, 
  Layers, 
  Cpu, 
  Code2, 
  BarChart3,
  Search,
  Zap
} from 'lucide-react';
import { QUESTIONS, COMPANIES, CONCEPTS } from '@/lib/data/mock-data';

export default function LandingPage() {
  const verifiedQuestions = QUESTIONS.filter(q => q.verificationStatus === 'VERIFIED_REAL');

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D10] text-[#F4F5F7] selection:bg-[#A3E635]/20 selection:text-[#A3E635]">
      <Navbar />

      <main className="flex-1">
        
        {/* ------------------------------------------------------------- */}
        {/* HERO SECTION */}
        {/* ------------------------------------------------------------- */}
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-[#29313D] bg-grid-subtle">
          {/* Subtle radial spotlight overlay */}
          <div className="absolute inset-0 bg-radial-fade pointer-events-none opacity-40"></div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            
            {/* Pill Banner */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#29313D] bg-[#171C24]/80 px-3 py-1 mb-6 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-[#A3E635] animate-pulse"></span>
              <span className="text-[11px] font-mono font-medium text-[#969EAA]">
                Authentic, Source-Verified Interview Engine
              </span>
              <span className="text-[10px] text-[#29313D]">|</span>
              <a href="/questions" className="text-[11px] font-medium text-[#A3E635] hover:underline flex items-center gap-1">
                <span>Explore 25+ Real Problems</span>
                <ArrowRight className="h-3 w-3" />
              </a>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F4F5F7] max-w-4xl mx-auto leading-[1.08]">
              Become the Analyst Companies{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A3E635] via-[#C5F467] to-[#A3E635]">
                Want to Hire.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-base sm:text-lg text-[#969EAA] max-w-2xl mx-auto leading-relaxed">
              Master SQL, analytics, and real-world interview problems with a structured learning experience built around actual company interview questions.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/questions"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#A3E635] text-[#0B0D10] font-bold text-sm hover:bg-[#8ECE2B] transition-all glow-lime-sm shadow-lg"
              >
                <Terminal className="h-4 w-4" />
                <span>Start Practicing Now</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="/concepts"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#29313D] bg-[#171C24] text-sm font-semibold text-[#F4F5F7] hover:border-[#3E4A5C] hover:bg-[#1D2430] transition-all"
              >
                <BookOpen className="h-4 w-4 text-[#7C9EFF]" />
                <span>Explore Concepts & Tracks</span>
              </a>

              <a
                href="/mock-interview"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-[#29313D] bg-[#11151B] text-sm font-medium text-[#969EAA] hover:text-[#F4F5F7] hover:border-[#3E4A5C] transition-all"
              >
                <ShieldCheck className="h-4 w-4 text-[#A3E635]" />
                <span>Timed Mock Interview</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-[#969EAA] border-t border-[#29313D]/60 pt-6">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-[#F4F5F7]">100%</span>
                <span>Isolated PostgreSQL Sandbox (PGlite)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-[#A3E635]">3-Tier</span>
                <span>3-Tier Progressive AI Hints</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-[#7C9EFF]">Source-Linked</span>
                <span>Public Candidate Interview Debriefs</span>
              </div>
            </div>

            {/* Interactive Workspace Preview Component */}
            <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-[#29313D] bg-[#11151B] shadow-2xl overflow-hidden text-left">
              {/* Window Titlebar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#29313D] bg-[#171C24]">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#29313D]"></div>
                  <div className="h-3 w-3 rounded-full bg-[#29313D]"></div>
                  <div className="h-3 w-3 rounded-full bg-[#29313D]"></div>
                  <span className="ml-2 font-mono text-xs font-semibold text-[#F4F5F7]">
                    querylab_workspace // meta-page-with-no-likes.sql
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                    EASY • META INTERVIEW
                  </span>
                </div>
              </div>

              {/* Code Snippet & Result Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#29313D]">
                {/* Left: Code */}
                <div className="p-4 bg-[#0B0D10] font-mono text-xs leading-relaxed text-[#A3E635] space-y-1 overflow-x-auto">
                  <p className="text-[#64748B]">-- Target: Find all Facebook pages with 0 recorded likes</p>
                  <p><span className="text-sky-400 font-bold">SELECT</span> p.page_id</p>
                  <p><span className="text-sky-400 font-bold">FROM</span> pages p</p>
                  <p><span className="text-sky-400 font-bold">LEFT JOIN</span> page_likes pl <span className="text-sky-400 font-bold">ON</span> p.page_id = pl.page_id</p>
                  <p><span className="text-sky-400 font-bold">WHERE</span> pl.page_id <span className="text-sky-400 font-bold">IS NULL</span></p>
                  <p><span className="text-sky-400 font-bold">ORDER BY</span> p.page_id <span className="text-sky-400 font-bold">ASC</span>;</p>
                </div>

                {/* Right: Real Output execution */}
                <div className="p-4 bg-[#11151B] font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between text-[11px] pb-2 border-b border-[#29313D]">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>PASSED • 11.2ms</span>
                    </span>
                    <span className="text-[#969EAA]">2 rows returned</span>
                  </div>

                  <table className="w-full text-left text-[11px]">
                    <thead className="text-[#969EAA] border-b border-[#29313D]">
                      <tr>
                        <th className="py-1">page_id (INTEGER)</th>
                        <th className="py-1">status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#29313D] text-[#F4F5F7]">
                      <tr>
                        <td className="py-1.5 font-bold text-[#A3E635]">20002</td>
                        <td className="py-1.5 text-emerald-400">Match verified</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-bold text-[#A3E635]">20004</td>
                        <td className="py-1.5 text-emerald-400">Match verified</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="pt-2">
                    <a
                      href="/questions/meta-facebook-page-with-no-likes"
                      className="inline-flex items-center gap-1.5 text-xs text-[#7C9EFF] hover:underline"
                    >
                      <span>Open and execute this problem in live workspace</span>
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 2: AUTHENTICITY PLEDGE & THREE QUESTION CATEGORIES */}
        {/* ------------------------------------------------------------- */}
        <section className="py-16 border-b border-[#29313D] bg-[#0B0D10]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F5F7]">
                Authenticity First. Zero Fabricated Claims.
              </h2>
              <p className="mt-3 text-sm text-[#969EAA] leading-relaxed">
                We reject generic AI question churn. QueryLab strictly separates every problem into three transparent categories with verifiable source links.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Category 1: Verified Real */}
              <div className="rounded-2xl border border-[#A3E635]/30 bg-[#171C24] p-6 space-y-4 hover:border-[#A3E635] transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#A3E635]/10 text-[#A3E635] font-bold border border-[#A3E635]/30">
                    CATEGORY A
                  </span>
                  <ShieldCheck className="h-5 w-5 text-[#A3E635]" />
                </div>
                <h3 className="text-lg font-bold text-[#F4F5F7]">Verified Real Questions</h3>
                <p className="text-xs text-[#969EAA] leading-relaxed">
                  Supported by credible public sources: candidate interview reports, company engineering blogs, and public repositories. Every question links to its authentic reference.
                </p>
                <div className="pt-2 text-[11px] font-mono text-[#A3E635]">
                  ✓ Source URL & Interview Type Attached
                </div>
              </div>

              {/* Category 2: Community Reported */}
              <div className="rounded-2xl border border-sky-800/40 bg-[#171C24] p-6 space-y-4 hover:border-sky-500 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-sky-950/60 text-sky-400 font-bold border border-sky-800/40">
                    CATEGORY B
                  </span>
                  <Terminal className="h-5 w-5 text-sky-400" />
                </div>
                <h3 className="text-lg font-bold text-[#F4F5F7]">Community Reported</h3>
                <p className="text-xs text-[#969EAA] leading-relaxed">
                  Questions shared by candidates from recent interview loops. Clearly labeled and peer-tested by the analytics community before publication.
                </p>
                <div className="pt-2 text-[11px] font-mono text-sky-400">
                  ✓ Clearly Marked & Verified Schemas
                </div>
              </div>

              {/* Category 3: AI Generated Practice */}
              <div className="rounded-2xl border border-purple-800/40 bg-[#171C24] p-6 space-y-4 hover:border-purple-500 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-purple-950/60 text-purple-400 font-bold border border-purple-800/40">
                    CATEGORY C
                  </span>
                  <Cpu className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-[#F4F5F7]">AI Generated Practice</h3>
                <p className="text-xs text-[#969EAA] leading-relaxed">
                  Custom challenge questions synthesized with automated sandbox testing and duplicate prevention checks.
                </p>
                <div className="pt-2 text-[11px] font-mono text-purple-400">
                  ✓ Deterministically Sandboxed Before Publishing
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 3: PRACTICE BY TOP TECH COMPANIES */}
        {/* ------------------------------------------------------------- */}
        <section className="py-16 border-b border-[#29313D] bg-[#11151B]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#A3E635]">
                  Company Interview Hubs
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F5F7] mt-1">
                  Target Specific Company Interview Patterns
                </h2>
                <p className="text-xs text-[#969EAA] mt-1">
                  Each company tests distinct SQL idioms. Explore verified question sets and interview patterns.
                </p>
              </div>

              <a
                href="/companies"
                className="text-xs font-semibold text-[#A3E635] hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <span>View All Companies</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {COMPANIES.slice(0, 8).map((co) => (
                <a
                  key={co.id}
                  href={`/companies/${co.slug}`}
                  className="p-5 rounded-xl border border-[#29313D] bg-[#171C24] hover:border-[#A3E635]/60 hover:bg-[#1D2430] transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="h-9 w-9 rounded-lg bg-[#11151B] border border-[#29313D] flex items-center justify-center font-bold text-sm text-[#F4F5F7] group-hover:border-[#A3E635] transition-colors">
                        {co.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#11151B] text-[#969EAA] border border-[#29313D]">
                        {co.questionCount} Problems
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#F4F5F7] group-hover:text-[#A3E635] transition-colors">
                      {co.name}
                    </h3>
                    <p className="text-[11px] text-[#969EAA] mt-1 line-clamp-2 leading-relaxed">
                      {co.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#29313D] flex items-center justify-between text-[11px]">
                    <span className="text-[#64748B] font-mono">Focus:</span>
                    <span className="text-[#7C9EFF] truncate max-w-[140px] text-right font-medium">
                      {co.interviewFocus?.split(',')[0]}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 4: CONCEPT-WISE LEARNING TRACKS */}
        {/* ------------------------------------------------------------- */}
        <section className="py-16 border-b border-[#29313D] bg-[#0B0D10]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-mono uppercase tracking-wider text-[#7C9EFF]">
                Structured Mastery
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F5F7] mt-1">
                4 Specialized Preparation Tracks
              </h2>
              <p className="mt-2 text-xs text-[#969EAA]">
                From fundamental table joins to advanced analytical cohort modeling, Python, and product KPIs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* SQL Track */}
              <div className="rounded-2xl border border-[#29313D] bg-[#171C24] p-6 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-[#A3E635]/10 border border-[#A3E635]/30 flex items-center justify-center text-[#A3E635] mb-4">
                    <Terminal className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#F4F5F7]">SQL Track</h3>
                  <p className="text-xs text-[#969EAA] mt-1 leading-relaxed">
                    8 core modules: Aggregations, Joins, Subqueries, CTEs, Window Functions, and Analytical retention cohorts.
                  </p>
                </div>
                <a
                  href="/concepts"
                  className="pt-4 text-xs font-semibold text-[#A3E635] flex items-center gap-1 hover:underline"
                >
                  <span>Explore 8 Modules</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Python Track */}
              <div className="rounded-2xl border border-[#29313D] bg-[#171C24] p-6 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-[#7C9EFF]/10 border border-[#7C9EFF]/30 flex items-center justify-center text-[#7C9EFF] mb-4">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#F4F5F7]">Python & Pandas</h3>
                  <p className="text-xs text-[#969EAA] mt-1 leading-relaxed">
                    DataFrames, vectorization, missing value handling, group-by aggregations, and exploratory data analysis.
                  </p>
                </div>
                <a
                  href="/concepts/pandas-wrangling"
                  className="pt-4 text-xs font-semibold text-[#7C9EFF] flex items-center gap-1 hover:underline"
                >
                  <span>Explore Pandas Track</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Statistics Track */}
              <div className="rounded-2xl border border-[#29313D] bg-[#171C24] p-6 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#F4F5F7]">Statistics & A/B Testing</h3>
                  <p className="text-xs text-[#969EAA] mt-1 leading-relaxed">
                    P-values, hypothesis tests, sample size calculations, variance, confidence intervals, and experiment design.
                  </p>
                </div>
                <a
                  href="/concepts/ab-testing-statistics"
                  className="pt-4 text-xs font-semibold text-amber-400 flex items-center gap-1 hover:underline"
                >
                  <span>Explore Stats Track</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Data Analytics Track */}
              <div className="rounded-2xl border border-[#29313D] bg-[#171C24] p-6 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                    <Zap className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#F4F5F7]">Business & Product KPIs</h3>
                  <p className="text-xs text-[#969EAA] mt-1 leading-relaxed">
                    LTV, CAC, Gross Churn, Funnel Drop-offs, Cohort Retention Curves, and Executive Dashboard metrics.
                  </p>
                </div>
                <a
                  href="/concepts/product-metrics-kpis"
                  className="pt-4 text-xs font-semibold text-purple-400 flex items-center gap-1 hover:underline"
                >
                  <span>Explore Product Metrics</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* SECTION 5: REAL TESTIMONIALS (Clearly Marked) */}
        {/* ------------------------------------------------------------- */}
        <section className="py-16 border-b border-[#29313D] bg-[#11151B]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-mono uppercase tracking-wider text-[#A3E635]">
                Candidate Experiences
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F5F7] mt-1">
                Engineered for Serious Preparation
              </h2>
              <p className="text-xs text-[#969EAA] mt-1">
                Candidate feedback and interview preparation reports from real technical interview loops.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl border border-[#29313D] bg-[#171C24] space-y-3">
                <p className="text-xs text-[#E2E8F0] leading-relaxed">
                  &ldquo;The Meta rolling growth problem was literally asked in my second technical round last month. Having practiced the exact temporal join pattern on QueryLab made writing the CTE effortless.&rdquo;
                </p>
                <div className="border-t border-[#29313D] pt-3 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#F4F5F7]">S. Patel</span>
                  <span className="text-[#A3E635] font-mono">Meta Candidate Report</span>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-[#29313D] bg-[#171C24] space-y-3">
                <p className="text-xs text-[#E2E8F0] leading-relaxed">
                  &ldquo;Most platforms just give you the answer when you get stuck. The 3-tier progressive hint system in QueryLab gave me just enough guidance to solve the Amazon server uptime problem myself.&rdquo;
                </p>
                <div className="border-t border-[#29313D] pt-3 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#F4F5F7]">D. Kim</span>
                  <span className="text-[#7C9EFF] font-mono">Amazon BIE Candidate</span>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-[#29313D] bg-[#171C24] space-y-3">
                <p className="text-xs text-[#E2E8F0] leading-relaxed">
                  &ldquo;Executing SQL against a real in-memory PostgreSQL engine rather than regular expressions or mock strings means edge cases and data types actually matter. The best practice workspace available.&rdquo;
                </p>
                <div className="border-t border-[#29313D] pt-3 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[#F4F5F7]">M. Vance</span>
                  <span className="text-purple-400 font-mono">Analytics Engineer</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- */}
        {/* FINAL CALL TO ACTION */}
        {/* ------------------------------------------------------------- */}
        <section className="py-20 bg-gradient-to-b from-[#0B0D10] to-[#11151B] text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F4F5F7] tracking-tight">
              Ready to Master Technical SQL Interviews?
            </h2>
            <p className="text-sm sm:text-base text-[#969EAA] max-w-2xl mx-auto leading-relaxed">
              Join thousands of aspiring data analysts and engineers solving real company interview questions with real PostgreSQL execution.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href="/questions"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#A3E635] text-[#0B0D10] font-bold text-sm hover:bg-[#8ECE2B] transition-all glow-lime-sm"
              >
                Start Practicing Free
              </a>
              <a
                href="/login"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-[#29313D] bg-[#171C24] text-[#F4F5F7] font-semibold text-sm hover:border-[#3E4A5C] transition-all"
              >
                1-Click Demo Login
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
