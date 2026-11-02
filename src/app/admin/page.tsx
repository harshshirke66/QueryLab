'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  ShieldCheck, 
  Plus, 
  Terminal, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  BookOpen, 
  Trash2, 
  ExternalLink,
  Layers,
  BarChart3
} from 'lucide-react';
import { QUESTIONS, COMPANIES, CONCEPTS } from '@/lib/data/mock-data';
import { calculateQuestionSimilarity } from '@/lib/similarity';

export default function AdminConsolePage() {
  const [activeTab, setActiveTab] = useState<'questions' | 'add' | 'duplicates' | 'metrics'>('questions');
  const [questionsList, setQuestionsList] = useState(QUESTIONS);

  // New Question Form state
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [companyId, setCompanyId] = useState('comp_meta');
  const [problemStatement, setProblemStatement] = useState('');
  const [schemaSql, setSchemaSql] = useState('');
  const [seedSql, setSeedSql] = useState('');
  const [solutionSql, setSolutionSql] = useState('');
  const [expectedOutputJson, setExpectedOutputJson] = useState('[]');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceType, setSourceType] = useState('Public Interview Report');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Duplicate Scanner state
  const [scanTitle, setScanTitle] = useState('Facebook page zero likes');
  const [scanResults, setScanResults] = useState<any[]>([]);

  // Run Duplicate Detection Scanner
  const handleScanDuplicates = () => {
    const results = questionsList.map(q => {
      const sim = calculateQuestionSimilarity(scanTitle, q.title, '', q.problemStatement);
      return {
        question: q,
        ...sim,
      };
    }).sort((a, b) => b.totalScore - a.totalScore).slice(0, 5);

    setScanResults(results);
  };

  // Add New Question
  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const newQ: any = {
      id: `q_admin_${Date.now()}`,
      slug: `custom-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      title,
      difficulty,
      category: 'SQL',
      roleTarget: 'Data Analyst',
      problemStatement,
      schemaSql,
      seedSql,
      solutionSql,
      expectedOutputJson,
      explanation: 'Official solution verified by QueryLab admin.',
      hints: ['Review the schema', 'Check JOIN syntax'],
      verificationStatus: 'VERIFIED_REAL',
      sourceUrl,
      sourceType,
      companyId,
      acceptanceRate: 100,
      totalAttempts: 0,
      totalSolved: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setQuestionsList([newQ, ...questionsList]);
    setSuccessNotice(`Question "${title}" created and published successfully!`);
    setTitle('');
    setProblemStatement('');
    setSchemaSql('');
    setSeedSql('');
    setSolutionSql('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D10] text-[#F4F5F7]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="border-b border-[#29313D] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#A3E635]">
                Internal Control Center
              </span>
              <span className="text-xs text-[#64748B]">•</span>
              <span className="text-xs text-[#969EAA]">Role: ADMIN</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#F4F5F7]">
              Admin Question & Integrity Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#969EAA] mt-1">
              Manage question authenticity, review AI-generated challenges, run duplicate detection, and audit source links.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#171C24] p-1 rounded-xl border border-[#29313D] self-start sm:self-auto text-xs">
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'questions' ? 'bg-[#A3E635] text-[#0B0D10] font-bold' : 'text-[#969EAA] hover:text-[#F4F5F7]'
              }`}
            >
              Questions ({questionsList.length})
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'add' ? 'bg-[#A3E635] text-[#0B0D10] font-bold' : 'text-[#969EAA] hover:text-[#F4F5F7]'
              }`}
            >
              + Add Question
            </button>
            <button
              onClick={() => setActiveTab('duplicates')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'duplicates' ? 'bg-[#A3E635] text-[#0B0D10] font-bold' : 'text-[#969EAA] hover:text-[#F4F5F7]'
              }`}
            >
              Duplicate Scanner
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: QUESTIONS MANAGEMENT TABLE */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'questions' && (
          <div className="rounded-2xl border border-[#29313D] bg-[#11151B] overflow-hidden">
            <div className="p-4 border-b border-[#29313D] bg-[#171C24] flex items-center justify-between text-xs text-[#969EAA]">
              <span>Active Question Bank: {questionsList.length} items</span>
              <span className="font-mono text-[11px] text-[#A3E635]">PGlite Verified Sandbox</span>
            </div>

            <div className="divide-y divide-[#29313D] max-h-[600px] overflow-y-auto">
              {questionsList.map((q) => (
                <div
                  key={q.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#171C24]/60 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-[#F4F5F7]">{q.title}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        q.difficulty === 'EASY'
                          ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40'
                          : q.difficulty === 'MEDIUM'
                          ? 'text-amber-400 bg-amber-950/40 border-amber-800/40'
                          : 'text-rose-400 bg-rose-950/40 border-rose-800/40'
                      }`}>
                        {q.difficulty}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171C24] text-[#A3E635] border border-[#29313D]">
                        {q.verificationStatus}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#969EAA]">
                      <span>Company: {q.company?.name || 'General'}</span>
                      <span>•</span>
                      {q.sourceUrl ? (
                        <a
                          href={q.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#7C9EFF] hover:underline flex items-center gap-1 font-mono text-[11px]"
                        >
                          <span>{q.sourceType || 'Source Verified'}</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      ) : (
                        <span className="text-amber-400">Needs Source Verification</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={`/questions/${q.slug}`}
                      className="px-3 py-1.5 rounded-lg border border-[#29313D] bg-[#171C24] text-xs font-semibold text-[#A3E635] hover:bg-[#1D2430]"
                    >
                      View in Workspace
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: ADD NEW QUESTION */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'add' && (
          <form onSubmit={handleAddQuestion} className="p-6 rounded-2xl border border-[#29313D] bg-[#11151B] space-y-6 max-w-3xl mx-auto text-xs">
            <h2 className="text-base font-bold text-[#F4F5F7] flex items-center gap-2">
              <Plus className="h-4 w-4 text-[#A3E635]" />
              <span>Create New Interview Question</span>
            </h2>

            {successNotice && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs">
                {successNotice}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[#969EAA] font-medium">Question Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Active Users 7-Day Growth"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-[#171C24] border border-[#29313D] text-[#F4F5F7] outline-none focus:border-[#A3E635]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#969EAA] font-medium">Difficulty:</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#171C24] border border-[#29313D] text-[#F4F5F7] outline-none focus:border-[#A3E635]"
                >
                  <option value="EASY">EASY</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HARD">HARD</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[#969EAA] font-medium">Company Attribution:</label>
                <select
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#171C24] border border-[#29313D] text-[#F4F5F7] outline-none focus:border-[#A3E635]"
                >
                  {COMPANIES.map(co => (
                    <option key={co.id} value={co.id}>{co.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[#969EAA] font-medium">Source Verification URL:</label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://..."
                  required
                  className="w-full px-3 py-2 rounded-lg bg-[#171C24] border border-[#29313D] text-[#F4F5F7] outline-none focus:border-[#A3E635]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[#969EAA] font-medium">Problem Statement (Markdown):</label>
              <textarea
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                rows={4}
                required
                placeholder="Write the full problem requirements and table descriptions..."
                className="w-full p-3 rounded-lg bg-[#171C24] border border-[#29313D] text-[#F4F5F7] outline-none focus:border-[#A3E635] font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[#969EAA] font-medium">Schema SQL (CREATE TABLE):</label>
                <textarea
                  value={schemaSql}
                  onChange={(e) => setSchemaSql(e.target.value)}
                  rows={4}
                  required
                  placeholder="CREATE TABLE ...;"
                  className="w-full p-3 rounded-lg bg-[#171C24] border border-[#29313D] text-[#A3E635] outline-none focus:border-[#A3E635] font-mono text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#969EAA] font-medium">Seed SQL (INSERT INTO):</label>
                <textarea
                  value={seedSql}
                  onChange={(e) => setSeedSql(e.target.value)}
                  rows={4}
                  required
                  placeholder="INSERT INTO ... VALUES ...;"
                  className="w-full p-3 rounded-lg bg-[#171C24] border border-[#29313D] text-sky-300 outline-none focus:border-[#A3E635] font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[#969EAA] font-medium">Optimal Solution SQL:</label>
              <textarea
                value={solutionSql}
                onChange={(e) => setSolutionSql(e.target.value)}
                rows={3}
                required
                placeholder="SELECT ... FROM ...;"
                className="w-full p-3 rounded-lg bg-[#171C24] border border-[#29313D] text-[#A3E635] outline-none focus:border-[#A3E635] font-mono text-[11px]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#A3E635] text-[#0B0D10] font-bold text-xs hover:bg-[#8ECE2B] transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span>Verify & Publish Question</span>
            </button>
          </form>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: DUPLICATE DETECTION SCANNER */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'duplicates' && (
          <div className="p-6 rounded-2xl border border-[#29313D] bg-[#11151B] space-y-6 max-w-3xl mx-auto">
            <div>
              <h2 className="text-base font-bold text-[#F4F5F7] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#A3E635]" />
                <span>Duplicate Prevention Engine Scanner</span>
              </h2>
              <p className="text-xs text-[#969EAA] mt-1">
                Calculates Jaccard token overlap, normalized Levenshtein similarity, and semantic keyword matching against the verified catalog.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={scanTitle}
                onChange={(e) => setScanTitle(e.target.value)}
                placeholder="Enter a potential question title or phrase to test..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#171C24] border border-[#29313D] text-xs text-[#F4F5F7] outline-none focus:border-[#A3E635]"
              />
              <button
                type="button"
                onClick={handleScanDuplicates}
                className="px-4 py-2.5 rounded-xl bg-[#A3E635] text-[#0B0D10] font-bold text-xs hover:bg-[#8ECE2B] transition-colors"
              >
                Scan Catalog
              </button>
            </div>

            {scanResults.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#F4F5F7] uppercase tracking-wider">
                  Top Similarity Matches:
                </h3>
                <div className="divide-y divide-[#29313D] rounded-xl border border-[#29313D] bg-[#171C24] overflow-hidden">
                  {scanResults.map((r, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-[#F4F5F7]">{r.question.title}</p>
                        <p className="text-[11px] text-[#969EAA]">
                          {r.question.company?.name || 'Tech'} • {r.question.difficulty}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className={`font-mono font-bold text-xs ${
                          r.isDuplicate ? 'text-rose-400' : 'text-emerald-400'
                        }`}>
                          {(r.totalScore * 100).toFixed(0)}% Similarity
                        </span>
                        <p className="text-[10px] text-[#64748B]">
                          {r.isDuplicate ? 'Flagged as Duplicate' : 'Distinct Question'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

