import React from 'react';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Building2, ShieldCheck, Terminal, ArrowRight, ExternalLink } from 'lucide-react';
import { mockStore } from '@/lib/store';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CompanyProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const company = mockStore.getCompanyBySlug(slug);

  if (!company) {
    notFound();
  }

  const companyQuestions = mockStore.getQuestions().filter(q => q.companyId === company.id);

  const easyCount = companyQuestions.filter(q => q.difficulty === 'EASY').length;
  const mediumCount = companyQuestions.filter(q => q.difficulty === 'MEDIUM').length;
  const hardCount = companyQuestions.filter(q => q.difficulty === 'HARD').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D10] text-[#F4F5F7]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Breadcrumbs & Header */}
        <div className="border-b border-[#29313D] pb-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#969EAA]">
            <a href="/companies" className="hover:text-[#F4F5F7]">Companies</a>
            <span>/</span>
            <span className="text-[#A3E635]">{company.name}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-[#171C24] border border-[#29313D] flex items-center justify-center font-bold text-xl text-[#F4F5F7]">
                {company.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-extrabold tracking-tight text-[#F4F5F7]">
                    {company.name}
                  </h1>
                  <span className="text-xs px-2.5 py-0.5 rounded bg-[#171C24] text-[#969EAA] border border-[#29313D]">
                    {company.industry}
                  </span>
                </div>
                <p className="text-xs text-[#969EAA] mt-1 max-w-xl">
                  {company.description}
                </p>
              </div>
            </div>

            {/* Sourced badge */}
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl border border-[#29313D] bg-[#11151B] text-center">
                <span className="text-lg font-bold font-mono text-[#A3E635] block leading-none">
                  {companyQuestions.length}
                </span>
                <span className="text-[10px] text-[#969EAA] font-mono mt-1 block">
                  Sourced Questions
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Focus & Difficulty Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 p-6 rounded-2xl border border-[#29313D] bg-[#11151B] space-y-3">
            <h2 className="text-sm font-bold text-[#F4F5F7] flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#A3E635]" />
              <span>Interview Style & Evaluated Concepts</span>
            </h2>
            <p className="text-xs text-[#969EAA] leading-relaxed">
              Interviews at {company.name} focus heavily on:
            </p>
            <div className="p-3 rounded-xl bg-[#0B0D10] border border-[#29313D] text-xs font-mono text-[#7C9EFF]">
              {company.interviewFocus}
            </div>
            <p className="text-[11px] text-[#64748B] pt-1">
              * Note: Company names are categorized for interview exploration based on candidate interview experiences and public interview reports.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#29313D] bg-[#11151B] space-y-3">
            <h2 className="text-sm font-bold text-[#F4F5F7]">
              Difficulty Mix
            </h2>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-emerald-400">
                <span>EASY:</span>
                <span>{easyCount} Questions</span>
              </div>
              <div className="flex items-center justify-between text-amber-400">
                <span>MEDIUM:</span>
                <span>{mediumCount} Questions</span>
              </div>
              <div className="flex items-center justify-between text-rose-400">
                <span>HARD:</span>
                <span>{hardCount} Questions</span>
              </div>
            </div>
          </div>

        </div>

        {/* Questions List */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-[#F4F5F7] flex items-center gap-2">
            <Terminal className="h-4 w-4 text-[#A3E635]" />
            <span>Sourced {company.name} Interview Questions ({companyQuestions.length})</span>
          </h2>

          <div className="divide-y divide-[#29313D] rounded-2xl border border-[#29313D] bg-[#11151B] overflow-hidden">
            {companyQuestions.map((q) => (
              <a
                key={q.id}
                href={`/questions/${q.slug}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-[#171C24] transition-colors group gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-[#F4F5F7] group-hover:text-[#A3E635] transition-colors">
                      {q.title}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      q.difficulty === 'EASY'
                        ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40'
                        : q.difficulty === 'MEDIUM'
                        ? 'text-amber-400 bg-amber-950/40 border-amber-800/40'
                        : 'text-rose-400 bg-rose-950/40 border-rose-800/40'
                    }`}>
                      {q.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-[#969EAA]">
                    {q.roleTarget} • {q.acceptanceRate}% acceptance rate
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-[#A3E635] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Solve in Workspace</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

