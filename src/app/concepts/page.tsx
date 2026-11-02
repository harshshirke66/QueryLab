import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Terminal, Code2, BarChart3, Zap, ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { CONCEPTS, QUESTIONS } from '@/lib/data/mock-data';

export default function ConceptsIndexPage() {
  const sqlConcepts = CONCEPTS.filter(c => c.track === 'SQL');
  const pythonConcepts = CONCEPTS.filter(c => c.track === 'PYTHON');
  const statsConcepts = CONCEPTS.filter(c => c.track === 'STATISTICS');
  const analyticsConcepts = CONCEPTS.filter(c => c.track === 'DATA_ANALYTICS');

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D10] text-[#F4F5F7]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        
        {/* Header */}
        <div className="border-b border-[#29313D] pb-6 space-y-2">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#7C9EFF]">
            Curriculum & Learning Paths
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#F4F5F7]">
            Concept-Wise Interview Preparation
          </h1>
          <p className="text-xs sm:text-sm text-[#969EAA] max-w-2xl leading-relaxed">
            Target specific interview competencies. Each module pairs theoretical mechanics, syntax cheatsheets, and verified company interview questions.
          </p>
        </div>

        {/* 1. SQL Track (Flagship) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#A3E635]/10 border border-[#A3E635]/30 flex items-center justify-center text-[#A3E635]">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F4F5F7]">SQL Track</h2>
              <p className="text-xs text-[#969EAA]">8 Core Modules from Fundamentals to Analytical Cohort Curves</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sqlConcepts.map((c) => (
              <a
                key={c.id}
                href={`/concepts/${c.slug}`}
                className="p-5 rounded-xl border border-[#29313D] bg-[#11151B] hover:border-[#A3E635] hover:bg-[#171C24] transition-all group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] text-[#A3E635]">MODULE 0{c.order}</span>
                    <span className="text-[11px] text-[#969EAA]">
                      {Math.max(
                        c.questionCount || 0,
                        QUESTIONS.filter(q => q.primaryConceptId === c.id || q.primaryConceptId === `concept_${c.slug.replace(/-/g, '_')}`).length
                      )} Questions
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#F4F5F7] group-hover:text-[#A3E635] transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs text-[#969EAA] line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#29313D] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#64748B]">Mastery: {c.masteryPercent}%</span>
                  <span className="text-[#A3E635] font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 2. Python & Pandas Track */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#7C9EFF]/10 border border-[#7C9EFF]/30 flex items-center justify-center text-[#7C9EFF]">
              <Code2 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F4F5F7]">Python & Pandas Track</h2>
              <p className="text-xs text-[#969EAA]">DataFrame manipulation, vectorization, and data cleaning</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pythonConcepts.map((c) => (
              <a
                key={c.id}
                href={`/concepts/${c.slug}`}
                className="p-5 rounded-xl border border-[#29313D] bg-[#11151B] hover:border-[#7C9EFF] hover:bg-[#171C24] transition-all group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="font-mono text-[10px] text-[#7C9EFF]">PYTHON MODULE</span>
                  <h3 className="text-sm font-bold text-[#F4F5F7] group-hover:text-[#7C9EFF] transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-xs text-[#969EAA] line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#29313D] flex items-center justify-between text-xs text-[#7C9EFF]">
                  <span>{c.questionCount} Exercises</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 3. Statistics & Analytics Tracks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Stats */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#F4F5F7]">Statistics & Experimentation</h2>
                <p className="text-xs text-[#969EAA]">A/B Testing, p-values, and hypothesis validation</p>
              </div>
            </div>

            <div className="space-y-3">
              {statsConcepts.map(c => (
                <a
                  key={c.id}
                  href={`/concepts/${c.slug}`}
                  className="p-4 rounded-xl border border-[#29313D] bg-[#11151B] hover:border-amber-400 block group transition-all"
                >
                  <h3 className="text-xs font-bold text-[#F4F5F7] group-hover:text-amber-400">
                    {c.title}
                  </h3>
                  <p className="text-[11px] text-[#969EAA] mt-1 line-clamp-2">
                    {c.description}
                  </p>
                </a>
              ))}
            </div>
          </section>

          {/* Analytics */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#F4F5F7]">Data Analytics & Product KPIs</h2>
                <p className="text-xs text-[#969EAA]">LTV, CAC, Churn, Funnels, and Cohorts</p>
              </div>
            </div>

            <div className="space-y-3">
              {analyticsConcepts.map(c => (
                <a
                  key={c.id}
                  href={`/concepts/${c.slug}`}
                  className="p-4 rounded-xl border border-[#29313D] bg-[#11151B] hover:border-purple-400 block group transition-all"
                >
                  <h3 className="text-xs font-bold text-[#F4F5F7] group-hover:text-purple-400">
                    {c.title}
                  </h3>
                  <p className="text-[11px] text-[#969EAA] mt-1 line-clamp-2">
                    {c.description}
                  </p>
                </a>
              ))}
            </div>
          </section>

        </div>

      </main>

      <Footer />
    </div>
  );
}

