'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Flame, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Target, 
  BookOpen, 
  ArrowRight, 
  Terminal, 
  TrendingUp, 
  Building2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { QUESTIONS, CONCEPTS } from '@/lib/data/mock-data';
import { getUserProgress, subscribeToProgress, UserProgressData, DEFAULT_FALLBACK } from '@/lib/user-progress';

export default function CandidateDashboard() {
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

  const safe = progress || DEFAULT_FALLBACK;

  // Compute live activity heatmap (last 16 weeks / 112 days)
  const today = new Date();
  const heatmapDays = [];
  const safeSubmissions = Array.isArray(safe.submissions) ? safe.submissions : [];
  const safeActivityDates = Array.isArray(safe.activityDates) ? safe.activityDates : [];

  for (let i = 111; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const subCount = safeSubmissions.filter(s => s.timestamp && s.timestamp.startsWith(dateStr)).length;
    const hasActivity = subCount > 0 || safeActivityDates.includes(dateStr);
    const finalCount = subCount > 0 ? subCount : (hasActivity ? 1 : 0);

    heatmapDays.push({
      date: dateStr,
      active: hasActivity,
      count: finalCount,
    });
  }

  // Live metrics
  const totalQuestions = QUESTIONS.length;
  const solvedCount = safe.solvedQuestions?.length || 0;
  const percentCompleted = totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0;
  
  const totalSubmissions = safeSubmissions.length;
  const passedSubmissions = safeSubmissions.filter(s => s.passed).length;
  const accuracyRate = totalSubmissions > 0 
    ? ((passedSubmissions / totalSubmissions) * 100).toFixed(1) + '%' 
    : '--';

  const practiceHours = totalSubmissions > 0 
    ? Math.max(0.1, +(totalSubmissions * 0.15).toFixed(1)) 
    : '0.0';

  // Dynamic next unsolved question
  const nextUnsolved = QUESTIONS.find(q => !(safe.solvedQuestions || []).includes(q.id)) || QUESTIONS[0];
  const recommendedQuestions = QUESTIONS.filter(q => !(safe.solvedQuestions || []).includes(q.id)).slice(0, 3);
  const displayRecommended = recommendedQuestions.length > 0 ? recommendedQuestions : QUESTIONS.slice(0, 3);

  // Dynamic FAANG readiness score (0-100 based on verified submissions & solved count)
  const readinessScore = Math.min(
    100, 
    Math.round((solvedCount / Math.max(1, totalQuestions)) * 75) + ((safe.xp || 0) >= 100 ? 15 : (safe.xp || 0) > 0 ? 10 : 0) + ((safe.currentStreak || 0) >= 3 ? 10 : 0)
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D10] text-[#F4F5F7]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-[#29313D] bg-gradient-to-r from-[#171C24] via-[#11151B] to-[#171C24]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono text-[#A3E635] uppercase font-semibold">
                Candidate Dashboard
              </span>
              <span className="text-[#64748B]">•</span>
              <span suppressHydrationWarning className="text-xs text-[#969EAA]">Target: {safe.targetRole || 'Data Analyst'}</span>
            </div>
            <h1 suppressHydrationWarning className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F4F5F7]">
              Welcome back, {safe.name || 'Candidate'}
            </h1>
            <p suppressHydrationWarning className="text-xs sm:text-sm text-[#969EAA] mt-1">
              {safe.currentStreak > 0 ? (
                <>
                  You are on a <span className="text-amber-400 font-bold">{safe.currentStreak}-day query streak</span>. {totalSubmissions > 0 ? 'Solve 1 more problem today to hit your daily goal!' : 'Solve your first problem today to build momentum!'}
                </>
              ) : (
                'Start your first SQL problem today to build your practice streak and earn XP!'
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`/questions/${nextUnsolved.slug}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A3E635] text-[#0B0D10] text-xs font-bold hover:bg-[#8ECE2B] transition-colors"
            >
              <Terminal className="h-4 w-4" />
              <span>Continue Learning</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Active Streak */}
          <div className="p-5 rounded-xl border border-[#29313D] bg-[#11151B] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#969EAA]">
              <span>Active Streak</span>
              <Flame className="h-4 w-4 text-amber-400 fill-amber-400" />
            </div>
            <p suppressHydrationWarning className="text-2xl font-extrabold text-[#F4F5F7] font-mono">
              {safe.currentStreak} <span className="text-xs font-normal text-[#969EAA]">Days</span>
            </p>
            <p suppressHydrationWarning className="text-[11px] text-[#A3E635] font-mono">
              Longest: {safe.longestStreak || safe.currentStreak} Days
            </p>
          </div>

          {/* 2. Questions Solved */}
          <div className="p-5 rounded-xl border border-[#29313D] bg-[#11151B] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#969EAA]">
              <span>Questions Solved</span>
              <CheckCircle2 className="h-4 w-4 text-[#A3E635]" />
            </div>
            <p suppressHydrationWarning className="text-2xl font-extrabold text-[#F4F5F7] font-mono">
              {solvedCount} <span className="text-xs font-normal text-[#969EAA]">/ {totalQuestions}</span>
            </p>
            <p suppressHydrationWarning className="text-[11px] text-[#969EAA]">
              {percentCompleted}% of core curriculum
            </p>
          </div>

          {/* 3. Accuracy Rate */}
          <div className="p-5 rounded-xl border border-[#29313D] bg-[#11151B] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#969EAA]">
              <span>Accuracy Rate</span>
              <TrendingUp className="h-4 w-4 text-[#7C9EFF]" />
            </div>
            <p suppressHydrationWarning className="text-2xl font-extrabold text-[#F4F5F7] font-mono">
              {accuracyRate}
            </p>
            <p suppressHydrationWarning className="text-[11px] text-[#7C9EFF]">
              {totalSubmissions > 0 
                ? `${passedSubmissions} passed of ${totalSubmissions} attempts` 
                : 'Awaiting first query'}
            </p>
          </div>

          {/* 4. Total Practice Time / XP */}
          <div className="p-5 rounded-xl border border-[#29313D] bg-[#11151B] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#969EAA]">
              <span>Total Practice Time</span>
              <Clock className="h-4 w-4 text-purple-400" />
            </div>
            <p suppressHydrationWarning className="text-2xl font-extrabold text-[#F4F5F7] font-mono">
              {practiceHours} <span className="text-xs font-normal text-[#969EAA]">Hours</span>
            </p>
            <p suppressHydrationWarning className="text-[11px] text-[#A3E635] font-mono font-bold">
              {safe.xp || 0} Total XP
            </p>
          </div>

        </div>

        {/* GitHub-style Activity Heatmap */}
        <div className="p-6 rounded-2xl border border-[#29313D] bg-[#11151B] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#A3E635]" />
              <h2 className="text-sm font-bold text-[#F4F5F7]">
                Query Practice Activity (Last 16 Weeks)
              </h2>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#969EAA]">
              <span>Less</span>
              <div className="h-3 w-3 rounded-sm bg-[#171C24] border border-[#29313D]"></div>
              <div className="h-3 w-3 rounded-sm bg-[#A3E635]/30"></div>
              <div className="h-3 w-3 rounded-sm bg-[#A3E635]/70"></div>
              <div className="h-3 w-3 rounded-sm bg-[#A3E635]"></div>
              <span>More</span>
            </div>
          </div>

          {/* Grid of 16 columns x 7 rows */}
          <div className="overflow-x-auto pb-2">
            <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[640px]">
              {heatmapDays.map((d) => (
                <div
                  key={d.date}
                  title={`${d.date}: ${d.count} queries executed`}
                  className={`h-3.5 w-3.5 rounded-sm transition-all hover:scale-125 cursor-pointer ${
                    !d.active
                      ? 'bg-[#171C24] border border-[#29313D]/40'
                      : d.count >= 3
                      ? 'bg-[#A3E635] shadow-sm'
                      : d.count === 2
                      ? 'bg-[#A3E635]/70'
                      : 'bg-[#A3E635]/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Two-Column Layout: Recommended Questions & Weak Concepts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Recommended Questions */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#F4F5F7] flex items-center gap-2">
                <Target className="h-4 w-4 text-[#A3E635]" />
                <span>Recommended Next Problems</span>
              </h2>
              <a href="/questions" className="text-xs text-[#A3E635] hover:underline flex items-center gap-1">
                <span>Browse All ({totalQuestions})</span>
                <ArrowRight className="h-3 w-3" />
              </a>
            </div>

            <div className="space-y-3">
              {displayRecommended.map((q) => (
                <a
                  key={q.id}
                  href={`/questions/${q.slug}`}
                  className="flex items-center justify-between p-4 rounded-xl border border-[#29313D] bg-[#11151B] hover:bg-[#171C24] transition-all group"
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
                      <span className="text-sm font-semibold text-[#F4F5F7] group-hover:text-[#A3E635] transition-colors">
                        {q.title}
                      </span>
                      {progress.solvedQuestions.includes(q.id) && (
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">
                          ✓ Solved
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#969EAA]">
                      {q.company?.name || 'Top Tech'} • {q.roleTarget} • {q.acceptanceRate}% acceptance
                    </p>
                  </div>

                  <ArrowRight className="h-4 w-4 text-[#969EAA] group-hover:text-[#A3E635] group-hover:translate-x-1 transition-all shrink-0 ml-3" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Col: Weakest Concepts & Company Readiness */}
          <div className="space-y-6">
            
            {/* Weak Concepts */}
            <div className="p-5 rounded-2xl border border-[#29313D] bg-[#11151B] space-y-4">
              <h3 className="text-sm font-bold text-[#F4F5F7] flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#7C9EFF]" />
                <span>Core Concepts To Target</span>
              </h3>

              <div className="space-y-3">
                {CONCEPTS.slice(0, 4).map((c) => (
                  <div key={c.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#F4F5F7]">{c.title}</span>
                      <span className="font-mono text-[#969EAA]">{c.masteryPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#171C24] overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          (c.masteryPercent || 0) < 50 ? 'bg-amber-400' : 'bg-[#7C9EFF]'
                        }`}
                        style={{ width: `${c.masteryPercent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="/concepts"
                className="inline-block text-xs font-medium text-[#7C9EFF] hover:underline pt-2"
              >
                Review all concept cheat sheets →
              </a>
            </div>

            {/* Company Readiness Meter */}
            <div className="p-5 rounded-2xl border border-[#29313D] bg-[#11151B] space-y-3">
              <h3 className="text-sm font-bold text-[#F4F5F7] flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#A3E635]" />
                <span>FAANG Readiness Score</span>
              </h3>
              <p className="text-xs text-[#969EAA]">
                Calculated dynamically from passed SQL sandbox submissions across Meta, Amazon, and Google.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-2xl font-extrabold font-mono text-[#A3E635]">
                  {readinessScore} / 100
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded border ${
                  readinessScore >= 70
                    ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800'
                    : readinessScore >= 30
                    ? 'text-amber-400 bg-amber-950/60 border-amber-800'
                    : 'text-sky-400 bg-sky-950/60 border-sky-800'
                }`}>
                  {readinessScore >= 70 ? 'Interview Ready' : readinessScore >= 30 ? 'In Training' : 'Foundation Stage'}
                </span>
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
