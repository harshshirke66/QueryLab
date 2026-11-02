'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Zap, 
  Flame, 
  BrainCircuit, 
  ShieldCheck, 
  Award, 
  HelpCircle, 
  Bookmark, 
  Sparkles, 
  Layers, 
  Check, 
  Copy,
  ChevronRight,
  TrendingUp,
  Cpu,
  Terminal,
  Filter
} from 'lucide-react';
import { MCQQuestion, Difficulty } from '@/lib/types';
import { MCQ_CATEGORIES, INITIAL_MCQ_BANK } from '@/lib/data/mcq-bank';
import { addXP } from '@/lib/user-progress';

export default function QuizPage() {
  // Category & Difficulty Selection
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'MIXED'>('MIXED');

  // Question State
  const [currentQuestion, setCurrentQuestion] = useState<MCQQuestion | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);

  // History & Anti-duplicate tracking (stored in localStorage)
  const [solvedHistory, setSolvedHistory] = useState<string[]>([]);
  const [questionCounter, setQuestionCounter] = useState(1);

  // Session Stats
  const [sessionStats, setSessionStats] = useState({
    totalSolved: 0,
    correctCount: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalXp: 0,
  });

  const [copiedCode, setCopiedCode] = useState(false);

  // Load history from localStorage on initial mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('querylab_mcq_solved_titles');
      if (savedHistory) {
        setSolvedHistory(JSON.parse(savedHistory));
      }
      const savedStats = localStorage.getItem('querylab_mcq_session_stats');
      if (savedStats) {
        setSessionStats(JSON.parse(savedStats));
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch or pick next question
  const fetchNextQuestion = async (
    categoryOverride?: string,
    difficultyOverride?: Difficulty | 'MIXED',
    historyOverride?: string[]
  ) => {
    setIsLoadingNext(true);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);

    const cat = categoryOverride !== undefined ? categoryOverride : selectedCategory;
    const diff = difficultyOverride !== undefined ? difficultyOverride : selectedDifficulty;
    const history = historyOverride !== undefined ? historyOverride : solvedHistory;

    try {
      const res = await fetch('/api/ai/mcq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: cat,
          difficulty: diff === 'MIXED' ? 'MEDIUM' : diff,
          excludedTitles: history,
        }),
      });

      const data = await res.json();
      if (data.success && data.question) {
        setCurrentQuestion(data.question);
      } else {
        // Fallback to random unserved bank question
        const fallback = INITIAL_MCQ_BANK.find(q => !history.includes(q.question)) || INITIAL_MCQ_BANK[0];
        setCurrentQuestion(fallback);
      }
    } catch {
      const fallback = INITIAL_MCQ_BANK[Math.floor(Math.random() * INITIAL_MCQ_BANK.length)];
      setCurrentQuestion(fallback);
    } finally {
      setIsLoadingNext(false);
    }
  };

  // Initial question load
  useEffect(() => {
    fetchNextQuestion('ALL', 'MIXED', []);
  }, []);

  // Handle Answer Submission
  const handleSubmitAnswer = () => {
    if (!selectedOptionId || !currentQuestion || isAnswerSubmitted) return;

    const isCorrect = selectedOptionId === currentQuestion.correctOptionId;
    setIsAnswerSubmitted(true);

    const newSolvedHistory = [...new Set([...solvedHistory, currentQuestion.question])];
    setSolvedHistory(newSolvedHistory);
    try {
      localStorage.setItem('querylab_mcq_solved_titles', JSON.stringify(newSolvedHistory));
    } catch {}

    const xpGained = isCorrect ? 20 : 5;
    addXP(xpGained, isCorrect ? 'Solved Data Analytics MCQ' : 'MCQ Practice Attempt');

    setSessionStats(prev => {
      const newStreak = isCorrect ? prev.currentStreak + 1 : 0;
      const newStats = {
        totalSolved: prev.totalSolved + 1,
        correctCount: prev.correctCount + (isCorrect ? 1 : 0),
        currentStreak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
        totalXp: prev.totalXp + (isCorrect ? 20 + (newStreak >= 3 ? 10 : 0) : 5),
      };
      try {
        localStorage.setItem('querylab_mcq_session_stats', JSON.stringify(newStats));
      } catch {}
      return newStats;
    });
  };

  // Move to Next Question
  const handleNext = () => {
    setQuestionCounter(prev => prev + 1);
    fetchNextQuestion();
  };

  // Category switch
  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    fetchNextQuestion(catId, selectedDifficulty);
  };

  // Reset Session
  const handleResetSession = () => {
    if (confirm('Reset your current MCQ practice score and history?')) {
      const reset = { totalSolved: 0, correctCount: 0, currentStreak: 0, bestStreak: 0, totalXp: 0 };
      setSessionStats(reset);
      setSolvedHistory([]);
      setQuestionCounter(1);
      localStorage.removeItem('querylab_mcq_solved_titles');
      localStorage.removeItem('querylab_mcq_session_stats');
      fetchNextQuestion('ALL', selectedDifficulty, []);
    }
  };

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const accuracyRate = sessionStats.totalSolved > 0 
    ? Math.round((sessionStats.correctCount / sessionStats.totalSolved) * 100) 
    : 100;

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D10] text-[#F4F5F7]">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-6">
        
        {/* Top Header & Overview */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#29313D] pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171C24] border border-[#29313D] text-[11px] font-mono text-[#A3E635]">
              <BrainCircuit className="h-3.5 w-3.5" />
              <span>UNLIMITED AI DATA ANALYTICS MCQ ENGINE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F5F7] tracking-tight">
              Adaptive Analytics MCQ Practice
            </h1>
            <p className="text-xs sm:text-sm text-[#969EAA] max-w-2xl leading-relaxed">
              Master SQL execution internals, metric decomposition, A/B testing traps, statistics, and dimensional modeling with non-repeating, AI-synthesized practice problems.
            </p>
          </div>

          {/* Reset Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleResetSession}
              className="px-3 py-1.5 rounded-lg border border-[#29313D] bg-[#11151B] text-xs font-mono text-[#969EAA] hover:text-[#F4F5F7] hover:border-[#3E4A5C] transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Session</span>
            </button>
          </div>
        </div>

        {/* Live HUD Dashboard Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-[#29313D] bg-[#11151B] flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#171C24] border border-[#29313D] flex items-center justify-center text-[#A3E635] shrink-0 font-bold">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-[#969EAA] uppercase tracking-wider">Solved</p>
              <p className="text-base font-extrabold font-mono text-[#F4F5F7]">{sessionStats.totalSolved} <span className="text-xs font-normal text-[#64748B]">Qs</span></p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#29313D] bg-[#11151B] flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#171C24] border border-[#29313D] flex items-center justify-center text-emerald-400 shrink-0 font-bold">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-[#969EAA] uppercase tracking-wider">Accuracy</p>
              <p className="text-base font-extrabold font-mono text-emerald-400">{accuracyRate}%</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#29313D] bg-[#11151B] flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#171C24] border border-[#29313D] flex items-center justify-center text-amber-400 shrink-0 font-bold">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-[#969EAA] uppercase tracking-wider">Streak</p>
              <p className="text-base font-extrabold font-mono text-amber-400">{sessionStats.currentStreak} 🔥</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#29313D] bg-[#11151B] flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#171C24] border border-[#29313D] flex items-center justify-center text-[#A3E635] shrink-0 font-bold">
              <Zap className="h-5 w-5 fill-[#A3E635]" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-[#969EAA] uppercase tracking-wider">XP Earned</p>
              <p className="text-base font-extrabold font-mono text-[#A3E635]">+{sessionStats.totalXp} XP</p>
            </div>
          </div>
        </div>

        {/* Category Pills Filter Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F4F5F7] flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-[#A3E635]" />
              <span>Select Category Track:</span>
            </span>

            {/* Difficulty Segment */}
            <div className="flex items-center gap-1 bg-[#171C24] p-1 rounded-lg border border-[#29313D] text-[11px] font-mono">
              {(['MIXED', 'EASY', 'MEDIUM', 'HARD'] as const).map(diff => (
                <button
                  key={diff}
                  onClick={() => {
                    setSelectedDifficulty(diff);
                    fetchNextQuestion(selectedCategory, diff);
                  }}
                  className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                    selectedDifficulty === diff
                      ? 'bg-[#A3E635] text-[#0B0D10]'
                      : 'text-[#969EAA] hover:text-[#F4F5F7]'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Category Badges Scrollable List */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => handleSelectCategory('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap border shrink-0 ${
                selectedCategory === 'ALL'
                  ? 'bg-[#A3E635] text-[#0B0D10] border-[#A3E635] font-bold shadow-sm'
                  : 'bg-[#11151B] text-[#969EAA] border-[#29313D] hover:border-[#3E4A5C] hover:text-[#F4F5F7]'
              }`}
            >
              🌐 All Tracks (Mixed)
            </button>

            {MCQ_CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap border shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#171C24] text-[#A3E635] border-[#A3E635] font-bold shadow-sm ring-1 ring-[#A3E635]/30'
                      : 'bg-[#11151B] text-[#969EAA] border-[#29313D] hover:border-[#3E4A5C] hover:text-[#F4F5F7]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Question Card */}
        {isLoadingNext ? (
          <div className="p-16 rounded-2xl border border-[#29313D] bg-[#11151B] text-center space-y-4 animate-in fade-in">
            <div className="h-12 w-12 mx-auto rounded-xl bg-[#171C24] border border-[#A3E635] flex items-center justify-center text-[#A3E635]">
              <Cpu className="h-6 w-6 animate-pulse" />
            </div>
            <p className="text-sm font-bold text-[#F4F5F7]">
              Synthesizing Unique Non-Repeating MCQ...
            </p>
            <p className="text-xs text-[#969EAA] max-w-sm mx-auto">
              Scanning anti-duplicate catalog and verifying distractor plausibility with our AI analytics engine.
            </p>
          </div>
        ) : currentQuestion ? (
          <div className="rounded-2xl border border-[#29313D] bg-[#11151B] p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in">
            
            {/* Question Header Meta */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#29313D] pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-[#171C24] border border-[#29313D] text-[#A3E635] font-bold">
                  {currentQuestion.categoryIcon} {currentQuestion.categoryLabel}
                </span>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                  currentQuestion.difficulty === 'EASY'
                    ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20'
                    : currentQuestion.difficulty === 'MEDIUM'
                    ? 'border-amber-500/40 text-amber-400 bg-amber-950/20'
                    : 'border-rose-500/40 text-rose-400 bg-rose-950/20'
                }`}>
                  {currentQuestion.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-[#969EAA]">
                <span>Question #{questionCounter}</span>
                <span className="text-[#64748B]">•</span>
                <span className="text-[#A3E635]">Zero Duplicates Guaranteed</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-[#F4F5F7] leading-relaxed">
                {currentQuestion.question}
              </h2>

              {/* Scenario / Code Block (If provided) */}
              {currentQuestion.scenario && (
                <div className="relative rounded-xl border border-[#29313D] bg-[#0B0D10] p-4 overflow-hidden">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#29313D]/60 text-[11px] font-mono text-[#969EAA]">
                    <span>Scenario / Code Snippet:</span>
                    <button
                      onClick={() => copyCode(currentQuestion.scenario!)}
                      className="hover:text-[#A3E635] flex items-center gap-1"
                    >
                      {copiedCode ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="font-mono text-xs text-[#A3E635] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {currentQuestion.scenario}
                  </pre>
                </div>
              )}
            </div>

            {/* 4 Interactive Options (A, B, C, D) */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isCorrect = opt.id === currentQuestion.correctOptionId;
                
                let optionStyle = 'border-[#29313D] bg-[#171C24] hover:border-[#3E4A5C] text-[#F4F5F7]';
                
                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-500';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'border-rose-500 bg-rose-950/40 text-rose-200 ring-1 ring-rose-500';
                  } else {
                    optionStyle = 'border-[#29313D] bg-[#11151B]/50 opacity-40 text-[#969EAA]';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-[#A3E635] bg-[#1D2430] text-[#F4F5F7] ring-1 ring-[#A3E635]';
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isAnswerSubmitted}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 relative ${optionStyle} ${
                      !isAnswerSubmitted ? 'cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    {/* Option Indicator Pill */}
                    <div className={`h-6 w-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 border ${
                      isAnswerSubmitted && isCorrect
                        ? 'bg-emerald-500 text-black border-emerald-400'
                        : isAnswerSubmitted && isSelected && !isCorrect
                        ? 'bg-rose-500 text-white border-rose-400'
                        : isSelected
                        ? 'bg-[#A3E635] text-[#0B0D10] border-[#A3E635]'
                        : 'bg-[#0B0D10] text-[#969EAA] border-[#29313D]'
                    }`}>
                      {opt.id}
                    </div>

                    {/* Option Text */}
                    <div className="flex-1 text-xs sm:text-sm leading-relaxed pt-0.5">
                      <span>{opt.text}</span>
                    </div>

                    {/* Feedback Badges */}
                    {isAnswerSubmitted && isCorrect && (
                      <div className="shrink-0 flex items-center gap-1 text-xs font-mono font-bold text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="hidden sm:inline">CORRECT</span>
                      </div>
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <div className="shrink-0 flex items-center gap-1 text-xs font-mono font-bold text-rose-400">
                        <XCircle className="h-4 w-4" />
                        <span className="hidden sm:inline">YOUR CHOICE</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Submit Answer Button (Before Submission) */}
            {!isAnswerSubmitted && (
              <div className="flex items-center justify-end pt-2">
                <button
                  type="button"
                  disabled={!selectedOptionId}
                  onClick={handleSubmitAnswer}
                  className="px-6 py-3 rounded-xl bg-[#A3E635] text-[#0B0D10] font-bold text-xs hover:bg-[#8ECE2B] transition-all flex items-center gap-2 shadow-sm disabled:opacity-40 disabled:hover:bg-[#A3E635]"
                >
                  <span>Submit Answer & Check Rationale</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Post-Submission Deep Debrief Drawer */}
            {isAnswerSubmitted && (
              <div className="space-y-4 pt-4 border-t border-[#29313D] animate-in fade-in">
                
                {/* Result Announcement Capsule */}
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  selectedOptionId === currentQuestion.correctOptionId
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400'
                    : 'border-rose-500/40 bg-rose-950/20 text-rose-400'
                }`}>
                  <div className="flex items-center gap-2">
                    {selectedOptionId === currentQuestion.correctOptionId ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 shrink-0" />
                    )}
                    <span className="font-bold text-sm">
                      {selectedOptionId === currentQuestion.correctOptionId
                        ? 'Correct! +20 XP Added to Your Profile'
                        : `Incorrect. The correct answer was Option (${currentQuestion.correctOptionId}).`}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-[#969EAA]">
                    Option {currentQuestion.correctOptionId}
                  </span>
                </div>

                {/* Conceptual Overview */}
                <div className="p-5 rounded-xl border border-[#29313D] bg-[#171C24] space-y-3">
                  <h3 className="text-xs font-bold text-[#A3E635] uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <BrainCircuit className="h-4 w-4" />
                    <span>Technical Architecture & Reasoning</span>
                  </h3>
                  <p className="text-xs text-[#E2E8F0] leading-relaxed">
                    {currentQuestion.explanation.whyCorrect}
                  </p>
                  
                  {/* Distractor Breakdown */}
                  <div className="space-y-2 pt-2 border-t border-[#29313D]">
                    <p className="text-[11px] font-mono font-bold text-[#969EAA]">Why other options are flawed:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      {(['A', 'B', 'C', 'D'] as const)
                        .filter(optKey => optKey !== currentQuestion.correctOptionId)
                        .map(optKey => (
                          <div key={optKey} className="p-2.5 rounded-lg bg-[#11151B] border border-[#29313D] text-[#969EAA] leading-relaxed">
                            <span className="font-bold text-[#F4F5F7]">Option {optKey}: </span>
                            <span>{currentQuestion.explanation.whyOthersIncorrect[optKey]}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Interview Pro-Tip */}
                  {currentQuestion.explanation.interviewTip && (
                    <div className="p-3 rounded-lg bg-[#A3E635]/10 border border-[#A3E635]/30 text-xs text-[#E2E8F0] flex items-start gap-2">
                      <Zap className="h-4 w-4 text-[#A3E635] shrink-0 mt-0.5 fill-[#A3E635]" />
                      <div>
                        <span className="font-bold text-[#A3E635]">Staff Interviewer Pro-Tip: </span>
                        <span>{currentQuestion.explanation.interviewTip}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Navigation CTA */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    {currentQuestion.tags?.map(tag => (
                      <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171C24] border border-[#29313D] text-[#969EAA]">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={handleNext}
                    className="px-6 py-3 rounded-xl bg-[#A3E635] text-[#0B0D10] font-bold text-xs hover:bg-[#8ECE2B] transition-all flex items-center gap-2 shadow-lg"
                  >
                    <span>Next AI Question</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

              </div>
            )}

          </div>
        ) : null}

        {/* Footer Features Banner */}
        <div className="p-5 rounded-2xl border border-[#29313D] bg-[#11151B] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#969EAA]">
          <div className="flex items-start gap-2.5">
            <div className="h-6 w-6 rounded bg-[#171C24] border border-[#29313D] flex items-center justify-center text-[#A3E635] shrink-0 font-bold">
              1
            </div>
            <div>
              <p className="font-semibold text-[#F4F5F7]">Zero-Repeat Guarantee</p>
              <p className="text-[11px] mt-0.5">Every solved question is cataloged locally to ensure you never encounter duplicate problems.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="h-6 w-6 rounded bg-[#171C24] border border-[#29313D] flex items-center justify-center text-[#A3E635] shrink-0 font-bold">
              2
            </div>
            <div>
              <p className="font-semibold text-[#F4F5F7]">Real-World Technical Nuance</p>
              <p className="text-[11px] mt-0.5">Modeled after real data questions at Meta, Google, Stripe, and Netflix with plausible distractors.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="h-6 w-6 rounded bg-[#171C24] border border-[#29313D] flex items-center justify-center text-[#A3E635] shrink-0 font-bold">
              3
            </div>
            <div>
              <p className="font-semibold text-[#F4F5F7]">Deep Explanations</p>
              <p className="text-[11px] mt-0.5">Breakdowns of all four options with staff-level interview tips for every scenario.</p>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}

