'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Terminal, BookOpen, Building2, ArrowRight } from 'lucide-react';
import { QUESTIONS, CONCEPTS, COMPANIES } from '@/lib/data/mock-data';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandMenu({ isOpen, onClose }: CommandMenuProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredQuestions = QUESTIONS.filter(q =>
    q.title.toLowerCase().includes(query.toLowerCase()) ||
    q.category.toLowerCase().includes(query.toLowerCase()) ||
    q.problemStatement.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const filteredConcepts = CONCEPTS.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.description.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredCompanies = COMPANIES.filter(co =>
    co.name.toLowerCase().includes(query.toLowerCase()) ||
    co.industry.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const hasResults = filteredQuestions.length > 0 || filteredConcepts.length > 0 || filteredCompanies.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl rounded-2xl border border-[#29313D] bg-[#11151B] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#29313D] bg-[#171C24]">
          <Search className="h-5 w-5 text-[#969EAA] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search interview questions, SQL concepts, companies..."
            className="w-full bg-transparent text-sm text-[#F4F5F7] placeholder-[#64748B] outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
            }}
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#969EAA] hover:text-[#F4F5F7] hover:bg-[#29313D] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {!hasResults && query && (
            <div className="py-12 text-center text-sm text-[#969EAA]">
              No questions, concepts, or companies match &ldquo;{query}&rdquo;.
            </div>
          )}

          {/* Questions Section */}
          {filteredQuestions.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[11px] font-mono uppercase tracking-wider text-[#969EAA] flex items-center gap-1.5">
                <Terminal className="h-3 w-3 text-[#A3E635]" />
                <span>Interview Questions ({filteredQuestions.length})</span>
              </div>
              <div className="space-y-1">
                {filteredQuestions.map(q => (
                  <a
                    key={q.id}
                    href={`/questions/${q.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#171C24]/60 hover:bg-[#1D2430] border border-transparent hover:border-[#29313D] transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        q.difficulty === 'EASY' 
                          ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40' 
                          : q.difficulty === 'MEDIUM' 
                          ? 'text-amber-400 bg-amber-950/40 border-amber-800/40' 
                          : 'text-rose-400 bg-rose-950/40 border-rose-800/40'
                      }`}>
                        {q.difficulty}
                      </span>
                      <div>
                        <p className="text-xs font-medium text-[#F4F5F7] group-hover:text-[#A3E635] transition-colors">
                          {q.title}
                        </p>
                        <p className="text-[10px] text-[#969EAA]">
                          {q.roleTarget} • {q.acceptanceRate}% acceptance
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#969EAA] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Concepts Section */}
          {filteredConcepts.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[11px] font-mono uppercase tracking-wider text-[#969EAA] flex items-center gap-1.5">
                <BookOpen className="h-3 w-3 text-[#7C9EFF]" />
                <span>Concept Modules</span>
              </div>
              <div className="space-y-1">
                {filteredConcepts.map(c => (
                  <a
                    key={c.id}
                    href={`/concepts/${c.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#171C24]/60 hover:bg-[#1D2430] border border-transparent hover:border-[#29313D] transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#7C9EFF]/10 text-[#7C9EFF] border border-[#7C9EFF]/30">
                        {c.track}
                      </span>
                      <div>
                        <p className="text-xs font-medium text-[#F4F5F7] group-hover:text-[#7C9EFF] transition-colors">
                          {c.title}
                        </p>
                        <p className="text-[10px] text-[#969EAA] line-clamp-1">
                          {c.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-[#969EAA] opacity-0 group-hover:opacity-100 transition-all" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Companies Section */}
          {filteredCompanies.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[11px] font-mono uppercase tracking-wider text-[#969EAA] flex items-center gap-1.5">
                <Building2 className="h-3 w-3 text-[#A3E635]" />
                <span>Companies</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {filteredCompanies.map(co => (
                  <a
                    key={co.id}
                    href={`/companies/${co.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#171C24]/60 hover:bg-[#1D2430] border border-transparent hover:border-[#29313D] transition-all group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-[#F4F5F7] group-hover:text-[#A3E635]">
                        {co.name}
                      </p>
                      <p className="text-[10px] text-[#969EAA]">
                        {co.questionCount} sourced problems
                      </p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-[#969EAA] opacity-0 group-hover:opacity-100 transition-all" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[#29313D] bg-[#171C24] text-[11px] text-[#969EAA]">
          <div className="flex items-center gap-3">
            <span>Navigate: <kbd className="font-mono bg-[#11151B] px-1 py-0.5 rounded border border-[#29313D]">↑</kbd> <kbd className="font-mono bg-[#11151B] px-1 py-0.5 rounded border border-[#29313D]">↓</kbd></span>
            <span>Select: <kbd className="font-mono bg-[#11151B] px-1 py-0.5 rounded border border-[#29313D]">↵</kbd></span>
          </div>
          <span>Close: <kbd className="font-mono bg-[#11151B] px-1 py-0.5 rounded border border-[#29313D]">Esc</kbd></span>
        </div>
      </div>
    </div>
  );
}

