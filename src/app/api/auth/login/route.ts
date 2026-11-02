import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { DEMO_USERS, createSessionToken, verifyPassword, hashPassword } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password, demoType, name, targetRole } = await req.json();

    let userToAuth = null;

    if (demoType === 'candidate') {
      userToAuth = DEMO_USERS.candidate;
    } else if (demoType === 'admin') {
      userToAuth = DEMO_USERS.admin;
    } else if (email) {
      const candidateMatch = DEMO_USERS.candidate.email.toLowerCase() === email.toLowerCase();
      const adminMatch = DEMO_USERS.admin.email.toLowerCase() === email.toLowerCase();

      if (candidateMatch) {
        if (password && verifyPassword(password, DEMO_USERS.candidate.passwordHash)) {
          userToAuth = DEMO_USERS.candidate;
        }
      } else if (adminMatch) {
        if (password && verifyPassword(password, DEMO_USERS.admin.passwordHash)) {
          userToAuth = DEMO_USERS.admin;
        }
      } else {
        // Create real candidate account
        const cleanName = name && name.trim() ? name.trim() : email.split('@')[0];
        userToAuth = {
          id: `user_${Date.now()}`,
          email,
          name: cleanName,
          role: 'CANDIDATE' as const,
          targetRole: targetRole || 'Data Analyst',
          xp: 0,
          passwordHash: hashPassword(password || 'demo123'),
          createdAt: new Date().toISOString(),
        };
      }
    }

    if (!userToAuth) {
      return NextResponse.json(
        { error: 'Invalid email or password. You can also use the 1-Click Demo buttons.' },
        { status: 401 }
      );
    }

    const token = await createSessionToken({
      userId: userToAuth.id,
      email: userToAuth.email,
      name: userToAuth.name,
      role: userToAuth.role,
    });

    const cookieStore = await cookies();
    cookieStore.set('querylab_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Auto-sync candidate to leaderboard registry
    try {
      const candidatesPath = path.join(process.cwd(), 'src', 'lib', 'data', 'candidates-store.json');
      let candidatesList: any[] = [];
      if (fs.existsSync(candidatesPath)) {
        const raw = fs.readFileSync(candidatesPath, 'utf-8');
        candidatesList = JSON.parse(raw);
        if (!Array.isArray(candidatesList)) candidatesList = [];
      }
      const existingIdx = candidatesList.findIndex((c: any) => c.email?.toLowerCase() === userToAuth.email.toLowerCase());
      const candidateEntry = {
        id: userToAuth.id,
        name: userToAuth.name,
        email: userToAuth.email,
        role: `${userToAuth.targetRole || 'Data Analyst'} Candidate`,
        targetRole: userToAuth.targetRole || 'Data Analyst',
        allTimeXp: userToAuth.xp || 0,
        weeklyXp: Math.min(userToAuth.xp || 0, 50),
        solved: 0,
        streak: 1,
        badge: 'Candidate',
        updatedAt: new Date().toISOString(),
      };
      if (existingIdx >= 0) {
        candidatesList[existingIdx] = { ...candidatesList[existingIdx], ...candidateEntry };
      } else {
        candidatesList.push(candidateEntry);
      }
      fs.writeFileSync(candidatesPath, JSON.stringify(candidatesList, null, 2), 'utf-8');
    } catch (e) {
      console.warn('[login] Leaderboard sync error:', e);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userToAuth.id,
        email: userToAuth.email,
        name: userToAuth.name,
        role: userToAuth.role,
        targetRole: userToAuth.targetRole || 'Data Analyst',
        xp: userToAuth.xp,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Authentication failed' }, { status: 500 });
  }
}
