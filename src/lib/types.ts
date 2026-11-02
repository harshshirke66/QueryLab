export type Role = 'CANDIDATE';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type VerificationStatus = 'VERIFIED_REAL' | 'COMMUNITY_REPORTED' | 'AI_GENERATED';

export type SubmissionStatus = 'PASSED' | 'FAILED' | 'RUNTIME_ERROR' | 'TIMEOUT';

export type TrackType = 'SQL' | 'PYTHON' | 'STATISTICS' | 'DATA_ANALYTICS';

export interface Company {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  industry: string;
  description: string;
  interviewFocus?: string;
  questionCount?: number;
}

export interface Concept {
  id: string;
  track: TrackType;
  title: string;
  slug: string;
  order: number;
  description: string;
  learningObjectives: string[];
  content?: string;
  cheatSheet?: string;
  questionCount?: number;
  masteryPercent?: number;
}

export interface Question {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  roleTarget: string;
  problemStatement: string;
  schemaSql: string;
  seedSql: string;
  expectedOutputJson: string; // JSON string of Record<string, any>[]
  solutionSql: string;
  explanation: string;
  alternativeSql?: string;
  hints: string[];
  
  // Verification
  verificationStatus: VerificationStatus;
  sourceUrl?: string;
  sourceType?: string;
  sourceNotes?: string;
  
  // Relations
  companyId?: string;
  company?: Company;
  primaryConceptId?: string;
  primaryConcept?: Concept;
  
  // Stats
  acceptanceRate: number;
  totalAttempts: number;
  totalSolved: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string;
  targetRole?: string;
  xp: number;
  createdAt: string;
}

export interface Submission {
  id: string;
  userId: string;
  questionId: string;
  querySql: string;
  status: SubmissionStatus;
  executionTimeMs: number;
  errorMessage?: string;
  userOutputJson?: string;
  createdAt: string;
}

export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  activityDates: string[]; // ['2026-11-01', ...]
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  xpReward: number;
  unlockedAt?: string;
}

export interface QueryExecutionResult {
  success: boolean;
  rows?: Record<string, any>[];
  fields?: string[];
  executionTimeMs: number;
  errorMessage?: string;
  rowCount?: number;
}

export interface ValidationResult {
  passed: boolean;
  executionTimeMs: number;
  errorMessage?: string;
  userRows?: Record<string, any>[];
  expectedRows?: Record<string, any>[];
  fields?: string[];
  expectedFields?: string[];
  diffSummary?: string;
  mismatchReason?: string;
}

export interface MockInterviewQuestion {
  questionId: string;
  title: string;
  difficulty: Difficulty;
  companyName: string;
  category: string;
  timeLimitMinutes: number;
}

export interface MockInterviewResult {
  id: string;
  score: number;
  role: string;
  totalQuestions: number;
  passedQuestions: number;
  feedback: {
    strengths: string[];
    weaknesses: string[];
    conceptRecommendations: string[];
    technicalGrade: string;
    speedEfficiencyScore: number;
    communicationScore: number;
  };
  createdAt: string;
}

export interface MCQOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface MCQQuestion {
  id: string;
  category: string;
  categoryLabel: string;
  categoryIcon: string;
  difficulty: Difficulty;
  question: string;
  scenario?: string; // Optional code snippet, table schema, or metrics case
  options: MCQOption[];
  correctOptionId: 'A' | 'B' | 'C' | 'D';
  explanation: {
    overview: string;
    whyCorrect: string;
    whyOthersIncorrect: {
      A: string;
      B: string;
      C: string;
      D: string;
    };
    interviewTip?: string;
  };
  tags: string[];
}

