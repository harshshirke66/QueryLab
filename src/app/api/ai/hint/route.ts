import { NextResponse } from 'next/server';
import { getAIHint } from '@/lib/groq';
import { mockStore } from '@/lib/store';

export async function POST(req: Request) {
  try {
    const { questionId, currentQuery, hintLevel = 1 } = await req.json();

    const q = mockStore.getQuestionBySlug(questionId);
    const title = q ? q.title : 'SQL Interview Practice Problem';
    const statement = q ? q.problemStatement : '';

    const hint = await getAIHint(title, statement, currentQuery || '', hintLevel);
    return NextResponse.json({ hint, hintLevel });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate AI hint' },
      { status: 500 }
    );
  }
}

