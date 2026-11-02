'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { 
  Play, 
  Send, 
  RotateCcw, 
  BrainCircuit, 
  Code2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Table as TableIcon, 
  HelpCircle, 
  BookOpen, 
  ExternalLink, 
  ShieldCheck, 
  Layers, 
  Lightbulb, 
  Copy, 
  Check, 
  Cpu, 
  Lock, 
  Unlock 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question } from '@/lib/types';
import FormattedMarkdown from './FormattedMarkdown';
import { recordSolvedQuestion } from '@/lib/user-progress';
import SqlCodeEditor from './SqlCodeEditor';

interface SqlWorkspaceProps {
  question: Question;
}

export default function SqlWorkspace({ question }: SqlWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<'problem' | 'schema' | 'sample' | 'expected' | 'hints' | 'solution'>('problem');
  const [resultTab, setResultTab] = useState<'output' | 'expected' | 'diff' | 'explain'>('output');

  // Query editor state (loaded from local storage or default)
  const defaultQuery = `-- Write your PostgreSQL query for "${question.title}" below:\n\nSELECT \n  \nFROM \nWHERE \nORDER BY ;`;
  const [query, setQuery] = useState(defaultQuery);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [copied, setCopied] = useState(false);

  // Execution result state
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [explainPlan, setExplainPlan] = useState<string | null>(null);

  // AI Hints state
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [aiHintText, setAiHintText] = useState<string | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  // Dialect state: 'SQL' (Standard) or 'PostgreSQL'
  const [dialect, setDialect] = useState<'SQL' | 'PostgreSQL'>('SQL');

  // Solution unlock state
  const [isSolutionUnlocked, setIsSolutionUnlocked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Load saved dialect from localStorage
  useEffect(() => {
    const savedDialect = localStorage.getItem('preferred_sql_dialect');
    if (savedDialect === 'SQL' || savedDialect === 'PostgreSQL') {
      setDialect(savedDialect);
    }
  }, []);

  const handleDialectChange = (newDialect: 'SQL' | 'PostgreSQL') => {
    setDialect(newDialect);
    localStorage.setItem('preferred_sql_dialect', newDialect);
  };

  // Load saved query from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`query_${question.id}`);
    if (saved) {
      setQuery(saved);
    }
  }, [question.id]);

  // Save query to localStorage
  const handleQueryChange = (val: string | undefined) => {
    const newQuery = val || '';
    setQuery(newQuery);
    localStorage.setItem(`query_${question.id}`, newQuery);
  };

  // Keyboard shortcut listener: Ctrl+Enter (or Cmd+Enter) to Run, Ctrl+S to Submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunQuery();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSubmitSolution();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [query]);

  // Execute User Query in PGlite
  const handleRunQuery = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setSubmissionResult(null);

    try {
      const res = await fetch('/api/sql/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          schemaSql: question.schemaSql,
          seedSql: question.seedSql,
          userSql: query,
        }),
      });
      const data = await res.json();
      setExecutionResult(data);
      setResultTab('output');
    } catch (err: any) {
      setExecutionResult({
        success: false,
        errorMessage: err.message || 'Execution request failed',
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Solution for verification
  const handleSubmitSolution = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/sql/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          schemaSql: question.schemaSql,
          seedSql: question.seedSql,
          userSql: query,
          expectedOutputJson: question.expectedOutputJson,
        }),
      });
      const data = await res.json();
      setSubmissionResult(data);
      setExecutionResult({
        success: data.passed,
        rows: data.userRows,
        fields: data.fields,
        executionTimeMs: data.executionTimeMs,
        errorMessage: data.errorMessage,
      });

      // Record in live progress manager (Awards XP, advances streak, logs submission)
      recordSolvedQuestion(
        question.id,
        question.title,
        question.difficulty,
        question.category,
        data.executionTimeMs || 12,
        Boolean(data.passed)
      );

      if (data.passed) {
        setIsSolutionUnlocked(true);
        setResultTab('output');
        // Confetti celebration!
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#A3E635', '#7C9EFF', '#FFFFFF'],
        });
      } else {
        setResultTab('diff');
      }
    } catch (err: any) {
      setSubmissionResult({
        passed: false,
        errorMessage: err.message || 'Submission failed',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Run EXPLAIN query plan
  const handleExplainPlan = async () => {
    if (isExplaining) return;
    setIsExplaining(true);

    try {
      const res = await fetch('/api/sql/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          userSql: query,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setExplainPlan(data.plan);
        setResultTab('explain');
      } else {
        setExplainPlan(`Error generating execution plan: ${data.errorMessage}`);
        setResultTab('explain');
      }
    } catch (err: any) {
      setExplainPlan(`Explain failed: ${err.message}`);
      setResultTab('explain');
    } finally {
      setIsExplaining(false);
    }
  };

  // Request progressive AI Hint
  const handleRequestHint = async (level: number) => {
    setIsLoadingHint(true);
    setHintLevel(level);

    try {
      const res = await fetch('/api/ai/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          currentQuery: query,
          hintLevel: level,
        }),
      });
      const data = await res.json();
      setAiHintText(data.hint);
    } catch (err: any) {
      setAiHintText('Could not generate AI hint at this time.');
    } finally {
      setIsLoadingHint(false);
    }
  };

  // Reset Query
  const handleReset = () => {
    if (confirm('Reset your editor to the original template?')) {
      setQuery(defaultQuery);
      localStorage.removeItem(`query_${question.id}`);
      setExecutionResult(null);
      setSubmissionResult(null);
    }
  };

  // Toggle Bookmark
  const handleToggleBookmark = async () => {
    try {
      const res = await fetch('/api/bookmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: question.id }),
      });
      const data = await res.json();
      if (data.success) {
        setIsBookmarked(data.isBookmarked);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Parse expected output rows
  let expectedRows: any[] = [];
  try {
    expectedRows = JSON.parse(question.expectedOutputJson);
  } catch {
    expectedRows = [];
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-[#0B0D10]">
      
      {/* ------------------------------------------------------------- */}
      {/* LEFT PANEL: Problem Details, Schema, Hints, Solutions */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full lg:w-[48%] flex flex-col border-r border-[#29313D] bg-[#11151B] h-full overflow-hidden">
        
        {/* Header Metadata */}
        <div className="p-4 border-b border-[#29313D] bg-[#171C24]">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Difficulty */}
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                question.difficulty === 'EASY'
                  ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40'
                  : question.difficulty === 'MEDIUM'
                  ? 'text-amber-400 bg-amber-950/40 border-amber-800/40'
                  : 'text-rose-400 bg-rose-950/40 border-rose-800/40'
              }`}>
                {question.difficulty}
              </span>

              {/* Verification Status */}
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 ${
                question.verificationStatus === 'VERIFIED_REAL'
                  ? 'text-[#A3E635] bg-[#A3E635]/10 border-[#A3E635]/30'
                  : question.verificationStatus === 'COMMUNITY_REPORTED'
                  ? 'text-sky-400 bg-sky-950/40 border-sky-800/40'
                  : 'text-purple-400 bg-purple-950/40 border-purple-800/40'
              }`}>
                <ShieldCheck className="h-3 w-3" />
                <span>
                  {question.verificationStatus === 'VERIFIED_REAL'
                    ? 'Verified Real Interview'
                    : question.verificationStatus === 'COMMUNITY_REPORTED'
                    ? 'Community Reported'
                    : 'AI Generated Practice'}
                </span>
              </span>

              {/* Company Tag */}
              {question.company && (
                <span className="text-[10px] font-medium text-[#969EAA] px-2 py-0.5 rounded bg-[#11151B] border border-[#29313D]">
                  {question.company.name}
                </span>
              )}

              {/* Target Role */}
              <span className="text-[10px] text-[#64748B]">
                • {question.roleTarget}
              </span>
            </div>

            {/* Bookmark button */}
            <button
              onClick={handleToggleBookmark}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                isBookmarked
                  ? 'border-[#A3E635] text-[#A3E635] bg-[#A3E635]/10'
                  : 'border-[#29313D] text-[#969EAA] hover:text-[#F4F5F7] bg-[#11151B]'
              }`}
              title="Bookmark Question"
            >
              ★
            </button>
          </div>

          <h1 className="text-lg font-bold text-[#F4F5F7] tracking-tight">
            {question.title}
          </h1>

          {/* Sourced Reference Link */}
          {question.sourceUrl && (
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#969EAA]">
              <span>Verified Source:</span>
              <a 
                href={question.sourceUrl} 
                target="_blank" 
                rel="noreferrer"
                className="text-[#7C9EFF] hover:underline flex items-center gap-1 font-mono text-[10px]"
              >
                <span>{question.sourceType || 'Public Interview Report'}</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-3 border-b border-[#29313D] bg-[#11151B] overflow-x-auto text-xs">
          {[
            { id: 'problem', label: 'Problem Statement', icon: BookOpen },
            { id: 'schema', label: 'Schema', icon: Layers },
            { id: 'sample', label: 'Sample Data', icon: TableIcon },
            { id: 'expected', label: 'Expected Output', icon: CheckCircle2 },
            { id: 'hints', label: 'AI Hints', icon: Lightbulb },
            { id: 'solution', label: 'Solution', icon: Code2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 py-2.5 px-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#A3E635] text-[#A3E635]'
                  : 'border-transparent text-[#969EAA] hover:text-[#F4F5F7]'
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs leading-relaxed text-[#F4F5F7]">
          
          {/* TAB 1: PROBLEM STATEMENT */}
          {activeTab === 'problem' && (
            <div className="space-y-4">
              <div className="text-xs leading-relaxed font-sans text-[#E2E8F0]">
                <FormattedMarkdown content={question.problemStatement} />
              </div>

              <div className="rounded-lg border border-[#29313D] bg-[#171C24] p-3 text-[11px] space-y-1.5">
                <p className="font-semibold text-[#F4F5F7] flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 text-[#A3E635]" />
                  <span>Execution Sandbox:</span>
                </p>
                <p className="text-[#969EAA]">
                  Your query executes inside an isolated in-memory PostgreSQL engine (PGlite WebAssembly). You have full access to standard PostgreSQL aggregations, window functions, and CTEs.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: SCHEMA DEFINITIONS */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#A3E635] mb-2">
                  Database Tables & Types (PostgreSQL)
                </h3>
                <pre className="p-3 rounded-lg bg-[#0B0D10] border border-[#29313D] font-mono text-[11px] text-[#A3E635] overflow-x-auto">
                  {question.schemaSql}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: SAMPLE DATA */}
          {activeTab === 'sample' && (
            <div className="space-y-4">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#7C9EFF] mb-2">
                Sample Seed Records
              </h3>
              <pre className="p-3 rounded-lg bg-[#0B0D10] border border-[#29313D] font-mono text-[11px] text-sky-300 overflow-x-auto">
                {question.seedSql}
              </pre>
            </div>
          )}

          {/* TAB 4: EXPECTED OUTPUT */}
          {activeTab === 'expected' && (
            <div className="space-y-3">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#F4F5F7] mb-2">
                Target Result Table ({expectedRows.length} rows)
              </h3>
              {expectedRows.length > 0 ? (
                <div className="rounded-lg border border-[#29313D] overflow-hidden">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead className="bg-[#171C24] text-[#A3E635] border-b border-[#29313D]">
                      <tr>
                        {Object.keys(expectedRows[0]).map((key) => (
                          <th key={key} className="px-3 py-2 font-semibold">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#29313D] bg-[#0B0D10]">
                      {expectedRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#171C24]/50">
                          {Object.values(row).map((val: any, cIdx) => (
                            <td key={cIdx} className="px-3 py-1.5 text-[#F4F5F7]">
                              {String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-[#969EAA]">No expected output configured.</p>
              )}
            </div>
          )}

          {/* TAB 5: AI PROGRESSIVE HINTS */}
          {activeTab === 'hints' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg border border-[#29313D] bg-[#171C24]">
                <p className="font-semibold text-xs text-[#F4F5F7] mb-1 flex items-center gap-1.5">
                  <BrainCircuit className="h-3.5 w-3.5 text-[#A3E635]" />
                  <span>3-Tier Progressive AI Guidance</span>
                </p>
                <p className="text-[11px] text-[#969EAA]">
                  Uncover structured clues without spoiling the solution: from high-level relational concepts to specific PostgreSQL function guidance.
                </p>
              </div>

              {/* Hint Level Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { level: 1, title: 'Tier 1: Concept', desc: 'Relational logic' },
                  { level: 2, title: 'Tier 2: Syntax', desc: 'Function hint' },
                  { level: 3, title: 'Tier 3: Logic', desc: 'Step-by-step trace' },
                ].map((item) => (
                  <button
                    key={item.level}
                    onClick={() => handleRequestHint(item.level as any)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      hintLevel === item.level
                        ? 'border-[#A3E635] bg-[#A3E635]/10 text-[#A3E635]'
                        : 'border-[#29313D] bg-[#171C24] text-[#969EAA] hover:text-[#F4F5F7]'
                    }`}
                  >
                    <p className="font-semibold text-xs leading-none">{item.title}</p>
                    <p className="text-[10px] text-[#64748B] mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>

              {/* Hint Content Display */}
              {isLoadingHint && (
                <div className="p-4 rounded-lg border border-[#29313D] bg-[#0B0D10] text-center text-xs text-[#969EAA] animate-pulse">
                  Analyzing query for Tier {hintLevel} hint...
                </div>
              )}

              {aiHintText && !isLoadingHint && (
                <div className="p-4 rounded-lg border border-[#A3E635]/30 bg-[#A3E635]/5 text-xs text-[#F4F5F7] leading-relaxed whitespace-pre-wrap">
                  {aiHintText}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SOLUTION & EXPLANATION */}
          {activeTab === 'solution' && (
            <div className="space-y-4">
              {!isSolutionUnlocked ? (
                <div className="p-8 text-center rounded-xl border border-[#29313D] bg-[#171C24] space-y-3">
                  <div className="h-10 w-10 mx-auto rounded-full bg-[#11151B] flex items-center justify-center text-[#A3E635]">
                    <Lock className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-sm text-[#F4F5F7]">Solution Locked</h3>
                  <p className="text-xs text-[#969EAA] max-w-sm mx-auto">
                    Try submitting your query first! If you are stuck, you can unlock the official solution and comprehensive explanation below.
                  </p>
                  <button
                    onClick={() => setIsSolutionUnlocked(true)}
                    className="px-4 py-2 rounded-lg bg-[#A3E635] text-[#0B0D10] text-xs font-semibold hover:bg-[#8ECE2B] transition-colors"
                  >
                    Unlock Official Solution
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#A3E635] mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Optimal PostgreSQL Solution</span>
                    </h3>
                    <pre className="p-3 rounded-lg bg-[#0B0D10] border border-[#29313D] font-mono text-[11px] text-[#A3E635] overflow-x-auto">
                      {question.solutionSql}
                    </pre>
                  </div>

                  <div>
                    <h4 className="font-semibold text-xs text-[#F4F5F7] mb-1">
                      Step-by-Step Logic & Explanation:
                    </h4>
                    <p className="text-xs text-[#969EAA] leading-relaxed whitespace-pre-wrap">
                      {question.explanation}
                    </p>
                  </div>

                  {question.alternativeSql && (
                    <div>
                      <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#7C9EFF] mb-1">
                        Alternative Approach:
                      </h4>
                      <pre className="p-3 rounded-lg bg-[#0B0D10] border border-[#29313D] font-mono text-[11px] text-sky-300 overflow-x-auto">
                        {question.alternativeSql}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* RIGHT PANEL: Monaco SQL Editor & Execution Results */}
      {/* ------------------------------------------------------------- */}
      <div className="w-full lg:w-[52%] flex flex-col h-full overflow-hidden bg-[#0B0D10]">
        
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-[#29313D] bg-[#171C24] gap-2 flex-wrap sm:flex-nowrap">
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
                title="Standard SQL for Data Analysis (ANSI standard)"
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
                title="PostgreSQL dialect with full Window Functions & PGlite Engine"
              >
                PostgreSQL
              </button>
            </div>

            <span className="text-[11px] text-[#969EAA] hidden sm:inline font-mono">
              Autosaved
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Reset */}
            <button
              onClick={handleReset}
              className="p-1.5 rounded-md border border-[#29313D] bg-[#11151B] text-[#969EAA] hover:text-[#F4F5F7] transition-colors"
              title="Reset query"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

            {/* Explain Plan */}
            <button
              onClick={handleExplainPlan}
              disabled={isExplaining}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#29313D] bg-[#11151B] text-xs font-medium text-[#969EAA] hover:text-[#F4F5F7] transition-all"
            >
              <Cpu className="h-3.5 w-3.5 text-[#7C9EFF]" />
              <span className="hidden sm:inline">Explain</span>
            </button>

            {/* Run Query Button */}
            <button
              onClick={handleRunQuery}
              disabled={isRunning || isSubmitting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#3E4A5C] bg-[#1D2430] text-xs font-semibold text-[#F4F5F7] hover:bg-[#252E3E] transition-all"
            >
              <Play className="h-3.5 w-3.5 fill-[#F4F5F7]" />
              <span>Run</span>
              <kbd className="hidden sm:inline font-mono text-[9px] text-[#969EAA] px-1 bg-[#11151B] rounded border border-[#29313D]">
                ⌘↵
              </kbd>
            </button>

            {/* Submit Button */}
            <button
              onClick={handleSubmitSolution}
              disabled={isSubmitting || isRunning}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#A3E635] text-[#0B0D10] text-xs font-bold hover:bg-[#8ECE2B] transition-all shadow-sm"
            >
              <Send className="h-3.5 w-3.5 fill-[#0B0D10]" />
              <span>Submit</span>
            </button>
          </div>
        </div>

        {/* SQL Code Editor Container */}
        <div className="flex-1 min-h-[260px] lg:min-h-[300px] border-b border-[#29313D] relative overflow-hidden flex flex-col">
          <SqlCodeEditor
            value={query}
            onChange={handleQueryChange}
            onRun={handleRunQuery}
            onSubmit={handleSubmitSolution}
            dialect={dialect}
            placeholder={`-- Write your ${dialect} query for "${question.title}" below:\n\nSELECT * FROM ...;`}
          />
        </div>

        {/* Results & Execution Pane */}
        <div className="h-[220px] lg:h-[260px] flex flex-col bg-[#11151B]">
          
          {/* Status Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#29313D] bg-[#171C24] text-xs">
            <div className="flex items-center gap-2">
              {/* Submission / Execution Status Badge */}
              {submissionResult ? (
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold flex items-center gap-1 ${
                  submissionResult.passed
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                    : 'bg-rose-950/60 text-rose-400 border border-rose-800'
                }`}>
                  {submissionResult.passed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                  <span>{submissionResult.passed ? 'PASSED (+50 XP)' : 'WRONG ANSWER'}</span>
                </span>
              ) : executionResult ? (
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold flex items-center gap-1 ${
                  executionResult.success
                    ? 'bg-[#1D2430] text-[#A3E635] border border-[#29313D]'
                    : 'bg-rose-950/60 text-rose-400 border border-rose-800'
                }`}>
                  {executionResult.success ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                  <span>{executionResult.success ? 'Query Executed' : 'SQL Error'}</span>
                </span>
              ) : (
                <span className="text-[#969EAA] text-[11px] font-mono">
                  Ready to execute. Press Run (⌘+Enter)
                </span>
              )}

              {/* Execution Runtime */}
              {(executionResult || submissionResult) && (
                <span className="flex items-center gap-1 text-[11px] text-[#969EAA] font-mono">
                  <Clock className="h-3 w-3" />
                  <span>
                    {(executionResult?.executionTimeMs || submissionResult?.executionTimeMs || 0)}ms
                  </span>
                </span>
              )}
            </div>

            {/* Results Tab Buttons */}
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setResultTab('output')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  resultTab === 'output' ? 'bg-[#29313D] text-[#F4F5F7]' : 'text-[#969EAA] hover:text-[#F4F5F7]'
                }`}
              >
                Output {executionResult?.rows ? `(${executionResult.rows.length})` : ''}
              </button>
              <button
                onClick={() => setResultTab('expected')}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  resultTab === 'expected' ? 'bg-[#29313D] text-[#F4F5F7]' : 'text-[#969EAA] hover:text-[#F4F5F7]'
                }`}
              >
                Expected ({expectedRows.length})
              </button>
              {submissionResult && !submissionResult.passed && (
                <button
                  onClick={() => setResultTab('diff')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium text-rose-400 transition-colors ${
                    resultTab === 'diff' ? 'bg-rose-950/60 border border-rose-800' : 'hover:bg-[#1D2430]'
                  }`}
                >
                  Diff & Mismatch
                </button>
              )}
              {explainPlan && (
                <button
                  onClick={() => setResultTab('explain')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium text-[#7C9EFF] transition-colors ${
                    resultTab === 'explain' ? 'bg-[#1D2430] border border-[#29313D]' : 'hover:bg-[#1D2430]'
                  }`}
                >
                  Execution Plan
                </button>
              )}
            </div>
          </div>

          {/* Results Table Area */}
          <div className="flex-1 overflow-auto p-3 font-mono text-xs">
            
            {/* TAB: OUTPUT TABLE */}
            {resultTab === 'output' && (
              <div>
                {executionResult?.errorMessage ? (
                  <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/60 text-rose-300 font-mono text-[11px] whitespace-pre-wrap">
                    ⚠️ {executionResult.errorMessage}
                  </div>
                ) : executionResult?.rows && executionResult.rows.length > 0 ? (
                  <div className="rounded border border-[#29313D] overflow-hidden">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-[#171C24] text-[#A3E635] border-b border-[#29313D]">
                        <tr>
                          {executionResult.fields?.map((f: string) => (
                            <th key={f} className="px-3 py-1.5 font-semibold">
                              {f}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#29313D] bg-[#0B0D10]">
                        {executionResult.rows.map((row: any, rIdx: number) => (
                          <tr key={rIdx} className="hover:bg-[#171C24]/50">
                            {executionResult.fields?.map((f: string, cIdx: number) => (
                              <td key={cIdx} className="px-3 py-1 text-[#F4F5F7]">
                                {row[f] !== null && row[f] !== undefined ? String(row[f]) : 'NULL'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : executionResult?.rows && executionResult.rows.length === 0 ? (
                  <div className="text-[#969EAA] p-4 text-center">
                    Query returned 0 rows.
                  </div>
                ) : (
                  <div className="text-[#64748B] p-8 text-center text-xs">
                    Write your query and click <span className="text-[#F4F5F7] font-semibold">&ldquo;Run&rdquo;</span> or press <kbd className="bg-[#171C24] px-1.5 py-0.5 rounded border border-[#29313D] text-[#969EAA]">⌘+Enter</kbd> to inspect output.
                  </div>
                )}
              </div>
            )}

            {/* TAB: EXPECTED TABLE */}
            {resultTab === 'expected' && (
              <div className="rounded border border-[#29313D] overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#171C24] text-[#7C9EFF] border-b border-[#29313D]">
                    <tr>
                      {expectedRows[0] && Object.keys(expectedRows[0]).map((f) => (
                        <th key={f} className="px-3 py-1.5 font-semibold">
                          {f}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#29313D] bg-[#0B0D10]">
                    {expectedRows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {Object.values(row).map((val: any, cIdx) => (
                          <td key={cIdx} className="px-3 py-1 text-[#F4F5F7]">
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB: DIFF & MISMATCH */}
            {resultTab === 'diff' && submissionResult && (
              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40 text-xs space-y-2">
                <p className="font-semibold text-rose-300">
                  Mismatch Diagnosis:
                </p>
                <p className="text-rose-200">
                  {submissionResult.mismatchReason || submissionResult.errorMessage}
                </p>
                {submissionResult.diffSummary && (
                  <p className="text-[11px] text-[#969EAA] border-t border-rose-900/30 pt-1.5">
                    {submissionResult.diffSummary}
                  </p>
                )}
              </div>
            )}

            {/* TAB: EXPLAIN PLAN */}
            {resultTab === 'explain' && explainPlan && (
              <pre className="p-3 rounded bg-[#0B0D10] text-[#7C9EFF] text-[10px] leading-relaxed overflow-x-auto whitespace-pre-wrap">
                {explainPlan}
              </pre>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}

