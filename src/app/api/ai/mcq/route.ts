import { NextResponse } from 'next/server';
import { generateAIMCQ } from '@/lib/mcq-generator';

export async function POST(req: Request) {
  try {
    const { category, difficulty, excludedTitles, focusTopic } = await req.json();

    const result = await generateAIMCQ({
      category: category || 'ALL',
      difficulty: difficulty || 'MEDIUM',
      excludedTitles: Array.isArray(excludedTitles) ? excludedTitles : [],
      focusTopic: focusTopic || '',
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate MCQ' },
      { status: 500 }
    );
  }
}

