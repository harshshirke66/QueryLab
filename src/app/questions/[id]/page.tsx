import React from 'react';
import Navbar from '@/components/Navbar';
import SqlWorkspace from '@/components/SqlWorkspace';
import { mockStore } from '@/lib/store';
import QuestionPageClientFallback from './QuestionPageClientFallback';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function QuestionPage({ params }: PageProps) {
  const { id } = await params;
  const question = mockStore.getQuestionBySlug(id);

  if (question) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0B0D10] text-[#F4F5F7]">
        <Navbar />
        <main className="flex-1 overflow-hidden">
          <SqlWorkspace question={question} />
        </main>
      </div>
    );
  }

  // If question was not found in static or server-side store,
  // attempt client-side hydration from localStorage before giving up
  return <QuestionPageClientFallback slug={id} />;
}
