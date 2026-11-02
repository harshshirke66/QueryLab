import fs from 'fs';
import path from 'path';
import { QUESTIONS, CONCEPTS, COMPANIES, DEFAULT_USER_STREAK } from './data/mock-data';
import { Question, Concept, Company, User, Submission, UserStreak } from './types';

const CUSTOM_QUESTIONS_PATH = path.join(process.cwd(), 'src', 'lib', 'data', 'custom-questions.json');

function loadCustomQuestions(): Question[] {
  try {
    if (typeof window === 'undefined' && fs.existsSync(CUSTOM_QUESTIONS_PATH)) {
      const data = fs.readFileSync(CUSTOM_QUESTIONS_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[store] Could not read custom-questions.json:', err);
  }
  return [];
}

function saveCustomQuestions(questions: Question[]): void {
  try {
    if (typeof window === 'undefined') {
      const dir = path.dirname(CUSTOM_QUESTIONS_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(CUSTOM_QUESTIONS_PATH, JSON.stringify(questions, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[store] Could not write custom-questions.json:', err);
  }
}

// Runtime state for questions, submissions, bookmarks, and user progress
class MockDataStore {
  private questions: Question[] = [...loadCustomQuestions(), ...QUESTIONS];
  private concepts: Concept[] = [...CONCEPTS];
  private companies: Company[] = [...COMPANIES];
  private submissions: Submission[] = [];
  private bookmarks: Set<string> = new Set();
  private userStreaks: UserStreak = { ...DEFAULT_USER_STREAK };
  private demoUser: User = {
    id: 'user_candidate_demo',
    email: 'candidate@querylab.dev',
    name: 'Alex Rivera',
    role: 'CANDIDATE',
    targetRole: 'Data Analyst',
    xp: 850,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&q=80',
    createdAt: '2026-01-01T00:00:00Z',
  };

  getQuestions(): Question[] {
    const custom = loadCustomQuestions();
    const existingIds = new Set(this.questions.map(q => q.id));
    for (const q of custom) {
      if (!existingIds.has(q.id)) {
        this.questions.unshift(q);
        existingIds.add(q.id);
      }
    }
    return this.questions;
  }

  getQuestionBySlug(slug: string): Question | undefined {
    let q = this.questions.find(x => x.slug === slug || x.id === slug);
    if (q) return q;

    // Check disk for newly generated question from other worker threads
    const custom = loadCustomQuestions();
    q = custom.find(x => x.slug === slug || x.id === slug);
    if (q) {
      this.questions.unshift(q);
      return q;
    }
    return undefined;
  }

  getConcepts(): Concept[] {
    return this.concepts;
  }

  getConceptBySlug(slug: string): Concept | undefined {
    return this.concepts.find(c => c.slug === slug || c.id === slug);
  }

  getCompanies(): Company[] {
    return this.companies;
  }

  getCompanyBySlug(slug: string): Company | undefined {
    return this.companies.find(c => c.slug === slug || c.id === slug);
  }

  addQuestion(question: Question): Question {
    // Add to in-memory store
    const idx = this.questions.findIndex(q => q.id === question.id || q.slug === question.slug);
    if (idx >= 0) {
      this.questions[idx] = question;
    } else {
      this.questions.unshift(question);
    }

    // Persist to disk so all Next.js worker threads and subsequent page loads find it
    const custom = loadCustomQuestions();
    const customIdx = custom.findIndex(q => q.id === question.id || q.slug === question.slug);
    if (customIdx >= 0) {
      custom[customIdx] = question;
    } else {
      custom.unshift(question);
    }
    saveCustomQuestions(custom);

    return question;
  }

  toggleBookmark(questionId: string): boolean {
    if (this.bookmarks.has(questionId)) {
      this.bookmarks.delete(questionId);
      return false;
    } else {
      this.bookmarks.add(questionId);
      return true;
    }
  }

  isBookmarked(questionId: string): boolean {
    return this.bookmarks.has(questionId);
  }

  getBookmarkedQuestions(): Question[] {
    return this.getQuestions().filter(q => this.bookmarks.has(q.id));
  }

  recordSubmission(sub: Omit<Submission, 'id' | 'createdAt'>): Submission {
    const newSub: Submission = {
      ...sub,
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString(),
    };
    this.submissions.unshift(newSub);

    if (sub.status === 'PASSED') {
      this.demoUser.xp += 50;
      const q = this.questions.find(x => x.id === sub.questionId);
      if (q) {
        q.totalSolved += 1;
        q.totalAttempts += 1;
        q.acceptanceRate = Math.round((q.totalSolved / q.totalAttempts) * 1000) / 10;
      }
    }

    return newSub;
  }

  getSubmissions(questionId?: string): Submission[] {
    if (questionId) {
      return this.submissions.filter(s => s.questionId === questionId);
    }
    return this.submissions;
  }

  getDemoUser(): User {
    return this.demoUser;
  }

  getUserStreak(): UserStreak {
    return this.userStreaks;
  }
}

// Preserve across Next.js HMR reloads
declare global {
  var __querylab_mock_store: MockDataStore | undefined;
}

export const mockStore = globalThis.__querylab_mock_store ?? new MockDataStore();
if (process.env.NODE_ENV !== 'production') {
  globalThis.__querylab_mock_store = mockStore;
}
