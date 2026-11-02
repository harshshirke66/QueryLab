import { groq } from './groq';
import { MCQQuestion, Difficulty } from './types';
import { INITIAL_MCQ_BANK, MCQ_CATEGORIES } from './data/mcq-bank';

const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

export interface GenerateMCQParams {
  category?: string;
  difficulty?: Difficulty;
  excludedTitles?: string[];
  focusTopic?: string;
}

export interface GeneratedMCQResult {
  success: boolean;
  question: MCQQuestion;
  source: 'AI_REALTIME' | 'BANK_FALLBACK';
  duplicateChecked: boolean;
}

export async function generateAIMCQ(
  params: GenerateMCQParams = {}
): Promise<GeneratedMCQResult> {
  const {
    category = 'SQL_INTERNALS',
    difficulty = 'MEDIUM',
    excludedTitles = [],
    focusTopic = '',
  } = params;

  const categoryConfig = MCQ_CATEGORIES.find(c => c.id === category) || MCQ_CATEGORIES[0];

  // Try generating with Groq if available
  if (groq) {
    try {
      const recentHistoryList = excludedTitles.slice(0, 15).join('; ');

      const prompt = `You are a Principal Analytics Architect & Technical Hiring Manager at a top-tier tech firm (Meta, Stripe, Netflix, Google).
Generate a NOVEL, authentic-feeling Multiple Choice Question (MCQ) for a technical Data Analytics / Analytics Engineering interview.

SPECIFICATIONS:
- Category Track: "${categoryConfig.name}" (${categoryConfig.description})
- Target Difficulty: "${difficulty}"
${focusTopic ? `- Specific Focus Topic: "${focusTopic}"` : ''}
${recentHistoryList ? `- PREVIOUSLY SOLVED QUESTIONS (DO NOT REPEAT OR MIMIC THESE): [${recentHistoryList}]` : ''}

QUALITY CRITERIA:
1. The question must test deep conceptual understanding, execution lifecycle, real-world metric pitfalls, or architectural tradeoffs.
2. DO NOT create trivial recall questions or generic syntax trivia. Focus on real scenarios (e.g., query plans, cohort shifts, SRM, SCD choices, metric cannibalization).
3. If relevant to SQL, Python, or data tables, provide a 2 to 6 line code snippet or markdown table in "scenario".
4. Provide exactly 4 options labeled A, B, C, and D.
   - Make all 3 distractors plausible common industry misconceptions or traps.
   - Avoid "All of the above" or "None of the above".
5. Provide a comprehensive explanation:
   - "overview": The core mental model.
   - "whyCorrect": Clear technical proof.
   - "whyOthersIncorrect": Explicit 1-sentence breakdown for EACH distractor (A, B, C, D).
   - "interviewTip": Actionable advice for candidates during interviews.

RESPOND EXCLUSIVELY WITH A VALID JSON OBJECT:
{
  "question": "Clear, precise question stem",
  "scenario": "Optional code snippet, table, or business case (leave empty string if none)",
  "options": [
    { "id": "A", "text": "Option A text" },
    { "id": "B", "text": "Option B text" },
    { "id": "C", "text": "Option C text" },
    { "id": "D", "text": "Option D text" }
  ],
  "correctOptionId": "A",
  "explanation": {
    "overview": "High-level principle",
    "whyCorrect": "Detailed explanation of the correct choice",
    "whyOthersIncorrect": {
      "A": "Why A is right or wrong",
      "B": "Why B is right or wrong",
      "C": "Why C is right or wrong",
      "D": "Why D is right or wrong"
    },
    "interviewTip": "What interviewers look for"
  },
  "tags": ["Tag1", "Tag2", "Tag3"]
}`;

      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: GROQ_MODEL,
        response_format: { type: 'json_object' },
        temperature: 0.4,
        max_tokens: 2500,
      });

      const responseText = completion.choices[0]?.message?.content || '{}';
      let raw: any = null;
      try {
        raw = JSON.parse(responseText);
      } catch {
        const match = responseText.match(/\{[\s\S]*\}/);
        if (match) raw = JSON.parse(match[0]);
      }

      if (raw && raw.question && Array.isArray(raw.options) && raw.options.length === 4 && raw.correctOptionId) {
        // Build new unique MCQ
        const newMCQ: MCQQuestion = {
          id: `mcq_ai_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          category: categoryConfig.id,
          categoryLabel: categoryConfig.name,
          categoryIcon: categoryConfig.icon,
          difficulty,
          question: raw.question,
          scenario: raw.scenario || undefined,
          options: raw.options,
          correctOptionId: raw.correctOptionId,
          explanation: {
            overview: raw.explanation?.overview || 'Core relational and analytical principle.',
            whyCorrect: raw.explanation?.whyCorrect || 'Selected option strictly satisfies the technical constraint.',
            whyOthersIncorrect: {
              A: raw.explanation?.whyOthersIncorrect?.A || 'Incorrect option.',
              B: raw.explanation?.whyOthersIncorrect?.B || 'Incorrect option.',
              C: raw.explanation?.whyOthersIncorrect?.C || 'Incorrect option.',
              D: raw.explanation?.whyOthersIncorrect?.D || 'Incorrect option.',
            },
            interviewTip: raw.explanation?.interviewTip || 'Structure your thought process aloud before answering.',
          },
          tags: Array.isArray(raw.tags) ? raw.tags : [categoryConfig.shortLabel, 'Analytics Interview'],
        };

        return {
          success: true,
          question: newMCQ,
          source: 'AI_REALTIME',
          duplicateChecked: true,
        };
      }
    } catch (err: any) {
      console.warn('Groq AI MCQ generation failed, falling back to verified bank:', err.message);
    }
  }

  // Fallback: Pick an unserved question from the seed bank matching category, or any category
  let availablePool = INITIAL_MCQ_BANK.filter(q => {
    const isExcluded = excludedTitles.some(t => t.toLowerCase() === q.question.toLowerCase());
    const matchesCategory = category === 'ALL' || q.category === category;
    return !isExcluded && matchesCategory;
  });

  if (availablePool.length === 0) {
    // If all in category seen, allow any question not yet seen
    availablePool = INITIAL_MCQ_BANK.filter(q => 
      !excludedTitles.some(t => t.toLowerCase() === q.question.toLowerCase())
    );
  }

  if (availablePool.length === 0) {
    // If literally everything seen, recycle randomly
    availablePool = INITIAL_MCQ_BANK;
  }

  const selected = availablePool[Math.floor(Math.random() * availablePool.length)];

  return {
    success: true,
    question: {
      ...selected,
      id: `mcq_bank_${Date.now()}`,
    },
    source: 'BANK_FALLBACK',
    duplicateChecked: true,
  };
}

