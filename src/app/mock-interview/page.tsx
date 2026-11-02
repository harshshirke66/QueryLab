'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Clock, 
  Play, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Terminal, 
  RotateCcw,
  Award,
  AlertCircle,
  Building2,
  Briefcase,
  Code2,
  Layers,
  Table as TableIcon,
  Check,
  Copy,
  BrainCircuit,
  Pause,
  AlertTriangle,
  Flame,
  Zap,
  ChevronRight
} from 'lucide-react';
import { QUESTIONS, COMPANIES } from '@/lib/data/mock-data';
import { Question } from '@/lib/types';
import FormattedMarkdown from '@/components/FormattedMarkdown';
import { recordMockInterviewProgress } from '@/lib/user-progress';
import SqlCodeEditor from '@/components/SqlCodeEditor';

// -------------------------------------------------------------
// INTERVIEW BLUEPRINT PRESETS
// -------------------------------------------------------------
interface InterviewBlueprint {
  id: string;
  name: string;
  companyName: string;
  companyId: string;
  role: string;
  durationMinutes: number;
  questionCount: number;
  difficultyFocus: 'EASY' | 'MEDIUM' | 'HARD' | 'MIXED';
  badgeColor: string;
  description: string;
  agenda: string[];
}

const BLUEPRINTS: InterviewBlueprint[] = [
  {
    id: 'meta-product-analytics',
    name: 'Meta Product Analytics Technical Screen',
    companyName: 'Meta',
    companyId: 'comp_meta',
    role: 'Product Data Scientist',
    durationMinutes: 45,
    questionCount: 3,
    difficultyFocus: 'MIXED',
    badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-950/20',
    description: 'Simulates Meta’s live technical screening: tests social graph joins, user activity metrics, and 7-day retention cohorts.',
    agenda: ['Problem 1: Relational filtering / Anti-joins', 'Problem 2: Messaging volume aggregations', 'Problem 3: Weekly cohort retention curves']
  },
  {
    id: 'amazon-bie-assessment',
    name: 'Amazon BIE Technical Assessment',
    companyName: 'Amazon',
    companyId: 'comp_amazon',
    role: 'Business Intelligence Engineer',
    durationMinutes: 45,
    questionCount: 3,
    difficultyFocus: 'MIXED',
    badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-950/20',
    description: 'Rigorous Amazon BIE screening on multi-seller marketplace listings, DENSE_RANK department rankings, and Prime SLA breach analysis.',
    agenda: ['Problem 1: Duplicate ASIN listings', 'Problem 2: DENSE_RANK department leaders', 'Problem 3: Customer peak spend chained CTE']
  },
  {
    id: 'stripe-risk-quant',
    name: 'Stripe Risk & Financial Analytics Screen',
    companyName: 'Stripe',
    companyId: 'comp_stripe',
    role: 'Risk & Fraud Quantitative Analyst',
    durationMinutes: 35,
    questionCount: 2,
    difficultyFocus: 'HARD',
    badgeColor: 'border-indigo-500/40 text-indigo-400 bg-indigo-950/20',
    description: 'High-frequency payment processing challenges: merchant dispute thresholds, chargeback percentages, and rolling 7-day cumulative spend.',
    agenda: ['Problem 1: Merchant chargeback rates & HAVING', 'Problem 2: Rolling 7-day cumulative payout volumes']
  },
  {
    id: 'uber-logistics-screen',
    name: 'Uber Operations & Logistics Screening',
    companyName: 'Uber',
    companyId: 'comp_uber',
    role: 'Operations Data Analyst',
    durationMinutes: 30,
    questionCount: 2,
    difficultyFocus: 'MEDIUM',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
    description: 'Focuses on driver idle intervals, surge multipliers, high-mileage cancellation patterns, and geospatial dispatch efficiency.',
    agenda: ['Problem 1: High-mileage cancelled rides', 'Problem 2: Driver dispatch time delta gaps via LAG']
  },
  {
    id: 'netflix-content-strategy',
    name: 'Netflix Content & Streaming Analytics',
    companyName: 'Netflix',
    companyId: 'comp_netflix',
    role: 'Senior Data Analyst',
    durationMinutes: 45,
    questionCount: 3,
    difficultyFocus: 'HARD',
    badgeColor: 'border-rose-500/40 text-rose-400 bg-rose-950/20',
    description: 'Covers streaming telemetry, month-over-month net churn, content genre distribution, and binge-watching session boundary detection.',
    agenda: ['Problem 1: Top comedy release filters', 'Problem 2: MoM net subscriber churn rate', 'Problem 3: Binge-watching sessionization']
  },
  {
    id: 'fullstack-comprehensive',
    name: 'Comprehensive Staff Analytics Simulation',
    companyName: 'All Companies',
    companyId: 'comp_all',
    role: 'Lead Analytics Engineer',
    durationMinutes: 60,
    questionCount: 4,
    difficultyFocus: 'MIXED',
    badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-950/20',
    description: 'Full-spectrum interview covering basic filters to advanced Gaps & Islands and cumulative window framing.',
    agenda: ['Warmup: Set operation / Anti-join', 'Round 2: Multi-column aggregation', 'Round 3: Window rank with ties', 'Round 4: Consecutive login streak (Gaps & Islands)']
  }
];

