import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { BookOpen, Terminal, CheckCircle2, ArrowRight, ShieldCheck, Copy } from 'lucide-react';
import { mockStore } from '@/lib/store';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ConceptDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const concept = mockStore.getConceptBySlug(slug);

  if (!concept) {
    notFound();
  }

  // Get questions linked to this concept
  const relatedQuestions = mockStore.getQuestions().filter(
    (q) => q.primaryConceptId === concept.id || 
           q.primaryConceptId === `concept_${concept.slug.replace(/-/g, '_')}` ||
           q.title.toLowerCase().includes(concept.slug.replace(/-/g, ' ')) ||
           (typeof q.primaryConcept === 'string' 
             ? (q.primaryConcept as string).toLowerCase().includes(concept.title.toLowerCase())
             : q.primaryConcept?.title?.toLowerCase().includes(concept.title.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D10] text-[#F4F5F7]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Breadcrumb & Header */}
        <div className="border-b border-[#29313D] pb-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#969EAA]">
            <a href="/concepts" className="hover:text-[#F4F5F7]">Concepts</a>
            <span>/</span>
            <span className="text-[#A3E635]">{concept.track}</span>
            <span>/</span>
            <span className="text-[#F4F5F7]">{concept.title}</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#F4F5F7]">
            {concept.title}
          </h1>
          <p className="text-sm text-[#969EAA] max-w-3xl leading-relaxed">
            {concept.description}
          </p>
        </div>

        {/* Learning Objectives & Cheat Sheet */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Objectives */}
          <div className="p-6 rounded-2xl border border-[#29313D] bg-[#11151B] space-y-4">
            <h2 className="text-sm font-bold text-[#F4F5F7] flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#A3E635]" />
              <span>Core Learning Objectives</span>
            </h2>

            <ul className="space-y-2.5 text-xs text-[#E2E8F0] leading-relaxed">
              {concept.learningObjectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#A3E635] font-mono mt-0.5">•</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Syntax Cheatsheet */}
          <div className="p-6 rounded-2xl border border-[#29313D] bg-[#11151B] space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#F4F5F7] flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#7C9EFF]" />
                <span>Interactive Cheatsheet</span>
              </h2>
              <span className="text-[10px] font-mono text-[#969EAA]">PostgreSQL Syntax</span>
            </div>

            <pre className="p-4 rounded-xl bg-[#0B0D10] border border-[#29313D] font-mono text-xs text-[#A3E635] overflow-x-auto leading-relaxed">
              {concept.cheatSheet || `-- Cheatsheet coming soon`}
            </pre>
          </div>

        </div>

        {/* Practice Questions for this concept */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#F4F5F7] flex items-center gap-2">
              <Terminal className="h-4 w-4 text-[#A3E635]" />
              <span>Curated Practice Problems ({relatedQuestions.length})</span>
            </h2>
          </div>

          {relatedQuestions.length === 0 ? (
            <div className="p-8 rounded-xl border border-[#29313D] bg-[#11151B] text-center text-xs text-[#969EAA]">
              No practice questions linked directly to this concept yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedQuestions.map((q) => (
                <a
                  key={q.id}
                  href={`/questions/${q.slug}`}
                  className="p-5 rounded-xl border border-[#29313D] bg-[#11151B] hover:border-[#A3E635] hover:bg-[#171C24] transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        q.difficulty === 'EASY'
                          ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40'
                          : q.difficulty === 'MEDIUM'
                          ? 'text-amber-400 bg-amber-950/40 border-amber-800/40'
                          : 'text-rose-400 bg-rose-950/40 border-rose-800/40'
                      }`}>
                        {q.difficulty}
                      </span>
                      {q.company && (
                        <span className="text-[10px] text-[#969EAA] font-medium">
                          {q.company.name}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-[#F4F5F7] group-hover:text-[#A3E635] transition-colors">
                      {q.title}
                    </h3>
                    <p className="text-xs text-[#969EAA] line-clamp-2 leading-relaxed">
                      {q.problemStatement.replace(/###/g, '').replace(/\*\*/g, '')}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#29313D] flex items-center justify-between text-xs text-[#969EAA]">
                    <span className="flex items-center gap-1 text-[11px] text-[#A3E635]">
                      <ShieldCheck className="h-3 w-3" />
                      <span>{q.acceptanceRate}% Pass</span>
                    </span>
                    <span className="text-[#A3E635] font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Solve Now</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}

