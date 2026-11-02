import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import crypto from 'crypto';
import { User, Role } from './types';
import { mockStore } from './store';

const JWT_SECRET = new TextEncoder().encode(
  process.env.BETTER_AUTH_SECRET || 'querylab_development_session_secret_1234567890'
);
const SESSION_COOKIE_NAME = 'querylab_session';

export function hashPassword(password: string): string {
  return crypto.pbkdf2Sync(password, 'querylab_salt_2026', 1000, 32, 'sha256').toString('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  const computed = hashPassword(password);
  return computed === hash;
}

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: Role;
}

// Pre-seeded demo accounts
export const DEMO_USERS: Record<string, User & { passwordHash: string }> = {
  candidate: {
    id: 'user_candidate_demo',
    email: 'candidate@querylab.dev',
    name: 'Alex Rivera',
    role: 'CANDIDATE',
    targetRole: 'Data Analyst',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&q=80',
    xp: 850,
    passwordHash: hashPassword('candidate123'),
    createdAt: '2026-01-01T00:00:00Z',
  },
  admin: {
    id: 'user_admin_demo',
    email: 'admin@querylab.dev',
    name: 'Sarah Chen (Admin)',
    role: 'ADMIN',
    targetRole: 'Lead Interview Architect',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&q=80',
    xp: 3200,
    passwordHash: hashPassword('admin123'),
    createdAt: '2025-11-01T00:00:00Z',
  },
};

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      return mockStore.getDemoUser();
    }
    const session = await verifySessionToken(token);
    if (!session) return mockStore.getDemoUser();

    if (session.role === 'ADMIN') {
      return {
        id: session.userId,
        email: session.email,
        name: session.name,
        role: 'ADMIN',
        targetRole: 'Lead Interview Architect',
        xp: 3200,
        createdAt: '2025-11-01T00:00:00Z',
      };
    }

    return {
      id: session.userId,
      email: session.email,
      name: session.name,
      role: 'CANDIDATE',
      targetRole: 'Data Analyst',
      xp: mockStore.getDemoUser().xp,
      createdAt: '2026-01-01T00:00:00Z',
    };
  } catch {
    return mockStore.getDemoUser();
  }
}
