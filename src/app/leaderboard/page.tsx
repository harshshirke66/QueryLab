'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Trophy, 
  Flame, 
  Zap, 
  ArrowRight, 
  Search, 
  Terminal,
  Crown,
  Users,
  Sparkles,
  Medal
} from 'lucide-react';
import { getUserProgress, subscribeToProgress, UserProgressData, DEFAULT_FALLBACK } from '@/lib/user-progress';

interface RealCandidate {
  id: string;
  name: string;
  email: string;
  role: string;
  targetRole: string;
  allTimeXp: number;
  weeklyXp: number;
  solved: number;
  streak: number;
  badge: 'Grandmaster' | 'Master' | 'Specialist' | 'Candidate';
  isUser?: boolean;
}

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<'weekly' | 'alltime'>('alltime');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'Data Analyst' | 'Analytics Engineer' | 'Data Scientist'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [progress, setProgress] = useState<UserProgressData>(DEFAULT_FALLBACK);
  const [serverCandidates, setServerCandidates] = useState<RealCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync and load real candidate data
  useEffect(() => {
    const liveProgress = getUserProgress();
    setProgress(liveProgress);

    // Sync live candidate to real leaderboard database
    const syncAndFetch = async () => {
      try {
        if (liveProgress.name && liveProgress.name !== 'Candidate') {
          await fetch('/api/leaderboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: liveProgress.name,
              email: liveProgress.email,
              targetRole: liveProgress.targetRole,
              xp: liveProgress.xp,
              solvedQuestions: liveProgress.solvedQuestions,
              currentStreak: liveProgress.currentStreak,
            }),
          }).catch(() => {});
        }

        const res = await fetch('/api/leaderboard');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.candidates)) {
            setServerCandidates(data.candidates);
          }
        }
      } catch (e) {
        console.warn('Could not load leaderboard candidates:', e);
      } finally {
        setIsLoading(false);
      }
    };

    syncAndFetch();

    const unsubscribe = subscribeToProgress((updated) => {
      setProgress(updated);
      syncAndFetch();
    });

    return unsubscribe;
  }, []);

  // Compute live user object
  const activeUser = progress || DEFAULT_FALLBACK;
  const userEntry: RealCandidate = useMemo(() => {
    const targetRole = activeUser.targetRole || 'Data Analyst';
    const xpVal = activeUser.xp || 0;
    const badgeTier: 'Grandmaster' | 'Master' | 'Specialist' | 'Candidate' =
      xpVal >= 4000 ? 'Grandmaster' :
      xpVal >= 2000 ? 'Master' :
      xpVal >= 800 ? 'Specialist' : 'Candidate';

    return {
      id: 'active_local_user',
      name: activeUser.name || 'Candidate',
      email: activeUser.email || '',
      role: `${targetRole} Candidate`,
      targetRole: targetRole,
      allTimeXp: xpVal,
      weeklyXp: xpVal,
      solved: activeUser.solvedQuestions?.length || 0,
      streak: activeUser.currentStreak || 1,
      badge: badgeTier,
      isUser: true,
    };
  }, [activeUser]);

  // Merge real candidates from server store with active user
  const rankedList = useMemo(() => {
    const map = new Map<string, RealCandidate>();

    // Add server candidates
    for (const c of serverCandidates) {
      const isCurrent = 
        (userEntry.email && c.email?.toLowerCase() === userEntry.email.toLowerCase()) ||
        c.name.toLowerCase() === userEntry.name.toLowerCase();

      map.set(c.email || c.name, {
        ...c,
        isUser: isCurrent,
        allTimeXp: isCurrent ? userEntry.allTimeXp : c.allTimeXp,
        weeklyXp: isCurrent ? userEntry.weeklyXp : c.weeklyXp,
        solved: isCurrent ? userEntry.solved : c.solved,
        streak: isCurrent ? userEntry.streak : c.streak,
      });
    }

    // Ensure active user is always included
    const key = userEntry.email || userEntry.name;
    if (!map.has(key)) {
      map.set(key, userEntry);
    }

    let list = Array.from(map.values());

    // Role filter
    if (roleFilter !== 'ALL') {
      list = list.filter(c => c.targetRole === roleFilter || c.isUser);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q));
    }

    // Sort by XP in descending order
    list.sort((a, b) => {
      const xpA = timeframe === 'weekly' ? a.weeklyXp : a.allTimeXp;
      const xpB = timeframe === 'weekly' ? b.weeklyXp : b.allTimeXp;
      if (xpB !== xpA) return xpB - xpA;
      if (b.solved !== a.solved) return b.solved - a.solved;
      return b.streak - a.streak;
    });

    return list.map((c, idx) => ({
      ...c,
      rank: idx + 1,
      currentXp: timeframe === 'weekly' ? c.weeklyXp : c.allTimeXp,
    }));
  }, [serverCandidates, userEntry, roleFilter, searchQuery, timeframe]);

  // User rank
  const myRankItem = rankedList.find(c => c.isUser) || rankedList[0];
  const myRank = myRankItem?.rank || 1;

  // Podium (Top 3)
  const top1 = rankedList[0];
  const top2 = rankedList[1];
  const top3 = rankedList[2];

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D10] text-[#F4F5F7]">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header Section */}
        <div className="border-b border-[#29313D] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#A3E635]">
                Competitive Rankings
              </span>
              <span className="text-xs text-[#64748B]">•</span>
              <span className="text-xs text-[#969EAA]">Live Candidate XP</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#F4F5F7]">
              QueryLab Real Candidate Leaderboard
            </h1>
            <p className="text-xs sm:text-sm text-[#969EAA] mt-1">
              Real registered candidates ranked dynamically by queries solved, sandbox accuracy, and active streaks.
            </p>
          </div>

          {/* Timeframe Switcher */}
          <div className="flex items-center gap-2 bg-[#171C24] p-1 rounded-xl border border-[#29313D] self-start sm:self-auto text-xs shrink-0">
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                timeframe === 'weekly' 
                  ? 'bg-[#A3E635] text-[#0B0D10] font-bold shadow-sm' 
                  : 'text-[#969EAA] hover:text-[#F4F5F7]'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeframe('alltime')}
              className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all ${
                timeframe === 'alltime' 
                  ? 'bg-[#A3E635] text-[#0B0D10] font-bold shadow-sm' 
                  : 'text-[#969EAA] hover:text-[#F4F5F7]'
              }`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Live Personal Standing Banner */}
        <div className="p-5 rounded-2xl border border-[#29313D] bg-gradient-to-r from-[#171C24] via-[#11151B] to-[#171C24] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-[#29313D] border border-[#3E4A5C] flex items-center justify-center font-mono font-bold text-lg text-[#A3E635]">
              #{myRank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span suppressHydrationWarning className="font-bold text-sm text-[#F4F5F7]">
                  {activeUser.name || 'Candidate'} (You)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#A3E635]/20 text-[#A3E635] border border-[#A3E635]/40 font-bold">
                  ACTIVE CANDIDATE
                </span>
              </div>
              <p className="text-xs text-[#969EAA] mt-0.5">
                {myRank === 1 ? (
                  <span className="text-amber-400 font-semibold">
                    👑 You are leading the platform as Global Champion Rank #1! Solve more questions to maintain your lead.
                  </span>
                ) : (
                  <>
                    Rank <span className="font-bold text-[#F4F5F7]">#{myRank}</span> of {rankedList.length} real candidates.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right font-mono text-xs">
              <span suppressHydrationWarning className="font-bold text-[#A3E635] text-sm">
                {myRankItem?.currentXp || 0} XP
              </span>
              <span className="text-[10px] text-[#969EAA]">{timeframe === 'weekly' ? 'Weekly XP' : 'Total XP'}</span>
            </div>
            <Link
              href="/questions"
              className="px-4 py-2 rounded-xl bg-[#A3E635] text-[#0B0D10] font-bold text-xs hover:bg-[#8ECE2B] transition-all flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Solve SQL (+50 XP)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Podium Area: Real Candidates Only */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 items-end">
          
          {/* #2 Silver Podium */}
          {top2 ? (
            <div className={`p-6 rounded-2xl border text-center space-y-3 relative order-2 md:order-1 transition-all ${
              top2.isUser 
                ? 'bg-[#171C24] border-[#A3E635] shadow-lg shadow-[#A3E635]/10' 
                : 'bg-[#11151B] border-[#29313D]'
            }`}>
              {top2.isUser && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#A3E635] text-[#0B0D10] text-[9px] font-mono font-extrabold uppercase">
                  You
                </span>
              )}
              <div className="h-12 w-12 mx-auto rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center font-bold text-slate-300 font-mono text-base">
                2
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#F4F5F7]">{top2.name}</h3>
                <p className="text-[11px] text-[#969EAA] truncate">{top2.role}</p>
              </div>
              <div className="pt-2 flex justify-center gap-4 text-xs font-mono">
                <span className="text-[#A3E635] font-bold">{top2.currentXp} XP</span>
                <span className="text-[#969EAA]">{top2.solved} Solved</span>
                <span className="text-amber-400">{top2.streak}d 🔥</span>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-dashed border-[#29313D] bg-[#11151B]/40 text-center space-y-2 order-2 md:order-1">
              <div className="h-10 w-10 mx-auto rounded-full bg-[#171C24] border border-[#29313D] flex items-center justify-center text-[#969EAA] font-mono text-xs">
                #2
              </div>
              <p className="text-xs font-semibold text-[#969EAA]">Silver Podium Available</p>
              <p className="text-[11px] text-[#64748B]">Rank #2 will appear as real candidates join and practice.</p>
            </div>
          )}

          {/* #1 Gold Champion Podium */}
          {top1 && (
            <div className={`p-7 rounded-2xl border text-center space-y-3.5 relative order-1 md:order-2 shadow-2xl transition-all ${
              top1.isUser
                ? 'bg-[#171C24] border-[#A3E635] shadow-[#A3E635]/20'
                : 'border-amber-500/60 bg-[#171C24] shadow-amber-500/10'
            }`}>
              {top1.isUser && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#A3E635] text-[#0B0D10] text-[9px] font-mono font-extrabold uppercase">
                  You Are #1
                </span>
              )}
              <div className="h-14 w-14 mx-auto rounded-full bg-amber-950/80 border-2 border-amber-400 flex items-center justify-center font-bold text-amber-300 font-mono text-xl shadow-md">
                👑
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                  Global Champion • Rank #1
                </span>
                <h3 className="font-extrabold text-base text-[#F4F5F7] mt-0.5">{top1.name}</h3>
                <p className="text-[11px] text-[#969EAA]">{top1.role}</p>
              </div>
              <div className="pt-2 flex justify-center gap-4 text-xs font-mono border-t border-[#29313D]/60">
                <span className="text-amber-400 font-bold text-sm">{top1.currentXp} XP</span>
                <span className="text-[#F4F5F7]">{top1.solved} Solved</span>
                <span className="text-amber-400">{top1.streak}d 🔥</span>
              </div>
            </div>
          )}

          {/* #3 Bronze Podium */}
          {top3 ? (
            <div className={`p-6 rounded-2xl border text-center space-y-3 relative order-3 md:order-3 transition-all ${
              top3.isUser 
                ? 'bg-[#171C24] border-[#A3E635] shadow-lg shadow-[#A3E635]/10' 
                : 'bg-[#11151B] border-[#29313D]'
            }`}>
              {top3.isUser && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#A3E635] text-[#0B0D10] text-[9px] font-mono font-extrabold uppercase">
                  You
                </span>
              )}
              <div className="h-12 w-12 mx-auto rounded-full bg-amber-950/40 border border-amber-700/60 flex items-center justify-center font-bold text-amber-500 font-mono text-base">
                3
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#F4F5F7]">{top3.name}</h3>
                <p className="text-[11px] text-[#969EAA] truncate">{top3.role}</p>
              </div>
              <div className="pt-2 flex justify-center gap-4 text-xs font-mono">
                <span className="text-[#A3E635] font-bold">{top3.currentXp} XP</span>
                <span className="text-[#969EAA]">{top3.solved} Solved</span>
                <span className="text-amber-400">{top3.streak}d 🔥</span>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-dashed border-[#29313D] bg-[#11151B]/40 text-center space-y-2 order-3 md:order-3">
              <div className="h-10 w-10 mx-auto rounded-full bg-[#171C24] border border-[#29313D] flex items-center justify-center text-[#969EAA] font-mono text-xs">
                #3
              </div>
              <p className="text-xs font-semibold text-[#969EAA]">Bronze Podium Available</p>
              <p className="text-[11px] text-[#64748B]">Rank #3 will appear as real candidates join and practice.</p>
            </div>
          )}

        </div>

        {/* Filters & Candidate Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#171C24] border border-[#29313D] text-xs font-semibold overflow-x-auto w-full sm:w-auto">
            {(['ALL', 'Data Analyst', 'Analytics Engineer', 'Data Scientist'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setRoleFilter(cat)}
                className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  roleFilter === cat
                    ? 'bg-[#A3E635] text-[#0B0D10] font-bold shadow-sm'
                    : 'text-[#969EAA] hover:text-[#F4F5F7]'
                }`}
              >
                {cat === 'ALL' ? 'All Candidates' : cat}
              </button>
            ))}
          </div>

          {/* Search Candidate */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#969EAA]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name or role..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#11151B] border border-[#29313D] text-xs text-[#F4F5F7] placeholder-[#64748B] outline-none focus:border-[#A3E635] transition-colors"
            />
          </div>

        </div>

        {/* Real Ranked Table */}
        <div className="rounded-2xl border border-[#29313D] bg-[#11151B] overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#171C24] text-[#969EAA] border-b border-[#29313D] font-mono text-[11px]">
              <tr>
                <th className="px-5 py-3 w-16">Rank</th>
                <th className="px-5 py-3">Candidate</th>
                <th className="px-5 py-3 hidden md:table-cell">Tier Badge</th>
                <th className="px-5 py-3">Streak</th>
                <th className="px-5 py-3 text-center">Problems Solved</th>
                <th className="px-5 py-3 text-right">
                  {timeframe === 'weekly' ? 'Weekly XP' : 'Total XP'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#29313D]">
              {rankedList.map((u) => (
                <tr 
                  key={u.id} 
                  className={`transition-colors ${
                    u.isUser 
                      ? 'bg-[#A3E635]/10 border-l-4 border-l-[#A3E635]' 
                      : 'hover:bg-[#171C24]/50'
                  }`}
                >
                  {/* Rank */}
                  <td className="px-5 py-3.5 font-mono font-bold">
                    <span className={`inline-flex items-center justify-center h-6 w-6 rounded-lg text-xs ${
                      u.rank === 1
                        ? 'bg-amber-400 text-[#0B0D10] font-black'
                        : u.rank === 2
                        ? 'bg-slate-300 text-[#0B0D10] font-black'
                        : u.rank === 3
                        ? 'bg-amber-700 text-amber-100 font-bold'
                        : 'text-[#969EAA]'
                    }`}>
                      #{u.rank}
                    </span>
                  </td>

                  {/* Candidate Name & Role */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                        u.isUser
                          ? 'bg-[#A3E635] text-[#0B0D10]'
                          : 'bg-[#171C24] border border-[#29313D] text-[#A3E635]'
                      }`}>
                        {u.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p suppressHydrationWarning className={`font-semibold ${u.isUser ? 'text-[#A3E635] font-bold' : 'text-[#F4F5F7]'}`}>
                            {u.name} {u.isUser && '(You)'}
                          </p>
                          {u.isUser && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#A3E635] text-[#0B0D10] font-extrabold uppercase">
                              YOU
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#969EAA]">
                          {u.role}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Tier Badge */}
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      u.badge === 'Grandmaster'
                        ? 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                        : u.badge === 'Master'
                        ? 'bg-purple-950/60 text-purple-300 border-purple-800/60'
                        : u.badge === 'Specialist'
                        ? 'bg-sky-950/60 text-sky-300 border-sky-800/60'
                        : 'bg-[#171C24] text-[#969EAA] border-[#29313D]'
                    }`}>
                      {u.badge}
                    </span>
                  </td>

                  {/* Streak */}
                  <td className="px-5 py-3.5 font-mono text-amber-400">
                    <span className="flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5 fill-amber-400" />
                      <span>{u.streak}d</span>
                    </span>
                  </td>

                  {/* Solved */}
                  <td className="px-5 py-3.5 text-center font-mono text-[#F4F5F7]">
                    {u.solved}
                  </td>

                  {/* XP */}
                  <td className="px-5 py-3.5 text-right font-mono font-bold text-[#A3E635]">
                    {u.currentXp} XP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>

      <Footer />
    </div>
  );
}
