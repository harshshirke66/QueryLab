import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface StoredCandidate {
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
  updatedAt: string;
}

const CANDIDATES_FILE = path.join(process.cwd(), 'src', 'lib', 'data', 'candidates-store.json');

function loadCandidates(): StoredCandidate[] {
  try {
    if (fs.existsSync(CANDIDATES_FILE)) {
      const data = fs.readFileSync(CANDIDATES_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('[leaderboard] Error reading candidates:', err);
  }
  return [];
}

function saveCandidates(list: StoredCandidate[]): void {
  try {
    const dir = path.dirname(CANDIDATES_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CANDIDATES_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[leaderboard] Error writing candidates:', err);
  }
}

export async function GET() {
  const candidates = loadCandidates();
  return NextResponse.json({ candidates });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, targetRole, xp, solvedQuestions, currentStreak } = body;

    if (!name && !email) {
      return NextResponse.json({ error: 'Name or email is required' }, { status: 400 });
    }

    const candidates = loadCandidates();
    const candidateName = (name || email?.split('@')[0] || 'Candidate').trim();
    const candidateEmail = (email || '').toLowerCase().trim();

    const xpNum = typeof xp === 'number' ? xp : 0;
    const solvedNum = Array.isArray(solvedQuestions) ? solvedQuestions.length : (typeof solvedQuestions === 'number' ? solvedQuestions : 0);
    const streakNum = typeof currentStreak === 'number' ? currentStreak : 1;

    const badgeTier: 'Grandmaster' | 'Master' | 'Specialist' | 'Candidate' =
      xpNum >= 4000 ? 'Grandmaster' :
      xpNum >= 2000 ? 'Master' :
      xpNum >= 800 ? 'Specialist' : 'Candidate';

    const existingIdx = candidates.findIndex(
      c => (candidateEmail && c.email.toLowerCase() === candidateEmail) || c.name.toLowerCase() === candidateName.toLowerCase()
    );

    const updatedEntry: StoredCandidate = {
      id: existingIdx >= 0 ? candidates[existingIdx].id : `user_cand_${Date.now()}`,
      name: candidateName,
      email: candidateEmail,
      role: `${targetRole || 'Data Analyst'} Candidate`,
      targetRole: targetRole || 'Data Analyst',
      allTimeXp: xpNum,
      weeklyXp: Math.min(xpNum, Math.round(xpNum * 0.4) + (solvedNum > 0 ? 50 : 0)),
      solved: solvedNum,
      streak: streakNum,
      badge: badgeTier,
      updatedAt: new Date().toISOString(),
    };

    if (existingIdx >= 0) {
      candidates[existingIdx] = updatedEntry;
    } else {
      candidates.push(updatedEntry);
    }

    saveCandidates(candidates);
    return NextResponse.json({ success: true, candidate: updatedEntry, candidates });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update leaderboard' }, { status: 500 });
  }
}

