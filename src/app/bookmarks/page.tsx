import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Bookmark, Terminal, ArrowRight, ShieldCheck, Trash2 } from 'lucide-react';
import { mockStore } from '@/lib/store';

export default function BookmarksPage() {
  const bookmarkedQuestions = mockStore.getBookmarkedQuestions();
  // If empty, show first 2 as default demo bookmarks
  const displayList = bookmarkedQuestions.length > 0 ? bookmarkedQuestions : mockStore.getQuestions().slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D10] text-[#F4F5F7]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#29313D] pb-6 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#A3E635]">
              Saved Library
            </span>
            <span className="text-xs text-[#64748B]">•</span>
            <span className="text-xs text-[#969EAA]">{displayList.length} Questions</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#F4F5F7]">
            Bookmarked Questions & Revision Queue
          </h1>
          <p className="text-xs sm:text-sm text-[#969EAA] max-w-2xl leading-relaxed">
            Review tricky queries, custom notes, and problems saved for pre-interview revision.
          </p>
        </div>

        {/* List of bookmarks */}
        <div className="space-y-4">
          <div className="divide-y divide-[#29313D] rounded-2xl border border-[#29313D] bg-[#11151B] overflow-hidden">
            {displayList.map((q) => (
              <div
                key={q.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#171C24] transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      q.difficulty === 'EASY'
                        ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40'
                        : q.difficulty === 'MEDIUM'
                        ? 'text-amber-400 bg-amber-950/40 border-amber-800/40'
                        : 'text-rose-400 bg-rose-950/40 border-rose-800/40'
                    }`}>
                      {q.difficulty}
                    </span>
                    <a
                      href={`/questions/${q.slug}`}
                      className="text-sm font-bold text-[#F4F5F7] hover:text-[#A3E635] transition-colors"
                    >
                      {q.title}
                    </a>
                  </div>
                  <p className="text-xs text-[#969EAA]">
                    {q.company?.name || 'Top Tech'} • {q.roleTarget} • {q.acceptanceRate}% pass rate
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`/questions/${q.slug}`}
                    className="px-4 py-2 rounded-lg bg-[#171C24] border border-[#29313D] text-xs font-semibold text-[#A3E635] hover:bg-[#1D2430] flex items-center gap-1.5"
                  >
                    <span>Open in Editor</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

