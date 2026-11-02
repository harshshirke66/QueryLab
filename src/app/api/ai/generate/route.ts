import { NextResponse } from 'next/server';
import { generateAIQuestion } from '@/lib/groq';
import { cache } from '@/lib/redis';

export async function POST(req: Request) {
  try {
    const { 
      concept, 
      difficulty, 
      topic, 
      scenario,
      roleTarget,
      companyStyle,
      edgeCases,
      tableComplexity
    } = await req.json();

    // Check rate limit: 15 generations per minute per client
    const rateCheck = await cache.checkRateLimit('ai_generate', 15, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'AI generation rate limit exceeded. Please wait 60 seconds.' },
        { status: 429 }
      );
    }

    const result = await generateAIQuestion({
      concept: concept || 'Window Functions',
      difficulty: difficulty || 'MEDIUM',
      topic: topic || 'User Behavior Analytics',
      scenario: scenario || '',
      roleTarget: roleTarget || 'Data Analyst',
      companyStyle: companyStyle || 'Top Tech / FAANG',
      edgeCases: edgeCases || [],
      tableComplexity: tableComplexity || 'MULTI_TABLE',
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.errorMessage,
          duplicateScore: result.duplicateScore,
          duplicateMatchTitle: result.duplicateMatchTitle,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'AI Question Generation failed' },
      { status: 500 }
    );
  }
}

