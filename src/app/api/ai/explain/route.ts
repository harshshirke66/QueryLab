import { NextResponse } from 'next/server';
import { getAISolutionExplanation } from '@/lib/groq';
import { mockStore } from '@/lib/store';

export async function POST(req: Request) {
  try {
    const { questionId } = await req.json();

    const q = mockStore.getQuestionBySlug(questionId);
    if (!q) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const explanation = await getAISolutionExplanation(
      q.title,
      q.solutionSql,
      q.explanation
    );
    return NextResponse.json(explanation);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate solution explanation' },
      { status: 500 }
    );
  }
}

