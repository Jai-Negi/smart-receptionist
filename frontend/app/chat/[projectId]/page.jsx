'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ChatPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    if (!projectId) return;
    axios
      .get(`${API_URL}/api/projects/${projectId}`)
      .then((res) => setProject(res.data))
      .catch((err) => setLoadError(err.response?.data?.detail || `Cannot reach backend at ${API_URL}`));
  }, [projectId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setInput('');
    setSendError('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setSending(true);

    try {
      const res = await axios.post(`${API_URL}/api/chat/${projectId}`, {
        message: text,
        chat_history: messages.map(({ role, content }) => ({ role, content })),
      });
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.data.response, confidence: res.data.confidence, grounded: res.data.grounded },
      ]);
    } catch (err) {
      setMessages((prev) => prev.slice(0, -1));
      setInput(text);
      setSendError(err.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loadError) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a1e', color: '#ff7777', padding: 24, textAlign: 'center' }}>
        <div>
          <h1 style={{ color: 'white' }}>Chatbot unavailable</h1>
          <p>{loadError}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return <div style={{ minHeight: '100vh', background: '#1a1a1e', color: '#b0b0b8', padding: 32 }}>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'linear-gradient(180deg, #1a1a1e 0%, #252529 100%)', color: 'white' }}>
      <header style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h1 style={{ margin: 0, fontSize: '1.4rem' }}>{project.name}</h1>
        {project.description && <p style={{ margin: '6px 0 0', color: '#b0b0b8' }}>{project.description}</p>}
      </header>

      <main style={{ flex: 1, overflowY: 'auto', padding: 16, maxWidth: 900, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        {messages.length === 0 && (
          <p style={{ color: '#7a7a82', textAlign: 'center', marginTop: 48 }}>Ask a question about {project.name}</p>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
            <div style={{
              maxWidth: '75%', padding: '10px 14px', borderRadius: 12, lineHeight: 1.5,
              background: m.role === 'user' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'rgba(255,255,255,0.05)',
              border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
            }}>
              {m.content}
              {m.role === 'assistant' && (
                <div style={{ marginTop: 6, fontSize: '0.8rem', color: '#64d3ff' }}>
                  Confidence: {Math.round((m.confidence || 0) * 100)}%
                  {!m.grounded && <span style={{ color: '#fbbf24' }}> · May be inaccurate</span>}
                </div>
              )}
            </div>
          </div>
        ))}
        {sending && <p style={{ color: '#7a7a82' }}>Thinking...</p>}
        <div ref={endRef} />
      </main>

      {sendError && (
        <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ff7777', padding: '10px 16px', textAlign: 'center' }}>
          {sendError}
        </div>
      )}

      <form onSubmit={send} style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', gap: 8, maxWidth: 900, margin: '0 auto' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            disabled={sending}
            style={{ flex: 1, padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'white', fontSize: '1rem' }}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            style={{ padding: '0 20px', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', border: 'none', borderRadius: 8, color: 'white', fontSize: '1.1rem', cursor: 'pointer', opacity: sending || !input.trim() ? 0.6 : 1 }}
          >
            →
          </button>
        </div>
      </form>
    </div>
  );
}
