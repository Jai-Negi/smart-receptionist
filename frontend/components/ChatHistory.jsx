'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { authHeaders } from '@/lib/authHeaders';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ChatHistory({ projectId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!projectId) return;
    (async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/projects/${projectId}/history?limit=100`,
          { headers: await authHeaders() }
        );
        setMessages(res.data.messages || []);
      } catch (err) {
        setError(err.response?.data?.detail || err.message || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    })();
  }, [projectId]);

  const clearHistory = async () => {
    if (!confirm('Clear all chat history? This cannot be undone.')) return;
    try {
      await axios.delete(
        `${API_URL}/api/projects/${projectId}/history`,
        { headers: await authHeaders() }
      );
      setMessages([]);
    } catch (err) {
      setError('Failed to clear history');
    }
  };

  const box = {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 24,
  };

  return (
    <div style={box}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0, color: 'white' }}>Chat History</h3>
        {messages.length > 0 && (
          <button onClick={clearHistory} style={{ background: 'rgba(239,68,68,0.1)', color: '#ff7777', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
            Clear
          </button>
        )}
      </div>

      {loading && <p style={{ color: '#b0b0b8' }}>Loading history...</p>}
      {error && <p style={{ color: '#ff7777' }}>{error}</p>}
      {!loading && !error && messages.length === 0 && (
        <p style={{ color: '#7a7a82' }}>No messages yet</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ borderLeft: '3px solid #0284c7', paddingLeft: 12 }}>
            <p style={{ color: '#64d3ff', margin: '0 0 6px' }}><strong style={{ color: 'white' }}>User:</strong> {msg.userMessage}</p>
            <p style={{ color: '#b0b0b8', margin: 0 }}><strong style={{ color: 'white' }}>Assistant:</strong> {msg.assistantResponse}</p>
            <p style={{ color: '#7a7a82', fontSize: '0.8rem', margin: '6px 0 0' }}>
              Confidence: {Math.round((msg.confidence || 0) * 100)}%
              {msg.grounded === false && ' · Not grounded'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
