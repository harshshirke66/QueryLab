import { NextResponse } from 'next/server';
import { evaluateMockInterview } from '@/lib/groq';

export async function POST(req: Request) {
  try {
    const { role, questionTitles, submissions } = await req.json();

    const evaluation = await evaluateMockInterview(
      role || 'Data Analyst',
      questionTitles || [],
      submissions || []
    );

    return NextResponse.json(evaluation);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Mock interview evaluation failed' },
      { status: 500 }
    );
  }
}

