'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SqlWorkspace from '@/components/SqlWorkspace';
import { Question } from '@/lib/types';
import { Search, ArrowRight, BrainCircuit, BookOpen, Layers } from 'lucide-react';

interface Props {
  slug: string;
}

export default function QuestionPageClientFallback({ slug }: Props) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let found: Question | null = null;

    // 1. Check recent AI generated questions in localStorage
    try {
      const recentJson = localStorage.getItem('querylab_recent_ai_questions');
      if (recentJson) {
        const recentList: Question[] = JSON.parse(recentJson);
        const match = recentList.find(
          q =>
            q.slug === slug ||
            q.id === slug ||
            (q.title && slug.includes(q.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 15)))
        );
        if (match) {
          found = match;
        }
      }
    } catch (e) {
      console.warn('Could not read recent questions from localStorage', e);
    }

    // 2. Check active question in localStorage
    if (!found) {
      try {
        const activeJson = localStorage.getItem('querylab_current_question');
        if (activeJson) {
          const currentQ: Question = JSON.parse(activeJson);
          if (currentQ.slug === slug || currentQ.id === slug) {
            found = currentQ;
          }
        }
      } catch (e) {}
    }

    // 3. If found, sync to server backend so all subsequent API calls (sql/run, etc.) succeed
    if (found) {
      setQuestion(found);
      setLoading(false);

      // Async sync to server store
      fetch('/api/questions/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(found),
      }).catch(err => console.warn('Background sync error', err));
    } else {
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0B0D10] text-[#F4F5F7]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-[#A3E635] border-t-transparent animate-spin" />
            <p className="text-xs font-mono text-[#969EAA]">Locating problem workspace...</p>
          </div>
        </main>
      </div>
    );
  }

  if (question) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0B0D10] text-[#F4F5F7]">
        <Navbar />
        <main className="flex-1 overflow-hidden">
          <SqlWorkspace question={question} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D10] text-[#F4F5F7]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-2xl bg-[#11151B] border border-[#29313D] p-8 text-center space-y-6 shadow-2xl">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-[#171C24] border border-[#29313D] flex items-center justify-center text-[#A3E635]">
            <Search className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-lg font-bold text-[#F4F5F7]">Question Not Found</h1>
            <p className="text-xs text-[#969EAA] leading-relaxed">
              We couldn&apos;t find an active problem with slug <code className="text-[#A3E635] font-mono bg-[#171C24] px-1.5 py-0.5 rounded border border-[#29313D]">{slug}</code> in your local session or bank.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/ai-assistant"
              className="w-full py-2.5 px-4 rounded-xl bg-[#A3E635] text-[#0B0D10] text-xs font-bold hover:bg-[#8ECE2B] transition-colors flex items-center justify-center gap-2"
            >
              <BrainCircuit className="h-4 w-4" />
              <span>Generate New AI Problem</span>
            </Link>

            <Link
              href="/questions"
              className="w-full py-2.5 px-4 rounded-xl bg-[#171C24] hover:bg-[#1D2430] border border-[#29313D] text-xs font-semibold text-[#F4F5F7] transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Browse 60+ Question Bank</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

