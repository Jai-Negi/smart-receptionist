'use client';

import { useState } from 'react';

export default function ShareModal({ projectId, projectName, onClose }) {
  const [copied, setCopied] = useState(false);

  const chatUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/chat/${projectId}`
    : `/chat/${projectId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(chatUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #1a1a1e 0%, #252529 100%)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
          width: '90%', maxWidth: 500, padding: 24, color: 'white',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Share {projectName}</h2>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: '#b0b0b8', fontSize: '1.5rem', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        <p style={{ color: '#b0b0b8', margin: '0 0 16px', lineHeight: 1.6 }}>
          Anyone with this link can chat with your AI receptionist.
        </p>

        <div style={{ display: 'flex', gap: 8 }}>
          <input
            readOnly
            value={chatUrl}
            style={{
              flex: 1, padding: '12px 16px', background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
              color: '#64d3ff', fontSize: '0.9rem',
            }}
          />
          <button
            onClick={copyToClipboard}
            style={{
              padding: '12px 20px', background: 'rgba(2,132,199,0.2)',
              border: '1px solid #0284c7', borderRadius: 8, color: '#64d3ff',
              fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