export default function MockInterviewPage() {
  const [stage, setStage] = useState<'SETUP' | 'TEST' | 'REPORT'>('SETUP');
  
  // Setup State
  const [selectedBlueprint, setSelectedBlueprint] = useState<InterviewBlueprint>(BLUEPRINTS[0]);
  const [customRole, setCustomRole] = useState('Data Analyst');
  const [customDuration, setCustomDuration] = useState(45);
  const [customQuestionCount, setCustomQuestionCount] = useState(3);
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Live Test State
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userQueries, setUserQueries] = useState<Record<string, string>>({});
  const [submissionStatuses, setSubmissionStatuses] = useState<Record<string, boolean>>({});
  const [executionResults, setExecutionResults] = useState<Record<string, any>>({});
  const [activeTabLeft, setActiveTabLeft] = useState<'problem' | 'schema' | 'sample' | 'expected'>('problem');
  
  // Timer State
  const [secondsRemaining, setSecondsRemaining] = useState(45 * 60);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Execution & Submission State
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmittingAll, setIsSubmittingAll] = useState(false);
  const [showConfirmFinishModal, setShowConfirmFinishModal] = useState(false);
  const [dialect, setDialect] = useState<'SQL' | 'PostgreSQL'>('SQL');

  // Load saved dialect from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('preferred_sql_dialect');
    if (saved === 'SQL' || saved === 'PostgreSQL') {
      setDialect(saved);
    }
  }, []);

  const handleDialectChange = (newDialect: 'SQL' | 'PostgreSQL') => {
    setDialect(newDialect);
    localStorage.setItem('preferred_sql_dialect', newDialect);
  };

  // Report State
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Countdown timer hook
  useEffect(() => {
    if (stage !== 'TEST' || isTimerPaused) return;

    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerFinalSubmission();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, isTimerPaused]);

  // Start Assessment with randomized questions
  const handleStartInterview = (blueprint: InterviewBlueprint) => {
    let pool = [...QUESTIONS];

    // Filter by company if blueprint has specific company
    if (blueprint.companyId !== 'comp_all') {
      const companyPool = pool.filter(q => q.companyId === blueprint.companyId);
      if (companyPool.length >= blueprint.questionCount) {
        pool = companyPool;
      }
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, isCustomMode ? customQuestionCount : blueprint.questionCount);

    setSelectedQuestions(picked);
    setActiveQuestionIndex(0);

    const initialQueries: Record<string, string> = {};
    picked.forEach(q => {
      initialQueries[q.id] = `-- PostgreSQL Query for: ${q.title} (${q.company?.name || 'Top Tech'})\n-- Target: Write an optimal query meeting all requirements below:\n\nSELECT \n  \nFROM \nWHERE \nORDER BY ;`;
    });
    setUserQueries(initialQueries);
    setSubmissionStatuses({});
    setExecutionResults({});

    const totalSec = (isCustomMode ? customDuration : blueprint.durationMinutes) * 60;
    setSecondsRemaining(totalSec);
    setElapsedSeconds(0);
    setIsTimerPaused(false);
    setStage('TEST');
  };

  // Run Query in PGlite Sandbox
  const handleRunQuery = async () => {
    const currentQ = selectedQuestions[activeQuestionIndex];
    if (!currentQ || isRunning) return;

    const userSql = (userQueries[currentQ.id] || '').trim();

    // Friendly validation: Did the candidate paste JSON output instead of writing a SQL query?
    if (userSql.startsWith('[') || userSql.startsWith('{')) {
      setExecutionResults(prev => ({
        ...prev,
        [currentQ.id]: {
          passed: false,
          errorMessage: '⚠️ You entered raw JSON output data instead of a SQL query. Please write a SQL statement (e.g. SELECT ... FROM ... WHERE ...) to query the tables and produce this output.',
        },
      }));
      setSubmissionStatuses(prev => ({
        ...prev,
        [currentQ.id]: false,
      }));
      return;
    }

    setIsRunning(true);

    try {
      const res = await fetch('/api/sql/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: currentQ.id,
          schemaSql: currentQ.schemaSql,
          seedSql: currentQ.seedSql,
          expectedOutputJson: currentQ.expectedOutputJson,
          userSql: userQueries[currentQ.id] || '',
        }),
      });

      const data = await res.json();
      setExecutionResults(prev => ({
        ...prev,
        [currentQ.id]: data,
      }));

      setSubmissionStatuses(prev => ({
        ...prev,
        [currentQ.id]: Boolean(data.passed),
      }));
    } catch (err: any) {
      setExecutionResults(prev => ({
        ...prev,
        [currentQ.id]: { passed: false, errorMessage: err.message },
      }));
    } finally {
      setIsRunning(false);
    }
  };

  // Trigger Final Submission & Request Deep AI Scorecard
  const triggerFinalSubmission = async () => {
    setShowConfirmFinishModal(false);
    setStage('REPORT');
    setIsEvaluating(true);

    const submissions = selectedQuestions.map(q => ({
      title: q.title,
      query: userQueries[q.id] || '',
      passed: Boolean(submissionStatuses[q.id]),
    }));

    try {
      const res = await fetch('/api/ai/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: isCustomMode ? customRole : selectedBlueprint.role,
          questionTitles: selectedQuestions.map(q => q.title),
          submissions,
        }),
      });
      const data = await res.json();
      setReport(data);
      recordMockInterviewProgress(data.score || 80, selectedBlueprint.companyName);
    } catch (err: any) {
      console.error(err);
      // Fallback evaluation
      const passedCount = submissions.filter(s => s.passed).length;
      const baseScore = Math.round((passedCount / Math.max(submissions.length, 1)) * 100);
      setReport({
        score: baseScore,
        grade: baseScore >= 80 ? 'Strong Hire' : baseScore >= 50 ? 'Hire' : 'Needs Practice',
        feedbackSummary: `Candidate completed ${passedCount} of ${submissions.length} problems correctly within the allotted assessment window.`,
        strengths: ['Effective schema navigation', 'Clean SQL formatting and aliasing'],
        improvements: ['Deepen mastery of analytical window framing and edge case NULL handling'],
        conceptDiagnosis: ['Window Functions', 'Multi-Stage CTEs']
      });
      recordMockInterviewProgress(baseScore, selectedBlueprint.companyName);
    } finally {
      setIsEvaluating(false);
    }
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const currentQ = selectedQuestions[activeQuestionIndex];
  const currentExec = currentQ ? executionResults[currentQ.id] : null;

  // Count answered questions
  const answeredCount = Object.values(submissionStatuses).filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D10] text-[#F4F5F7]">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* ============================================================= */}
        {/* STAGE 1: ASSESSMENT SELECTION & BLUEPRINTS */}
        {/* ============================================================= */}
        {stage === 'SETUP' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
            
            {/* Page Header */}
            <div className="text-center space-y-2 border-b border-[#29313D] pb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#171C24] border border-[#29313D] text-xs font-mono text-[#A3E635] mb-2">
                <ShieldCheck className="h-4 w-4" />
                <span>TECHNICAL INTERVIEW SIMULATION ENGINE</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F4F5F7]">
                Live Timed Technical Mock Interviews
              </h1>
              <p className="text-xs sm:text-sm text-[#969EAA] max-w-2xl mx-auto leading-relaxed">
                Experience realistic 30 to 60-minute technical interview simulations modeled directly on Meta, Amazon, Google, Stripe, and Uber candidate screenings.
              </p>
            </div>

            {/* Blueprint Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#F4F5F7] flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[#A3E635]" />
                  <span>Select Real-World Interview Blueprint:</span>
                </h2>
                <button
                  onClick={() => setIsCustomMode(!isCustomMode)}
                  className="text-xs font-mono text-[#A3E635] hover:underline"
                >
                  {isCustomMode ? '← Use Company Presets' : '+ Build Custom Simulation'}
                </button>
              </div>

              {!isCustomMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {BLUEPRINTS.map((bp) => {
                    const isSelected = selectedBlueprint.id === bp.id;
                    return (
                      <div
                        key={bp.id}
                        onClick={() => setSelectedBlueprint(bp)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                          isSelected
                            ? 'border-[#A3E635] bg-[#171C24] shadow-lg ring-1 ring-[#A3E635]/40'
                            : 'border-[#29313D] bg-[#11151B] hover:border-[#3E4A5C] hover:bg-[#171C24]/60'
                        }`}
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${bp.badgeColor}`}>
                              {bp.companyName}
                            </span>
                            <span className="text-[11px] font-mono text-[#969EAA] flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{bp.durationMinutes}m • {bp.questionCount} Qs</span>
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-[#F4F5F7] leading-snug">
                            {bp.name}
                          </h3>

                          <p className="text-xs text-[#969EAA] leading-relaxed line-clamp-2">
                            {bp.description}
                          </p>

                          {/* Agenda Preview */}
                          <div className="pt-2 border-t border-[#29313D]/60 space-y-1 text-[11px] font-mono text-[#64748B]">
                            {bp.agenda.map((ag, idx) => (
                              <p key={idx} className="truncate">• {ag}</p>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBlueprint(bp);
                            handleStartInterview(bp);
                          }}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? 'bg-[#A3E635] text-[#0B0D10] hover:bg-[#8ECE2B]'
                              : 'bg-[#171C24] text-[#F4F5F7] hover:bg-[#29313D] border border-[#29313D]'
                          }`}
                        >
                          <Play className="h-3.5 w-3.5 fill-current" />
                          <span>Start Assessment</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Custom Assessment Builder Form */
                <div className="p-6 rounded-2xl border border-[#29313D] bg-[#11151B] space-y-5 text-xs">
                  <h3 className="text-sm font-bold text-[#F4F5F7]">Configure Custom Timed Assessment</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[#969EAA] font-medium">Target Role:</label>
                      <select
                        value={customRole}
                        onChange={(e) => setCustomRole(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-[#171C24] border border-[#29313D] text-[#F4F5F7] outline-none focus:border-[#A3E635]"
                      >
                        <option value="Data Analyst">Data Analyst</option>
                        <option value="Analytics Engineer">Analytics Engineer</option>
                        <option value="Product Data Scientist">Product Data Scientist</option>
                        <option value="Business Intelligence Engineer">Business Intelligence Engineer</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[#969EAA] font-medium">Duration:</label>
                      <select
                        value={customDuration}
                        onChange={(e) => setCustomDuration(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-[#171C24] border border-[#29313D] text-[#F4F5F7] outline-none focus:border-[#A3E635]"
                      >
                        <option value={15}>15 Minutes (Express Sprint)</option>
                        <option value={30}>30 Minutes (Standard Screen)</option>
                        <option value={45}>45 Minutes (Full Round)</option>
                        <option value={60}>60 Minutes (Deep Comprehensive)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[#969EAA] font-medium">Question Count:</label>
                      <select
                        value={customQuestionCount}
                        onChange={(e) => setCustomQuestionCount(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-[#171C24] border border-[#29313D] text-[#F4F5F7] outline-none focus:border-[#A3E635]"
                      >
                        <option value={2}>2 Questions</option>
                        <option value={3}>3 Questions</option>
                        <option value={4}>4 Questions</option>
                        <option value={5}>5 Questions</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartInterview(selectedBlueprint)}
                    className="w-full py-3 rounded-xl bg-[#A3E635] text-[#0B0D10] font-bold text-xs hover:bg-[#8ECE2B] transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    <span>Launch Custom Assessment</span>
                  </button>
                </div>
              )}
            </div>

            {/* Assessment Rules & Integrity Checklist */}
            <div className="p-5 rounded-2xl border border-[#29313D] bg-[#11151B] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#969EAA]">
              <div className="flex items-start gap-2.5">
                <div className="h-6 w-6 rounded bg-[#171C24] border border-[#29313D] flex items-center justify-center text-[#A3E635] shrink-0 font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold text-[#F4F5F7]">Isolated Runtime</p>
                  <p className="text-[11px] mt-0.5">Queries execute in private in-memory PostgreSQL 16 WASM sandboxes.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="h-6 w-6 rounded bg-[#171C24] border border-[#29313D] flex items-center justify-center text-[#A3E635] shrink-0 font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold text-[#F4F5F7]">Time Strictness</p>
                  <p className="text-[11px] mt-0.5">Timer counts down continuously. Assessment auto-submits when time expires.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="h-6 w-6 rounded bg-[#171C24] border border-[#29313D] flex items-center justify-center text-[#A3E635] shrink-0 font-bold">
                  3
                </div>
                <div>
                  <p className="font-semibold text-[#F4F5F7]">AI Hiring Manager</p>
                  <p className="text-[11px] mt-0.5">Automated scoring evaluates performance, logic, and complexity.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================= */}
        {/* STAGE 2: LIVE DUAL-PANE ASSESSMENT WORKSPACE */}
        {/* ============================================================= */}
        {stage === 'TEST' && currentQ && (
          <div className="space-y-4 animate-in fade-in">
            
            {/* Top Bar: Problem Tracker, Live Timer & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-[#29313D] bg-[#11151B]">
              
              {/* Question Navigation Chips */}
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#171C24] border border-[#29313D] text-[#A3E635] font-bold whitespace-nowrap">
                  {selectedBlueprint.companyName} Screen
                </span>

                <div className="flex items-center gap-1.5">
                  {selectedQuestions.map((q, idx) => {
                    const isPassed = submissionStatuses[q.id];
                    const isActive = activeQuestionIndex === idx;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setActiveQuestionIndex(idx)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                          isActive
                            ? 'bg-[#171C24] text-[#A3E635] border border-[#A3E635]/60 font-bold shadow-sm'
                            : isPassed
                            ? 'bg-[#171C24] text-emerald-400 border border-emerald-800/40'
                            : 'bg-[#171C24] text-[#969EAA] border border-[#29313D] hover:text-[#F4F5F7]'
                        }`}
                      >
                        {isPassed ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <span className="text-[10px] text-[#64748B]">0{idx + 1}</span>
                        )}
                        <span>Problem {idx + 1}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Countdown Timer & Submit Button */}
              <div className="flex items-center gap-3 shrink-0 justify-between sm:justify-end">
                
                {/* Timer Capsule */}
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono font-bold text-xs ${
                    secondsRemaining < 300 
                      ? 'border-rose-500 bg-rose-950/60 text-rose-400 animate-pulse' 
                      : secondsRemaining < 600
                      ? 'border-amber-500 bg-amber-950/40 text-amber-400'
                      : 'border-[#29313D] bg-[#171C24] text-[#F4F5F7]'
                  }`}>
                    <Clock className="h-3.5 w-3.5 text-[#A3E635]" />
                    <span>{formatTimer(secondsRemaining)}</span>
                  </div>

                  <button
                    onClick={() => setIsTimerPaused(!isTimerPaused)}
                    title={isTimerPaused ? 'Resume Timer' : 'Pause Timer'}
                    className="p-1.5 rounded-lg border border-[#29313D] bg-[#171C24] text-[#969EAA] hover:text-[#F4F5F7]"
                  >
                    {isTimerPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                  </button>
                </div>

                {/* Submit Assessment Button */}
                <button
                  onClick={() => setShowConfirmFinishModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>Finish & Submit</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>

            {/* Confirmation Modal */}
            {showConfirmFinishModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0D10]/80 backdrop-blur-sm p-4">
                <div className="max-w-md w-full rounded-2xl border border-[#29313D] bg-[#11151B] p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
                  <div className="flex items-center gap-2 text-amber-400">
                    <AlertTriangle className="h-5 w-5" />
                    <h3 className="font-bold text-sm text-[#F4F5F7]">Finish Assessment Now?</h3>
                  </div>

                  <p className="text-xs text-[#969EAA] leading-relaxed">
                    You have verified <span className="font-bold text-[#A3E635]">{answeredCount} of {selectedQuestions.length}</span> problems. Submitting will end the timer and generate your official evaluation scorecard.
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowConfirmFinishModal(false)}
                      className="px-3.5 py-2 rounded-lg border border-[#29313D] bg-[#171C24] text-xs font-medium text-[#969EAA] hover:text-[#F4F5F7]"
                    >
                      Keep Working
                    </button>
                    <button
                      onClick={triggerFinalSubmission}
                      className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                    >
                      Yes, Submit All
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Dual-Pane Editor & Problem Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch min-h-[580px]">
              
              {/* LEFT COLUMN: PROBLEM & SCHEMA EXPLORER (5 cols) */}
              <div className="lg:col-span-5 flex flex-col rounded-2xl border border-[#29313D] bg-[#11151B] overflow-hidden">
                
                {/* Tabs Header */}
                <div className="flex items-center gap-1 px-3 border-b border-[#29313D] bg-[#171C24] text-xs">
                  {[
                    { id: 'problem', label: 'Problem' },
                    { id: 'schema', label: 'Schema DDL' },
                    { id: 'sample', label: 'Sample Data' },
                    { id: 'expected', label: 'Expected Output' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTabLeft(tab.id as any)}
                      className={`py-2.5 px-2.5 font-medium border-b-2 text-xs transition-colors whitespace-nowrap ${
                        activeTabLeft === tab.id
                          ? 'border-[#A3E635] text-[#A3E635] font-semibold'
                          : 'border-transparent text-[#969EAA] hover:text-[#F4F5F7]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Contents */}
                <div className="p-5 flex-1 overflow-y-auto max-h-[540px] space-y-4 text-xs text-[#E2E8F0] leading-relaxed">
                  
                  {/* TAB 1: PROBLEM STATEMENT */}
                  {activeTabLeft === 'problem' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          currentQ.difficulty === 'EASY'
                            ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40'
                            : currentQ.difficulty === 'MEDIUM'
                            ? 'text-amber-400 bg-amber-950/40 border-amber-800/40'
                            : 'text-rose-400 bg-rose-950/40 border-rose-800/40'
                        }`}>
                          {currentQ.difficulty}
                        </span>
                        <span className="text-[11px] font-mono text-[#969EAA]">
                          {currentQ.company?.name || 'Verified Tech Question'}
                        </span>
                      </div>

                      <h2 className="text-base font-bold text-[#F4F5F7]">
                        {currentQ.title}
                      </h2>

                      <div className="font-sans text-xs space-y-2 text-[#E2E8F0]">
                        <FormattedMarkdown content={currentQ.problemStatement} />
                      </div>
                    </div>
                  )}

                  {/* TAB 2: SCHEMA DDL */}
                  {activeTabLeft === 'schema' && (
                    <div className="space-y-2">
                      <p className="text-[11px] font-mono text-[#969EAA]">PostgreSQL Schema DDL:</p>
                      <pre className="p-3 rounded-xl bg-[#0B0D10] border border-[#29313D] text-[11px] font-mono text-[#A3E635] overflow-x-auto leading-relaxed">
                        {currentQ.schemaSql}
                      </pre>
                    </div>
                  )}

                  {/* TAB 3: SAMPLE DATA */}
                  {activeTabLeft === 'sample' && (
                    <div className="space-y-2">
                      <p className="text-[11px] font-mono text-[#969EAA]">Mock Data Seed Queries:</p>
                      <pre className="p-3 rounded-xl bg-[#0B0D10] border border-[#29313D] text-[11px] font-mono text-sky-300 overflow-x-auto leading-relaxed">
                        {currentQ.seedSql}
                      </pre>
                    </div>
                  )}

                  {/* TAB 4: EXPECTED OUTPUT */}
                  {activeTabLeft === 'expected' && (
                    <div className="space-y-3">
                      <div className="p-2.5 rounded-lg bg-[#171C24] border border-[#29313D] text-[11px] text-[#A3E635] flex items-center justify-between">
                        <span>💡 Target Result: Write a SQL query on the right that returns this table.</span>
                      </div>

                      {(() => {
                        try {
                          const rows = JSON.parse(currentQ.expectedOutputJson || '[]');
                          if (Array.isArray(rows) && rows.length > 0) {
                            const cols = Object.keys(rows[0]);
                            return (
                              <div className="rounded-xl border border-[#29313D] bg-[#0B0D10] overflow-hidden">
                                <div className="overflow-x-auto max-h-[340px]">
                                  <table className="w-full text-left font-mono text-[11px]">
                                    <thead className="bg-[#171C24] text-[#A3E635] border-b border-[#29313D] sticky top-0">
                                      <tr>
                                        {cols.map((col) => (
                                          <th key={col} className="px-3 py-2 font-semibold whitespace-nowrap">
                                            {col}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#29313D] text-[#E2E8F0]">
                                      {rows.map((row: any, rIdx: number) => (
                                        <tr key={rIdx} className="hover:bg-[#171C24]/50">
                                          {cols.map((col) => (
                                            <td key={col} className="px-3 py-2 whitespace-nowrap text-[#F4F5F7]">
                                              {row[col] === null ? (
                                                <span className="text-rose-400 italic">NULL</span>
                                              ) : (
                                                String(row[col])
                                              )}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                                <div className="px-3 py-1.5 bg-[#171C24] border-t border-[#29313D] text-[10px] text-[#969EAA] font-mono flex items-center justify-between">
                                  <span>{rows.length} rows in expected result</span>
                                  <span className="text-emerald-400">Target Schema Verified</span>
                                </div>
                              </div>
                            );
                          }
                        } catch (e) {}

                        return (
                          <pre className="p-3 rounded-xl bg-[#0B0D10] border border-[#29313D] text-[11px] font-mono text-[#F4F5F7] overflow-x-auto leading-relaxed">
                            {currentQ.expectedOutputJson}
                          </pre>
                        );
                      })()}
                    </div>
                  )}

                </div>

              </div>

              {/* RIGHT COLUMN: MONACO EDITOR & LIVE RESULTS (7 cols) */}
              <div className="lg:col-span-7 flex flex-col rounded-2xl border border-[#29313D] bg-[#11151B] overflow-hidden">
                
                {/* Editor Header Bar */}
                <div className="px-4 py-2 border-b border-[#29313D] bg-[#171C24] flex items-center justify-between text-xs gap-2 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-2">
                    {/* Dual Dialect Options: SQL & PostgreSQL */}
                    <div className="flex items-center bg-[#0B0D10] p-0.5 rounded-lg border border-[#29313D]">
                      <button
                        type="button"
                        onClick={() => handleDialectChange('SQL')}
                        className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-all ${
                          dialect === 'SQL'
                            ? 'bg-[#A3E635] text-[#0B0D10] font-bold shadow-sm'
                            : 'text-[#969EAA] hover:text-[#F4F5F7]'
                        }`}
                        title="Standard SQL for Data Analysis"
                      >
                        SQL
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDialectChange('PostgreSQL')}
                        className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold transition-all ${
                          dialect === 'PostgreSQL'
                            ? 'bg-[#A3E635] text-[#0B0D10] font-bold shadow-sm'
                            : 'text-[#969EAA] hover:text-[#F4F5F7]'
                        }`}
                        title="PostgreSQL 16 Engine with full Window Functions"
                      >
                        PostgreSQL
                      </button>
                    </div>

                    <span className="text-[11px] text-[#969EAA] hidden sm:inline font-mono">
                      Autosaved in Sandbox
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRunQuery}
                      disabled={isRunning}
                      className="px-4 py-1.5 rounded-lg bg-[#A3E635] text-[#0B0D10] font-bold text-xs hover:bg-[#8ECE2B] transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      {isRunning ? (
                        <div className="h-3.5 w-3.5 border-2 border-[#0B0D10] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Play className="h-3.5 w-3.5 fill-[#0B0D10]" />
                      )}
                      <span>{isRunning ? 'Running...' : 'Run & Validate'}</span>
                    </button>
                  </div>
                </div>

                {/* SQL Code Editor */}
                <div className="flex-1 min-h-[300px] border-b border-[#29313D] bg-[#0B0D10] relative flex flex-col overflow-hidden">
                  <SqlCodeEditor
                    value={userQueries[currentQ.id] || ''}
                    onChange={(val) => {
                      setUserQueries(prev => ({
                        ...prev,
                        [currentQ.id]: val || '',
                      }));
                    }}
                    onRun={handleRunQuery}
                    dialect={dialect}
                    placeholder={`-- Type your ${dialect} solution for "${currentQ.title}" below:\n\nSELECT \n  \nFROM \nWHERE \nORDER BY ;`}
                  />
                </div>

                {/* Execution Results Drawer */}
                <div className="p-4 bg-[#11151B] space-y-3 min-h-[160px] overflow-y-auto max-h-[220px]">
                  
                  {/* Status Banner */}
                  {currentExec ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2">
                          {currentExec.passed ? (
                            <span className="px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-400 font-bold border border-emerald-800 flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>TEST PASSED ✓</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded bg-rose-950/60 text-rose-300 font-bold border border-rose-800 flex items-center gap-1">
                              <XCircle className="h-3.5 w-3.5" />
                              <span>OUTPUT MISMATCH</span>
                            </span>
                          )}
                          <span className="text-[#969EAA]">
                            {currentExec.executionTimeMs}ms • {currentExec.rowCount || 0} rows returned
                          </span>
                        </div>
                      </div>

                      {/* Error or Mismatch reason */}
                      {currentExec.errorMessage && (
                        <p className="text-xs font-mono text-rose-400 bg-rose-950/30 p-2 rounded border border-rose-900/50">
                          {currentExec.errorMessage}
                        </p>
                      )}
                      {currentExec.mismatchReason && !currentExec.errorMessage && (
                        <p className="text-xs font-mono text-amber-300 bg-amber-950/30 p-2 rounded border border-amber-900/50">
                          {currentExec.mismatchReason}
                        </p>
                      )}

                      {/* Returned Table Rows */}
                      {currentExec.userRows && currentExec.userRows.length > 0 && (
                        <div className="overflow-x-auto rounded-lg border border-[#29313D]">
                          <table className="w-full text-left font-mono text-[11px]">
                            <thead className="bg-[#171C24] text-[#A3E635] border-b border-[#29313D]">
                              <tr>
                                {Object.keys(currentExec.userRows[0]).map((col) => (
                                  <th key={col} className="px-3 py-1.5 font-semibold">
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#29313D] text-[#E2E8F0]">
                              {currentExec.userRows.slice(0, 5).map((row: any, rIdx: number) => (
                                <tr key={rIdx} className="hover:bg-[#171C24]/50">
                                  {Object.values(row).map((val: any, cIdx: number) => (
                                    <td key={cIdx} className="px-3 py-1.5 whitespace-nowrap">
                                      {val === null ? <span className="text-rose-400 italic">NULL</span> : String(val)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-[#969EAA] py-4">
                      <span>Click &quot;Run &amp; Validate&quot; to execute your query inside PGlite (WASM) and compare against expected results.</span>
                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>
        )}

        {/* ============================================================= */}
        {/* STAGE 3: OFFICIAL AI ASSESSMENT SCORECARD & DEBRIEF */}
        {/* ============================================================= */}
        {stage === 'REPORT' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
            
            {isEvaluating ? (
              <div className="p-16 text-center rounded-2xl border border-[#29313D] bg-[#11151B] space-y-4">
                <div className="h-14 w-14 mx-auto rounded-2xl bg-[#171C24] border border-[#A3E635] flex items-center justify-center text-[#A3E635]">
                  <BrainCircuit className="h-7 w-7 animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-[#F4F5F7]">
                  Lead AI Hiring Manager Evaluating Assessment...
                </h2>
                <p className="text-xs text-[#969EAA] max-w-md mx-auto leading-relaxed">
                  Analyzing query syntax, execution plan performance, code cleanliness, edge cases, and candidate readiness score.
                </p>
              </div>
            ) : report ? (
              <div className="space-y-6">
                
                {/* Executive Score Banner */}
                <div className="p-8 rounded-2xl border border-[#A3E635]/40 bg-gradient-to-r from-[#171C24] via-[#11151B] to-[#171C24] space-y-5 shadow-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#A3E635] uppercase font-bold px-2 py-0.5 rounded bg-[#A3E635]/10 border border-[#A3E635]/30">
                          Official Assessment Debrief
                        </span>
                        <span className="text-xs text-[#64748B]">•</span>
                        <span className="text-xs font-mono text-[#969EAA]">
                          Time Elapsed: {formatTimer(elapsedSeconds)}
                        </span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F5F7]">
                        {selectedBlueprint.companyName} {selectedBlueprint.role} Screening
                      </h1>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <div className="text-4xl font-extrabold font-mono text-[#A3E635]">
                        {report.score} <span className="text-lg text-[#969EAA]">/ 100</span>
                      </div>
                      <p className={`text-xs font-mono font-bold mt-0.5 ${
                        report.grade === 'Strong Hire' || report.grade === 'Hire'
                          ? 'text-emerald-400'
                          : report.grade === 'Leaning Hire'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}>
                        Decision: {report.grade}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#E2E8F0] leading-relaxed border-t border-[#29313D] pt-4">
                    {report.feedbackSummary}
                  </p>
                </div>

                {/* Strengths & Improvement Plan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-[#29313D] bg-[#11151B] space-y-3">
                    <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Demonstrated Technical Strengths</span>
                    </h3>
                    <ul className="space-y-2 text-xs text-[#E2E8F0]">
                      {report.strengths?.map((s: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl border border-[#29313D] bg-[#11151B] space-y-3">
                    <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4" />
                      <span>Targeted Growth Areas</span>
                    </h3>
                    <ul className="space-y-2 text-xs text-[#E2E8F0]">
                      {report.improvements?.map((imp: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Per-Question Detailed Review */}
                <div className="p-6 rounded-2xl border border-[#29313D] bg-[#11151B] space-y-4">
                  <h3 className="text-sm font-bold text-[#F4F5F7]">Per-Problem Submission Breakdown</h3>
                  
                  <div className="space-y-3">
                    {selectedQuestions.map((q, idx) => {
                      const isPassed = submissionStatuses[q.id];
                      const userQuery = userQueries[q.id] || '';
                      return (
                        <div key={q.id} className="p-4 rounded-xl border border-[#29313D] bg-[#171C24] space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[#A3E635]">0{idx + 1}.</span>
                              <span className="font-bold text-xs text-[#F4F5F7]">{q.title}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#11151B] text-[#969EAA] border border-[#29313D]">
                                {q.difficulty}
                              </span>
                            </div>

                            <span className={`text-[11px] font-mono font-bold flex items-center gap-1 ${
                              isPassed ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                              {isPassed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                              <span>{isPassed ? 'Passed' : 'Needs Work'}</span>
                            </span>
                          </div>

                          {/* Code Preview */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] font-mono text-[#969EAA]">
                              <span>Your Query:</span>
                              <button
                                onClick={() => copyToClipboard(userQuery, `user_${q.id}`)}
                                className="hover:text-[#A3E635] flex items-center gap-1"
                              >
                                {copiedCodeId === `user_${q.id}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                <span>{copiedCodeId === `user_${q.id}` ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                            <pre className="p-3 rounded-lg bg-[#0B0D10] border border-[#29313D] text-[11px] font-mono text-[#A3E635] overflow-x-auto">
                              {userQuery}
                            </pre>
                          </div>

                          {/* Optimal Solution Reveal */}
                          <div className="space-y-1.5 pt-1">
                            <div className="flex items-center justify-between text-[11px] font-mono text-[#969EAA]">
                              <span className="text-[#A3E635]">Optimal Verified Solution:</span>
                              <button
                                onClick={() => copyToClipboard(q.solutionSql, `sol_${q.id}`)}
                                className="hover:text-[#A3E635] flex items-center gap-1"
                              >
                                {copiedCodeId === `sol_${q.id}` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                <span>{copiedCodeId === `sol_${q.id}` ? 'Copied' : 'Copy Solution'}</span>
                              </button>
                            </div>
                            <pre className="p-3 rounded-lg bg-[#0B0D10] border border-[#29313D] text-[11px] font-mono text-sky-300 overflow-x-auto">
                              {q.solutionSql}
                            </pre>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action CTAs */}
                <div className="flex items-center justify-between p-4 rounded-2xl border border-[#29313D] bg-[#11151B]">
                  <button
                    onClick={() => setStage('SETUP')}
                    className="px-5 py-2.5 rounded-xl border border-[#29313D] bg-[#171C24] text-xs font-bold text-[#F4F5F7] hover:border-[#A3E635] transition-all flex items-center gap-2"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Retake Mock Interview</span>
                  </button>

                  <Link
                    href="/dashboard"
                    className="px-6 py-2.5 rounded-xl bg-[#A3E635] text-[#0B0D10] text-xs font-bold hover:bg-[#8ECE2B] transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Back to Dashboard</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

              </div>
            ) : null}

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
