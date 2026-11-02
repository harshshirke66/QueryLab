import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/store';

export async function POST(req: Request) {
  try {
    const { questionId } = await req.json();
    if (!questionId) {
      return NextResponse.json({ error: 'questionId is required' }, { status: 400 });
    }

    const isBookmarked = mockStore.toggleBookmark(questionId);
    return NextResponse.json({ success: true, isBookmarked });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Bookmark toggle failed' },
      { status: 500 }
    );
  }
}

