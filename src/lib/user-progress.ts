'use client';

export interface UserProgressData {
  name: string;
  email: string;
  role: 'CANDIDATE';
  targetRole: string;
  avatarUrl: string;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  activityDates: string[]; // YYYY-MM-DD
  solvedQuestions: string[]; // question IDs
  submissions: {
    id: string;
    questionId: string;
    questionTitle: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    category: string;
    runtimeMs: number;
    passed: boolean;
    timestamp: string;
  }[];
}

const STORAGE_KEY = 'querylab_user_progress_v3';
const PROGRESS_EVENT = 'querylab_progress_updated';

function getDateOffset(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

// Clean starting state for any real candidate account
export function createCleanProgress(
  name: string = 'Candidate',
  email: string = '',
  targetRole: string = 'Data Analyst'
): UserProgressData {
  const today = new Date().toISOString().split('T')[0];
  return {
    name: name.trim() || (email ? email.split('@')[0] : 'Candidate'),
    email: email.trim(),
    role: 'CANDIDATE',
    targetRole: targetRole || 'Data Analyst',
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email || 'Candidate')}`,
    xp: 0,
    currentStreak: 1,
    longestStreak: 1,
    lastActiveDate: today,
    activityDates: [today],
    solvedQuestions: [],
    submissions: [],
  };
}

// Pre-seeded progress only for the demo candidate account
export const DEMO_PROGRESS: UserProgressData = {
  name: 'Alex Rivera',
  email: 'candidate@querylab.dev',
  role: 'CANDIDATE',
  targetRole: 'Data Analyst',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&q=80',
  xp: 850,
  currentStreak: 5,
  longestStreak: 7,
  lastActiveDate: new Date().toISOString().split('T')[0],
  activityDates: [
    getDateOffset(-4),
    getDateOffset(-3),
    getDateOffset(-2),
    getDateOffset(-1),
    getDateOffset(0),
  ],
  solvedQuestions: [
    'q_meta_pages_no_likes',
    'q_amazon_highest_grossing',
    'q_google_odd_even_measurements',
    'q_uber_third_ride',
    'q_stripe_repeated_payments',
  ],
  submissions: [
    {
      id: 'sub_seed_1',
      questionId: 'q_meta_pages_no_likes',
      questionTitle: 'Page With No Likes',
      difficulty: 'EASY',
      category: 'Table Joins',
      runtimeMs: 11.2,
      passed: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    },
    {
      id: 'sub_seed_2',
      questionId: 'q_amazon_highest_grossing',
      questionTitle: 'Top 2 Highest Grossing Products',
      difficulty: 'MEDIUM',
      category: 'Window Functions',
      runtimeMs: 14.5,
      passed: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: 'sub_seed_3',
      questionId: 'q_stripe_repeated_payments',
      questionTitle: 'Repeated Payments Within 10 Minutes',
      difficulty: 'HARD',
      category: 'Window Functions',
      runtimeMs: 18.2,
      passed: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    },
    {
      id: 'sub_seed_4',
      questionId: 'q_uber_third_ride',
      questionTitle: "User's Third Transaction",
      difficulty: 'MEDIUM',
      category: 'Window Functions',
      runtimeMs: 12.0,
      passed: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
    },
  ],
};

// Default fallback for SSR and pre-mount hydration
export const DEFAULT_FALLBACK: UserProgressData = {
  name: 'Candidate',
  email: '',
  role: 'CANDIDATE',
  targetRole: 'Data Analyst',
  avatarUrl: '',
  xp: 0,
  currentStreak: 1,
  longestStreak: 1,
  lastActiveDate: '2026-01-01',
  activityDates: ['2026-01-01'],
  solvedQuestions: [],
  submissions: [],
};

// Get live progress from localStorage or clean default (guaranteed non-null)
export function getUserProgress(): UserProgressData {
  if (typeof window === 'undefined') return DEFAULT_FALLBACK;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw || raw === 'undefined' || raw === 'null') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FALLBACK));
      return DEFAULT_FALLBACK;
    }

    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FALLBACK));
      return DEFAULT_FALLBACK;
    }

    // Auto-cleanse: if non-demo account has leftover 850 XP and 5-day streak from previous template, reset cleanly
    if (
      data.email &&
      data.email.toLowerCase() !== 'candidate@querylab.dev' &&
      data.xp === 850 &&
      Array.isArray(data.submissions) &&
      data.submissions.some((s: any) => s.id === 'sub_seed_1')
    ) {
      const cleansed = createCleanProgress(data.name || 'Candidate', data.email, data.targetRole || 'Data Analyst');
      saveProgress(cleansed);
      return cleansed;
    }

    // Merge onto DEFAULT_FALLBACK to guarantee every field is defined
    return {
      ...DEFAULT_FALLBACK,
      ...data,
      name: data.name || DEFAULT_FALLBACK.name,
      email: data.email || DEFAULT_FALLBACK.email,
      targetRole: data.targetRole || DEFAULT_FALLBACK.targetRole,
      role: data.role || 'CANDIDATE',
      xp: typeof data.xp === 'number' ? data.xp : 0,
      currentStreak: typeof data.currentStreak === 'number' ? data.currentStreak : 1,
      longestStreak: typeof data.longestStreak === 'number' ? data.longestStreak : 1,
      activityDates: Array.isArray(data.activityDates) ? data.activityDates : [],
      solvedQuestions: Array.isArray(data.solvedQuestions) ? data.solvedQuestions : [],
      submissions: Array.isArray(data.submissions) ? data.submissions : [],
    };
  } catch {
    return DEFAULT_FALLBACK;
  }
}

// Save progress and broadcast change across components
export function saveProgress(data: UserProgressData): void {
  if (typeof window === 'undefined' || !data) return;

  try {
    const safeData: UserProgressData = {
      ...DEFAULT_FALLBACK,
      ...data,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeData));
    window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: safeData }));
  } catch (err) {
    console.error('Failed to save user progress:', err);
  }
}

// Initialize a brand new account cleanly (0 XP, clean streak, 0 solved)
export function initializeNewUserAccount(
  name: string,
  email: string,
  targetRole: string = 'Data Analyst'
): UserProgressData {
  const fresh = createCleanProgress(name, email, targetRole);
  saveProgress(fresh);
  return fresh;
}

// Add XP and ensure today is marked in active streak
export function addXP(amount: number, reason?: string): UserProgressData {
  const current = getUserProgress();
  const today = new Date().toISOString().split('T')[0];

  const updatedDates = current.activityDates.includes(today)
    ? current.activityDates
    : [...current.activityDates, today];

  const updated: UserProgressData = {
    ...current,
    xp: current.xp + amount,
    lastActiveDate: today,
    activityDates: updatedDates,
  };

  saveProgress(updated);
  return updated;
}

// Record question solution
export function recordSolvedQuestion(
  questionId: string,
  questionTitle: string,
  difficulty: 'EASY' | 'MEDIUM' | 'HARD',
  category: string,
  runtimeMs: number,
  passed: boolean
): UserProgressData {
  const current = getUserProgress();
  const today = new Date().toISOString().split('T')[0];

  const isAlreadySolved = current.solvedQuestions.includes(questionId);
  const updatedSolved = passed && !isAlreadySolved
    ? [...current.solvedQuestions, questionId]
    : current.solvedQuestions;

  const xpGain = passed ? (isAlreadySolved ? 15 : 50) : 5;

  const updatedDates = current.activityDates.includes(today)
    ? current.activityDates
    : [...current.activityDates, today];

  const newSubmission = {
    id: `sub_${Date.now()}`,
    questionId,
    questionTitle,
    difficulty,
    category,
    runtimeMs,
    passed,
    timestamp: new Date().toISOString(),
  };

  const updated: UserProgressData = {
    ...current,
    xp: current.xp + xpGain,
    lastActiveDate: today,
    activityDates: updatedDates,
    solvedQuestions: updatedSolved,
    submissions: [newSubmission, ...current.submissions.slice(0, 49)],
  };

  saveProgress(updated);
  return updated;
}

// Record Mock Interview Completion
export function recordMockInterviewProgress(score: number, companyName: string): UserProgressData {
  const xpReward = Math.round((score / 100) * 120) + 30;
  return addXP(xpReward, `Completed ${companyName} Mock Interview`);
}

// Subscribe to progress updates
export function subscribeToProgress(callback: (data: UserProgressData) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = (e: Event) => {
    try {
      const customEvent = e as CustomEvent<UserProgressData>;
      const detail = customEvent?.detail;
      if (detail && typeof detail === 'object' && typeof detail.name === 'string') {
        callback(detail);
      } else {
        callback(getUserProgress());
      }
    } catch {
      callback(getUserProgress());
    }
  };

  window.addEventListener(PROGRESS_EVENT, handler);
  return () => window.removeEventListener(PROGRESS_EVENT, handler);
}

// Update User Profile details
export function updateUserProfile(updates: Partial<UserProgressData>): UserProgressData {
  const current = getUserProgress();
  const updated = { ...current, ...updates };
  saveProgress(updated);
  return updated;
}
