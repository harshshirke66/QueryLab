import { NextResponse } from 'next/server';
import { explainUserQuery } from '@/lib/sql-runner';
import { mockStore } from '@/lib/store';

export async function POST(req: Request) {
  try {
    const { questionId, userSql } = await req.json();

    const q = mockStore.getQuestionBySlug(questionId);
    if (!q) {
      return NextResponse.json({ success: false, errorMessage: 'Question not found' }, { status: 404 });
    }

    const result = await explainUserQuery(q.schemaSql, q.seedSql, userSql);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, errorMessage: error.message || 'Explain failed' },
      { status: 500 }
    );
  }
}

