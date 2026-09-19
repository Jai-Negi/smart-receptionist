'use client';

import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <main className="main-container">
      <header className="header">
        <div className="header-content">
          <h1>Company Assistant</h1>
          <p>Ask about policies, benefits, or procedures</p>
        </div>
      </header>

      <div className="chat-wrapper">
        <ChatInterface />
      </div>

      <style jsx>{`
        .main-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f5f7 0%, #ffffff 100%);
          padding: 16px;
        }

        .header {
          text-align: center;
          padding: 32px 16px 24px;
        }

        .header-content h1 {
          margin-bottom: 8px;
          color: #1d1d1f;
        }

        .header-content p {
          color: #86868b;
          font-size: 1rem;
        }

        .chat-wrapper {
          flex: 1;
          max-width: 700px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          min-height: 600px;
        }

        @media (max-width: 768px) {
          .main-container {
            padding: 12px;
          }

          .header {
            padding: 24px 16px 20px;
          }

          .header-content h1 {
            font-size: 1.75rem;
          }

          .chat-wrapper {
            min-height: 500px;
          }
        }
      `}</style>
    </main>
  );
}
