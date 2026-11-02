'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Award, 
  Flame, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  Terminal, 
  Clock, 
  BookOpen
} from 'lucide-react';
import { ACHIEVEMENTS, QUESTIONS } from '@/lib/data/mock-data';
import { getUserProgress, subscribeToProgress, UserProgressData, DEFAULT_FALLBACK } from '@/lib/user-progress';

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<UserProgressData>(DEFAULT_FALLBACK);

  useEffect(() => {
    setMounted(true);
    setProgress(getUserProgress());
    const unsubscribe = subscribeToProgress((updated) => {
      setProgress(updated);
    });
    return unsubscribe;
  }, []);

  const user = {
    name: progress.name,
    email: progress.email,
    role: 'Candidate',
    targetRole: progress.targetRole,
    xp: progress.xp,
    solved: progress.solvedQuestions.length,
    streak: progress.currentStreak,
    memberSince: 'January 2026',
    dialect: 'PostgreSQL 16',
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D10] text-[#F4F5F7]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Profile Card */}
        <div className="p-8 rounded-2xl border border-[#29313D] bg-[#11151B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div 
              suppressHydrationWarning
              className="h-16 w-16 rounded-2xl bg-[#171C24] border border-[#29313D] flex items-center justify-center font-mono font-bold text-2xl text-[#A3E635]"
            >
              {(user.name || 'User')
                .trim()
                .split(' ')
                .filter(Boolean)
                .map((w: string) => w[0])
                .slice(0, 2)
                .join('')
                .toUpperCase() || 'QL'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 suppressHydrationWarning className="text-2xl font-bold text-[#F4F5F7]">{user.name}</h1>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                  Active Candidate
                </span>
              </div>
              <p suppressHydrationWarning className="text-xs text-[#969EAA] mt-1">{user.email}</p>
              <p suppressHydrationWarning className="text-xs text-[#7C9EFF] mt-0.5">Target: {user.targetRole}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-center">
            <div className="p-3 rounded-xl bg-[#171C24] border border-[#29313D] min-w-[80px]">
              <span suppressHydrationWarning className="text-xl font-bold font-mono text-[#A3E635] block leading-none">{user.xp}</span>
              <span className="text-[10px] text-[#969EAA] font-mono mt-1 block">Total XP</span>
            </div>
            <div className="p-3 rounded-xl bg-[#171C24] border border-[#29313D] min-w-[80px]">
              <span suppressHydrationWarning className="text-xl font-bold font-mono text-amber-400 block leading-none">{user.streak}d</span>
              <span className="text-[10px] text-[#969EAA] font-mono mt-1 block">Streak</span>
            </div>
            <div className="p-3 rounded-xl bg-[#171C24] border border-[#29313D] min-w-[80px]">
              <span suppressHydrationWarning className="text-xl font-bold font-mono text-[#F4F5F7] block leading-none">{user.solved}</span>
              <span className="text-[10px] text-[#969EAA] font-mono mt-1 block">Solved</span>
            </div>
          </div>
        </div>

        {/* Achievements & Badges Showcase */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#F4F5F7] flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              <span>Milestone Badges & Achievements</span>
            </h2>
            <span className="text-xs text-[#969EAA]">
              {ACHIEVEMENTS.length} Badges Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACHIEVEMENTS.map((ach) => (
              <div
                key={ach.id}
                className="p-5 rounded-xl border border-[#29313D] bg-[#11151B] flex items-start gap-4"
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  ach.tier === 'GOLD'
                    ? 'bg-amber-950/60 border-amber-500/50 text-amber-400'
                    : ach.tier === 'SILVER'
                    ? 'bg-slate-800 border-slate-600 text-slate-200'
                    : 'bg-[#171C24] border-[#29313D] text-[#A3E635]'
                }`}>
                  <Award className="h-5 w-5" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#F4F5F7]">{ach.title}</h3>
                    <span className="text-[10px] font-mono text-[#A3E635]">+{ach.xpReward} XP</span>
                  </div>
                  <p className="text-[11px] text-[#969EAA] leading-relaxed">
                    {ach.description}
                  </p>
                  <span className="text-[9px] font-mono uppercase text-[#64748B] block pt-1">
                    Tier: {ach.tier}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preferred Environment Settings */}
        <div className="p-6 rounded-2xl border border-[#29313D] bg-[#11151B] space-y-4">
          <h2 className="text-sm font-bold text-[#F4F5F7] flex items-center gap-2">
            <Terminal className="h-4 w-4 text-[#A3E635]" />
            <span>Developer Preferences</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-[#171C24] border border-[#29313D]">
              <span className="text-[#64748B] font-mono text-[10px] block">DEFAULT SQL DIALECT</span>
              <span className="text-[#F4F5F7] font-semibold mt-1 block">PostgreSQL 16 (Standard)</span>
            </div>
            <div className="p-3 rounded-xl bg-[#171C24] border border-[#29313D]">
              <span className="text-[#64748B] font-mono text-[10px] block">EXECUTION RUNTIME</span>
              <span className="text-[#A3E635] font-semibold mt-1 block">PGlite In-Memory WASM</span>
            </div>
            <div className="p-3 rounded-xl bg-[#171C24] border border-[#29313D]">
              <span className="text-[#64748B] font-mono text-[10px] block">AI ASSISTANT MODEL</span>
              <span className="text-[#A3E635] font-semibold mt-1 block">QueryLab Reasoning Core</span>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

