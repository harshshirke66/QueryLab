import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Building2, ArrowRight, ShieldCheck, Terminal, Layers } from 'lucide-react';
import { COMPANIES, QUESTIONS } from '@/lib/data/mock-data';

export default function CompaniesDirectoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D10] text-[#F4F5F7]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#29313D] pb-6 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#A3E635]">
              Company-Wise Prep
            </span>
            <span className="text-xs text-[#64748B]">•</span>
            <span className="text-xs text-[#969EAA]">{COMPANIES.length} Target Companies</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#F4F5F7]">
            Company Interview Questions & Patterns
          </h1>
          <p className="text-xs sm:text-sm text-[#969EAA] max-w-2xl leading-relaxed">
            Practice actual technical interview questions asked at top technology companies. Filter by role, difficulty, and company-specific SQL evaluation benchmarks.
          </p>
        </div>

        {/* Company Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMPANIES.map((co) => {
            const coQuestions = QUESTIONS.filter(q => q.companyId === co.id);
            return (
              <a
                key={co.id}
                href={`/companies/${co.slug}`}
                className="p-6 rounded-2xl border border-[#29313D] bg-[#11151B] hover:border-[#A3E635] hover:bg-[#171C24] transition-all group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[#171C24] border border-[#29313D] flex items-center justify-center font-bold text-sm text-[#F4F5F7] group-hover:border-[#A3E635] transition-colors">
                        {co.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-[#F4F5F7] group-hover:text-[#A3E635] transition-colors">
                          {co.name}
                        </h2>
                        <span className="text-[11px] text-[#64748B]">{co.industry}</span>
                      </div>
                    </div>

                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#171C24] text-[#A3E635] border border-[#29313D]">
                      {coQuestions.length} Sourced
                    </span>
                  </div>

                  <p className="text-xs text-[#969EAA] leading-relaxed line-clamp-2">
                    {co.description}
                  </p>

                  <div className="p-2.5 rounded-lg bg-[#0B0D10] border border-[#29313D] text-[11px] space-y-1">
                    <span className="text-[#64748B] font-mono block">Primary Interview Focus:</span>
                    <span className="text-[#7C9EFF] font-medium block">
                      {co.interviewFocus}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-[#29313D] flex items-center justify-between text-xs text-[#969EAA]">
                  <span className="flex items-center gap-1 font-mono text-[11px] text-[#A3E635]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Public Source Verified</span>
                  </span>
                  <span className="text-[#F4F5F7] group-hover:text-[#A3E635] font-medium flex items-center gap-1">
                    <span>Explore Questions</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>

      </main>

      <Footer />
    </div>
  );
}

