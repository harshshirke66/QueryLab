import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/store';
import { Question } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const question = (await req.json()) as Question;
    if (!question || !question.title || !question.slug) {
      return NextResponse.json({ error: 'Invalid question object' }, { status: 400 });
    }
    const saved = mockStore.addQuestion(question);
    return NextResponse.json({ success: true, question: saved });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to save question' },
      { status: 500 }
    );
  }
}

