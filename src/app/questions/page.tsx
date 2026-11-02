'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Terminal, 
  Search, 
  ShieldCheck, 
  Building2, 
  Filter, 
  CheckCircle2, 
  ArrowRight, 
  Cpu,
  BookOpen
} from 'lucide-react';
import { QUESTIONS, COMPANIES, CONCEPTS } from '@/lib/data/mock-data';
import { Difficulty, VerificationStatus } from '@/lib/types';

export default function QuestionsExplorer() {
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [selectedCompany, setSelectedCompany] = useState<string>('ALL');
  const [selectedConcept, setSelectedConcept] = useState<string>('ALL');
  const [selectedVerification, setSelectedVerification] = useState<string>('ALL');

  // Filter questions
  const filteredQuestions = QUESTIONS.filter((q) => {
    // Search
    if (search.trim()) {
      const matchTitle = q.title.toLowerCase().includes(search.toLowerCase());
      const matchDesc = q.problemStatement.toLowerCase().includes(search.toLowerCase());
      const matchRole = q.roleTarget.toLowerCase().includes(search.toLowerCase());
      if (!matchTitle && !matchDesc && !matchRole) return false;
    }

    // Difficulty
    if (selectedDifficulty !== 'ALL' && q.difficulty !== selectedDifficulty) {
      return false;
    }

    // Company
    if (selectedCompany !== 'ALL') {
      if (!q.companyId || q.companyId !== selectedCompany) return false;
    }

    // Concept
    if (selectedConcept !== 'ALL') {
      if (!q.primaryConceptId || q.primaryConceptId !== selectedConcept) return false;
    }

    // Verification
    if (selectedVerification !== 'ALL' && q.verificationStatus !== selectedVerification) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D10] text-[#F4F5F7]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#29313D] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#A3E635]">
                Problem Catalog
              </span>
              <span className="text-xs text-[#64748B]">•</span>
              <span className="text-xs text-[#969EAA]">
                {QUESTIONS.length} Sourced & Verified Problems
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#F4F5F7]">
              SQL & Analytics Interview Questions
            </h1>
            <p className="text-xs sm:text-sm text-[#969EAA] mt-1.5 max-w-2xl leading-relaxed">
              Practice real SQL interview questions sourced from top technology companies. Test your queries inside our isolated PostgreSQL execution sandbox.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/ai-assistant"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-purple-800/40 bg-purple-950/20 text-xs font-medium text-purple-300 hover:border-purple-600 transition-all"
            >
              <Cpu className="h-4 w-4" />
              <span>Generate AI Practice Question</span>
            </a>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 bg-[#11151B] p-4 rounded-2xl border border-[#29313D]">
          
          {/* Search Box */}
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#969EAA]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, keywords, target roles..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#171C24] border border-[#29313D] text-xs text-[#F4F5F7] placeholder-[#64748B] outline-none focus:border-[#A3E635] transition-colors"
            />
          </div>

          {/* Concept Track Dropdown */}
          <div>
            <select
              value={selectedConcept}
              onChange={(e) => setSelectedConcept(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#171C24] border border-[#29313D] text-xs text-[#F4F5F7] outline-none focus:border-[#A3E635] transition-colors"
            >
              <option value="ALL">All Concepts</option>
              {CONCEPTS.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Dropdown */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#171C24] border border-[#29313D] text-xs text-[#F4F5F7] outline-none focus:border-[#A3E635] transition-colors"
            >
              <option value="ALL">All Difficulties</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          {/* Company Dropdown */}
          <div>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#171C24] border border-[#29313D] text-xs text-[#F4F5F7] outline-none focus:border-[#A3E635] transition-colors"
            >
              <option value="ALL">All Companies</option>
              {COMPANIES.map(co => (
                <option key={co.id} value={co.id}>{co.name}</option>
              ))}
            </select>
          </div>

          {/* Verification Dropdown */}
          <div>
            <select
              value={selectedVerification}
              onChange={(e) => setSelectedVerification(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#171C24] border border-[#29313D] text-xs text-[#F4F5F7] outline-none focus:border-[#A3E635] transition-colors"
            >
              <option value="ALL">All Verification</option>
              <option value="VERIFIED_REAL">Verified Real</option>
              <option value="COMMUNITY_REPORTED">Community Reported</option>
              <option value="AI_GENERATED">AI Generated Practice</option>
            </select>
          </div>

        </div>

        {/* Questions Table / List */}
        <div className="rounded-2xl border border-[#29313D] bg-[#11151B] overflow-hidden">
          
          <div className="px-5 py-3 border-b border-[#29313D] bg-[#171C24] flex items-center justify-between text-xs text-[#969EAA]">
            <span>Showing {filteredQuestions.length} Problems</span>
            <span className="font-mono text-[11px]">PostgreSQL 16 Engine</span>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#969EAA] space-y-3">
              <p>No questions matched your current filter criteria.</p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedDifficulty('ALL');
                  setSelectedCompany('ALL');
                  setSelectedConcept('ALL');
                  setSelectedVerification('ALL');
                }}
                className="px-4 py-2 rounded-lg bg-[#171C24] border border-[#29313D] text-[#A3E635] hover:bg-[#1D2430] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#29313D]">
              {filteredQuestions.map((q, idx) => (
                <a
                  key={q.id}
                  href={`/questions/${q.slug}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-[#171C24]/70 transition-colors group gap-4"
                >
                  {/* Left: Info */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    <span className="text-xs font-mono text-[#64748B] w-6 shrink-0">
                      {idx + 1}.
                    </span>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-[#F4F5F7] group-hover:text-[#A3E635] transition-colors">
                          {q.title}
                        </span>

                        {/* Difficulty */}
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          q.difficulty === 'EASY'
                            ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40'
                            : q.difficulty === 'MEDIUM'
                            ? 'text-amber-400 bg-amber-950/40 border-amber-800/40'
                            : 'text-rose-400 bg-rose-950/40 border-rose-800/40'
                        }`}>
                          {q.difficulty}
                        </span>

                        {/* Company Badge */}
                        {q.company && (
                          <span className="text-[10px] font-medium text-[#969EAA] px-2 py-0.5 rounded bg-[#171C24] border border-[#29313D]">
                            {q.company.name}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#969EAA] flex-wrap">
                        <span>Role: {q.roleTarget}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono text-[11px] text-[#A3E635]">
                          <ShieldCheck className="h-3 w-3" />
                          <span>
                            {q.verificationStatus === 'VERIFIED_REAL'
                              ? 'Verified Real'
                              : q.verificationStatus === 'COMMUNITY_REPORTED'
                              ? 'Community'
                              : 'AI Generated'}
                          </span>
                        </span>
                        <span>•</span>
                        <span>{q.acceptanceRate}% Acceptance</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: CTA */}
                  <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                    <span className="text-xs font-medium text-[#969EAA] group-hover:text-[#A3E635] flex items-center gap-1">
                      <span>Solve Challenge</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
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

