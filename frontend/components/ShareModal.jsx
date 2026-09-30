'use client';

import { useState } from 'react';
import axios from 'axios';

export default function ShareModal({ projectId, projectName, onClose }) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const FRONTEND_URL = typeof window !== 'undefined' ? window.location.origin : '';

  const generateShareLink = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(
        `${API_URL}/api/projects/${projectId}/generate-key`,
        { userId: 'current-user-id' } // TODO: Get from Auth context
      );

      const chatUrl = `${FRONTEND_URL}/chat/${projectId}`;
      setShareUrl(chatUrl);
      setApiKey(res.data.apiKey);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate share link');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>Share {projectName}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {!shareUrl ? (
            <>
              <p className="modal-description">
                Generate a shareable link so anyone can chat with your AI receptionist.
              </p>

              <button
                onClick={generateShareLink}
                disabled={loading}
                className="btn btn-primary btn-lg btn-full"
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Generating...
                  </>
                ) : (
                  '🔗 Generate Share Link'
                )}
              </button>

              {error && <div className="error-message">{error}</div>}
            </>
          ) : (
            <>
              {/* Chatbot Link */}
              <div className="share-section">
                <label className="share-label">Chatbot Link</label>
                <div className="copy-input">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="share-input"
                  />
                  <button
                    onClick={() => copyToClipboard(shareUrl)}
                    className="copy-btn"
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <small>Share this link with anyone to let them chat with your bot</small>
              </div>

              {/* API Key */}
              <div className="share-section">
                <label className="share-label">API Key</label>
                <div className="copy-input">
                  <input
                    type="text"
                    readOnly
                    value={apiKey}
                    className="share-input font-mono"
                  />
                  <button
                    onClick={() => copyToClipboard(apiKey)}
                    className="copy-btn"
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <small>For API integrations and webhooks</small>
              </div>

              {/* Instructions */}
              <div className="info-box">
                <h4>📋 Sharing Options</h4>
                <ul>
                  <li><strong>Direct Link:</strong> Share the chatbot link directly</li>
                  <li><strong>Embed:</strong> Add to your website (coming soon)</li>
                  <li><strong>API:</strong> Integrate into your app using the API key</li>
                </ul>
              </div>

              {/* Regenerate */}
              <button
                onClick={() => {
                  setShareUrl('');
                  setApiKey('');
                }}
                className="btn btn-secondary btn-full"
              >
                Regenerate Link
              </button>
            </>
          )}
        </div>

        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.2s ease;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .modal-content {
            background: linear-gradient(135deg, #1a1a1e 0%, #252529 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: var(--radius-lg);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease;
          }

          @keyframes slideUp {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--spacing-6);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .modal-header h2 {
            font-size: 1.5rem;
            margin: 0;
            color: white;
          }

          .close-btn {
            background: none;
            border: none;
            color: #b0b0b8;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            transition: color 0.2s;
          }

          .close-btn:hover {
            color: white;
          }

          .modal-body {
            padding: var(--spacing-6);
            display: flex;
            flex-direction: column;
            gap: var(--spacing-6);
          }

          .modal-description {
            color: #b0b0b8;
            font-size: 0.95rem;
            margin: 0;
            line-height: 1.6;
          }

          .share-section {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-2);
          }

          .share-label {
            font-weight: 600;
            font-size: 0.95rem;
            color: white;
          }

          .copy-input {
            display: flex;
            gap: var(--spacing-2);
          }

          .share-input {
            flex: 1;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: var(--radius-md);
            color: #64d3ff;
            font-size: 0.9rem;
            font-family: 'Courier New', monospace;
          }

          .font-mono {
            font-family: 'Courier New', monospace;
          }

          .copy-btn {
            padding: 12px 20px;
            background: rgba(2, 132, 199, 0.2);
            border: 1px solid #0284c7;
            border-radius: var(--radius-md);
            color: #64d3ff;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            white-space: nowrap;
          }

          .copy-btn:hover {
            background: rgba(2, 132, 199, 0.3);
            color: #00d4ff;
          }

          .share-section small {
            color: #7a7a82;
            font-size: 0.85rem;
          }

          .info-box {
            background: rgba(2, 132, 199, 0.1);
            border: 1px solid rgba(2, 132, 199, 0.3);
            border-radius: var(--radius-md);
            padding: var(--spacing-4);
          }

          .info-box h4 {
            font-size: 0.95rem;
            margin: 0 0 var(--spacing-2);
            color: #64d3ff;
          }

          .info-box ul {
            margin: 0;
            padding: 0 0 0 var(--spacing-4);
            list-style: none;
          }

          .info-box li {
            color: #b0b0b8;
            font-size: 0.9rem;
            margin-bottom: var(--spacing-2);
          }

          .info-box li:before {
            content: "→ ";
            color: #34c759;
            font-weight: 700;
            margin-right: var(--spacing-2);
          }

          .error-message {
            padding: var(--spacing-3) var(--spacing-4);
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            color: #ff7777;
            border-radius: var(--radius-md);
            font-size: 0.9rem;
          }

          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: var(--spacing-2);
            padding: 12px 24px;
            border-radius: var(--radius-md);
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.2s;
            border: none;
            cursor: pointer;
            font-family: var(--font-family);
          }

          .btn-primary {
            background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
            color: white;
          }

          .btn-primary:hover:not(:disabled) {
            box-shadow: 0 8px 20px rgba(2, 132, 199, 0.4);
            transform: translateY(-2px);
          }

          .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
            color: #64d3ff;
            border: 1px solid rgba(2, 132, 199, 0.3);
          }

          .btn-secondary:hover:not(:disabled) {
            background: rgba(2, 132, 199, 0.2);
            border-color: #0284c7;
          }

          .btn-lg {
            padding: 16px 32px;
            font-size: 1.125rem;
          }

          .btn-full {
            width: 100%;
          }

          .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .spinner-small {
            display: inline-block;
            width: 14px;
            height: 14px;
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-right: var(--spacing-2);
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
