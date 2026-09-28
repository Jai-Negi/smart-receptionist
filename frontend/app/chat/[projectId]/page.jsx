'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

export default function ChatPage() {
  const params = useParams();
  const projectId = params.projectId;
  
  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Fetch project metadata
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/projects/${projectId}`);
        setProject(res.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.detail || 'Project not found');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);

    try {
      const res = await axios.post(
        `${API_URL}/api/chat/${projectId}`,
        {
          message: userMessage,
          chat_history: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        }
      );

      // Add assistant response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.data.response,
        confidence: res.data.confidence,
        grounded: res.data.grounded
      }]);
      
      setError('');
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message;
      
      if (err.response?.status === 429) {
        setError('Too many messages. Please wait a moment.');
      } else if (err.response?.status === 404) {
        setError('Project not found.');
      } else {
        setError(errorMsg);
      }

      // Remove last user message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="chat-loading">
        <div className="spinner"></div>
        <p>Loading chatbot...</p>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="chat-error">
        <h1>Oops!</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* Header */}
      <header className="chat-header">
        <div className="header-content">
          <h1>{project?.name || 'AI Assistant'}</h1>
          {project?.description && (
            <p className="subtitle">{project.description}</p>
          )}
        </div>
      </header>

      {/* Messages */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h2>Start a conversation</h2>
            <p>Ask anything about {project?.name}</p>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div key={idx} className={`message message-${msg.role}`}>
                <div className="message-content">
                  {msg.content}
                  {msg.role === 'assistant' && (
                    <div className="message-meta">
                      <span className="confidence">
                        Confidence: {(msg.confidence * 100).toFixed(0)}%
                      </span>
                      {!msg.grounded && (
                        <span className="warning">⚠️ May contain inaccuracies</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSendMessage} className="message-form">
        <div className="input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            disabled={chatLoading}
            className="message-input"
          />
          <button
            type="submit"
            disabled={chatLoading || !input.trim()}
            className="send-button"
          >
            {chatLoading ? (
              <span className="spinner-small"></span>
            ) : (
              '→'
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: linear-gradient(180deg, #1a1a1e 0%, #252529 100%);
          color: white;
        }

        .chat-loading,
        .chat-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(180deg, #1a1a1e 0%, #252529 100%);
          color: white;
          gap: var(--spacing-4);
        }

        .chat-error h1 {
          font-size: 2rem;
        }

        .chat-error p {
          color: #b0b0b8;
          font-size: 1.1rem;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: var(--color-primary-500);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .spinner-small {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Header */
        .chat-header {
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: var(--spacing-6) var(--spacing-4);
          backdrop-filter: blur(10px);
        }

        .header-content {
          max-width: 900px;
          margin: 0 auto;
        }

        .chat-header h1 {
          font-size: 1.5rem;
          margin: 0;
        }

        .subtitle {
          color: #b0b0b8;
          font-size: 0.95rem;
          margin: var(--spacing-2) 0 0;
        }

        /* Messages */
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: var(--spacing-6) var(--spacing-4);
          max-width: 900px;
          width: 100%;
          margin: 0 auto;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          color: #7a7a82;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: var(--spacing-4);
        }

        .empty-state h2 {
          font-size: 1.5rem;
          margin: 0 0 var(--spacing-2);
          color: white;
        }

        .message {
          display: flex;
          margin-bottom: var(--spacing-4);
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message-user {
          justify-content: flex-end;
        }

        .message-assistant {
          justify-content: flex-start;
        }

        .message-content {
          max-width: 70%;
          padding: var(--spacing-3) var(--spacing-4);
          border-radius: var(--radius-lg);
          word-wrap: break-word;
          line-height: 1.5;
        }

        .message-user .message-content {
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          color: white;
        }

        .message-assistant .message-content {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
        }

        .message-meta {
          display: flex;
          gap: var(--spacing-3);
          margin-top: var(--spacing-2);
          padding-top: var(--spacing-2);
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 0.8rem;
          opacity: 0.8;
        }

        .confidence {
          color: #64d3ff;
        }

        .warning {
          color: #fbbf24;
        }

        /* Error Banner */
        .error-banner {
          background: rgba(239, 68, 68, 0.1);
          border-top: 1px solid rgba(239, 68, 68, 0.3);
          color: #ff7777;
          padding: var(--spacing-3) var(--spacing-4);
          text-align: center;
          font-size: 0.9rem;
        }

        /* Form */
        .message-form {
          padding: var(--spacing-4);
          background: rgba(255, 255, 255, 0.02);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .input-wrapper {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          gap: var(--spacing-2);
        }

        .message-input {
          flex: 1;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
          color: white;
          font-size: 1rem;
          font-family: var(--font-family);
          transition: all 0.2s;
        }

        .message-input::placeholder {
          color: #7a7a82;
        }

        .message-input:focus {
          outline: none;
          border-color: #0284c7;
          background: rgba(2, 132, 199, 0.1);
        }

        .message-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .send-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          border: none;
          border-radius: var(--radius-md);
          color: white;
          font-size: 1.25rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .send-button:hover:not(:disabled) {
          box-shadow: 0 8px 20px rgba(2, 132, 199, 0.4);
          transform: translateY(-2px);
        }

        .send-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Scrollbar */
        .messages-container::-webkit-scrollbar {
          width: 6px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        @media (max-width: 768px) {
          .message-content {
            max-width: 85%;
          }

          .chat-header h1 {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
