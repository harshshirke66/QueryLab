import { NextResponse } from 'next/server';
import { executeUserQuery } from '@/lib/sql-runner';
import { mockStore } from '@/lib/store';

export async function POST(req: Request) {
  try {
    const { questionId, schemaSql, seedSql, userSql } = await req.json();

    let finalSchema = schemaSql;
    let finalSeed = seedSql;

    if (questionId && (!finalSchema || !finalSeed)) {
      const q = mockStore.getQuestionBySlug(questionId);
      if (q) {
        finalSchema = q.schemaSql;
        finalSeed = q.seedSql;
      }
    }

    if (!userSql || typeof userSql !== 'string') {
      return NextResponse.json(
        { success: false, errorMessage: 'SQL query cannot be empty.' },
        { status: 400 }
      );
    }

    const result = await executeUserQuery(finalSchema || '', finalSeed || '', userSql);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, errorMessage: error.message || 'Execution failed' },
      { status: 500 }
    );
  }
}

