'use client';

import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto h-screen flex flex-col gap-4">
        <div className="text-center py-4">
          <h1 className="text-4xl font-bold text-gray-800">AI Receptionist</h1>
          <p className="text-gray-600">Ask about policies, benefits, and procedures</p>
        </div>
        <div className="flex-1 min-h-0">
          <ChatInterface />
        </div>
      </div>
    </main>
  );
}
