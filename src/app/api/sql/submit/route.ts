import { NextResponse } from 'next/server';
import { validateUserSubmission } from '@/lib/sql-runner';
import { mockStore } from '@/lib/store';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { questionId, schemaSql, seedSql, userSql, expectedOutputJson } = await req.json();

    let finalSchema = schemaSql;
    let finalSeed = seedSql;
    let finalExpected = expectedOutputJson;

    const question = mockStore.getQuestionBySlug(questionId);
    if (question) {
      finalSchema = finalSchema || question.schemaSql;
      finalSeed = finalSeed || question.seedSql;
      finalExpected = finalExpected || question.expectedOutputJson;
    }

    if (!userSql || typeof userSql !== 'string') {
      return NextResponse.json(
        { passed: false, errorMessage: 'Query cannot be empty.' },
        { status: 400 }
      );
    }

    const validation = await validateUserSubmission(
      finalSchema || '',
      finalSeed || '',
      userSql,
      finalExpected || '[]'
    );

    const user = await getSessionUser();
    const userId = user ? user.id : 'user_candidate_demo';

    // Record submission
    mockStore.recordSubmission({
      userId,
      questionId: questionId || (question ? question.id : 'custom'),
      querySql: userSql,
      status: validation.passed ? 'PASSED' : validation.errorMessage ? 'RUNTIME_ERROR' : 'FAILED',
      executionTimeMs: validation.executionTimeMs,
      errorMessage: validation.errorMessage || validation.mismatchReason,
      userOutputJson: JSON.stringify(validation.userRows || []),
    });

    return NextResponse.json({
      ...validation,
      xpGained: validation.passed ? 50 : 5,
    });
  } catch (error: any) {
    return NextResponse.json(
      { passed: false, errorMessage: error.message || 'Submission verification failed' },
      { status: 500 }
    );
  }
}

