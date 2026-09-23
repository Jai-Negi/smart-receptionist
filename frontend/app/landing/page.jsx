'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// SVG Icons
const Icons = {
  upload: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M20 8v16M14 14l6-6 6 6M8 28h24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  brain: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M12 16c-1.5 1-2 3-2 5s.5 4 2 5M28 16c1.5 1 2 3 2 5s-.5 4-2 5M20 10v20M14 20h12M16 12c0-1.5 1-2.5 2-2.5s2 1 2 2.5M16 28c0 1.5 1 2.5 2 2.5s2-1 2-2.5M22 12c0-1.5 1-2.5 2-2.5s2 1 2 2.5M22 28c0 1.5 1 2.5 2 2.5s2-1 2-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  send: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M8 22l24-12-24-12v9l16 3-16 3v9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  lock: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="10" y="18" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M14 18V14c0-3.3 2.7-6 6-6s6 2.7 6 6v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="20" cy="25" r="1.5" fill="currentColor"/>
    </svg>
  ),
  lightning: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M22 6l-8 14h8l-4 14 12-20h-8l4-8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  target: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="20" cy="20" r="6" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="20" cy="20" r="2" fill="currentColor"/>
    </svg>
  ),
  chart: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <rect x="8" y="20" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="16" y="14" width="4" height="20" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="24" y="8" width="4" height="26" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  code: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M12 14l-4 6 4 6M28 14l4 6-4 6M22 10l-4 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  dollar: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <path d="M20 10v20M16 14c0-2 1.5-3 4-3s4 1 4 3-1 2-2 2h-4c-1 0-2 1-2 2s1 2 2 2h4c1 0 2 1 2 3s-1.5 3-4 3-4-1-4-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

export default function Landing() {
  return (
    <main className="landing">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">✨</span>
            <span className="logo-text">SmartReceptionist</span>
          </div>
          <div className="nav-links">
            <Link href="/auth/login" className="nav-link">
              Login
            </Link>
            <Link href="/auth/signup" className="nav-cta">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="main-content">
        <div className="hero-content">
          <div className="hero-badge">✨ AI-Powered Support</div>
          
          <h1 className="hero-title">
            Every question answered.<br />
            Every customer happy.
          </h1>

          <p className="hero-subtitle">
            Upload a PDF. Get an AI receptionist. Share a link.<br />
            No coding. No setup. Just results.
          </p>

          <div className="hero-ctas">
            <Link href="/auth/signup" className="btn btn-primary btn-lg">
              Start Free Trial
              <span className="btn-arrow">→</span>
            </Link>
            <Link href="#how-it-works" className="btn btn-secondary btn-lg">
              See How It Works
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card">
            <div className="chat-bubble assistant">
              <p>Hi! How can I help you today?</p>
            </div>
            <div className="chat-bubble user">
              <p>What's your vacation policy?</p>
            </div>
            <div className="chat-bubble assistant">
              <p>You get 20 days of paid vacation per year...</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="section-container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Three simple steps to your AI receptionist</p>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon-wrapper">{Icons.upload}</div>
              <h3>Upload Your PDF</h3>
              <p>Share your company policies, FAQs, or procedures in a single PDF file</p>
            </div>

            <div className="step-card">
              <div className="step-icon-wrapper">{Icons.brain}</div>
              <h3>AI Learns</h3>
              <p>Our AI analyzes your document and learns how to answer questions accurately</p>
            </div>

            <div className="step-card">
              <div className="step-icon-wrapper">{Icons.send}</div>
              <h3>Share & Deploy</h3>
              <p>Get a shareable link or embed code for your website</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="section-container">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">Everything you need to automate support</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">{Icons.lock}</div>
              <h3>Enterprise Security</h3>
              <p>Your data is encrypted end-to-end and stored securely with GDPR compliance</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">{Icons.lightning}</div>
              <h3>Lightning Fast</h3>
              <p>Responses in milliseconds. 99.9% uptime guarantee</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">{Icons.target}</div>
              <h3>Accurate Answers</h3>
              <p>AI trained specifically on your documents with confidence scoring</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">{Icons.chart}</div>
              <h3>Deep Analytics</h3>
              <p>Track conversations, identify gaps, and improve documentation</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">{Icons.code}</div>
              <h3>Easy Integration</h3>
              <p>Embed on your website with a single line of code or share a link</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">{Icons.dollar}</div>
              <h3>Transparent Pricing</h3>
              <p>Start free. Pay only for what you use. Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-final">
        <div className="section-container">
          <h2>Ready to Transform Your Support?</h2>
          <p>Join thousands of companies automating their customer support with AI</p>
          <Link href="/auth/signup" className="btn btn-primary-white btn-lg">
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="section-container">
          <div className="footer-center">
            <p>&copy; 2026 SmartReceptionist. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .landing {
          overflow: hidden;
        }

        /* Navigation */
        .navbar {
          position: sticky;
          top: 0;
          z-index: 30;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--color-neutral-200);
          padding: var(--spacing-4);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
          font-weight: 600;
          font-size: 1.125rem;
          color: var(--color-neutral-900);
        }

        .logo-icon {
          font-size: 1.5rem;
        }

        .nav-links {
          display: flex;
          gap: var(--spacing-4);
          align-items: center;
        }

        .nav-link {
          color: var(--color-neutral-900);
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-link:hover {
          color: var(--color-primary-500);
        }

        .nav-cta {
          padding: 8px 16px;
          background: var(--color-primary-500);
          color: white;
          border-radius: var(--radius-md);
          font-weight: 500;
          transition: background 0.2s;
        }

        .nav-cta:hover {
          background: var(--color-primary-600);
        }

        /* Hero Section */
        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-12);
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
          padding: var(--spacing-12);
          min-height: 90vh;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
        }

        .hero-badge {
          display: inline-block;
          padding: 8px 16px;
          background: rgba(14, 165, 233, 0.1);
          color: var(--color-primary-600);
          border: 1px solid var(--color-primary-200);
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: var(--spacing-6);
        }

        .hero-title {
          font-size: 3.75rem;
          line-height: 1.1;
          margin-bottom: var(--spacing-6);
          color: var(--color-neutral-900);
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--color-neutral-600);
          margin-bottom: var(--spacing-8);
          line-height: 1.6;
        }

        .hero-ctas {
          display: flex;
          gap: var(--spacing-4);
          flex-wrap: wrap;
        }

        /* Hero Visual */
        .hero-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .hero-card {
          background: white;
          border-radius: var(--radius-lg);
          padding: var(--spacing-6);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        .chat-bubble {
          margin-bottom: var(--spacing-3);
          animation: slideIn 0.6s ease-out;
        }

        .chat-bubble p {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .chat-bubble.assistant {
          padding: var(--spacing-3) var(--spacing-4);
          background: var(--color-neutral-100);
          border-radius: var(--radius-md);
          color: var(--color-neutral-900);
        }

        .chat-bubble.user {
          padding: var(--spacing-3) var(--spacing-4);
          background: var(--color-primary-500);
          color: white;
          border-radius: var(--radius-md);
          margin-left: auto;
          max-width: 85%;
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

        /* Sections */
        .section-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--spacing-4);
        }

        .how-it-works {
          padding: var(--spacing-12) var(--spacing-4);
          background: #f8fafc;
          border-top: 1px solid var(--color-neutral-200);
        }

        .features {
          padding: var(--spacing-12) var(--spacing-4);
          background: #ecf3fe;
          border-top: 1px solid var(--color-neutral-200);
        }

        .cta-final {
          padding: var(--spacing-12) var(--spacing-4);
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          color: white;
          text-align: center;
        }

        .cta-final h2 {
          font-size: 2.5rem;
          margin-bottom: var(--spacing-4);
          color: white;
        }

        .cta-final p {
          font-size: 1.125rem;
          margin-bottom: var(--spacing-8);
          opacity: 0.95;
        }

        .section-title {
          text-align: center;
          margin-bottom: var(--spacing-4);
          font-size: 2.5rem;
          color: var(--color-neutral-900);
        }

        .section-subtitle {
          text-align: center;
          color: var(--color-neutral-600);
          font-size: 1.125rem;
          margin-bottom: var(--spacing-12);
        }

        /* Steps Grid */
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-6);
        }

        .step-card {
          background: white;
          padding: var(--spacing-8);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          text-align: center;
          border: 1px solid var(--color-neutral-200);
          transition: all 0.3s;
        }

        .step-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--color-primary-300);
        }

        .step-icon-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(45, 212, 191, 0.15) 100%);
          color: var(--color-primary-600);
          border-radius: var(--radius-lg);
          margin: 0 auto var(--spacing-4);
          transition: all 0.3s;
        }

        .step-card:hover .step-icon-wrapper {
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.25) 0%, rgba(45, 212, 191, 0.25) 100%);
          transform: scale(1.05);
        }

        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-6);
        }

        .feature-card {
          padding: var(--spacing-8);
          border-radius: var(--radius-lg);
          background: white;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--color-neutral-200);
          transition: all 0.3s;
        }

        .feature-card:hover {
          box-shadow: var(--shadow-base);
          border-color: var(--color-primary-300);
          transform: translateY(-2px);
        }

        .feature-icon-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(45, 212, 191, 0.15) 100%);
          color: var(--color-primary-600);
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-4);
          transition: all 0.3s;
        }

        .feature-card:hover .feature-icon-wrapper {
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.25) 0%, rgba(45, 212, 191, 0.25) 100%);
          transform: scale(1.1);
        }

        .feature-card h3 {
          margin-bottom: var(--spacing-2);
          color: var(--color-neutral-900);
        }

        /* Buttons */
        .btn {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-2);
          padding: 12px 24px;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.2s;
          text-decoration: none;
          white-space: nowrap;
          border: none;
          cursor: pointer;
        }

        .btn-primary {
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(2, 132, 199, 0.4);
        }

        .btn-primary-white {
          background: white;
          color: var(--color-primary-600);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .btn-primary-white:hover {
          background: var(--color-neutral-100);
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: transparent;
          color: var(--color-primary-600);
          border: 2px solid var(--color-primary-300);
        }

        .btn-secondary:hover {
          background: var(--color-primary-50);
          border-color: var(--color-primary-500);
        }

        .btn-lg {
          padding: 16px 32px;
          font-size: 1.125rem;
        }

        .btn-arrow {
          transition: transform 0.2s;
        }

        .btn:hover .btn-arrow {
          transform: translateX(4px);
        }

        /* Footer */
        .footer {
          background: var(--color-neutral-900);
          color: white;
          padding: var(--spacing-8) var(--spacing-4);
          border-top: 1px solid var(--color-neutral-800);
        }

        .footer-center {
          text-align: center;
          color: var(--color-neutral-400);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero {
            grid-template-columns: 1fr;
            gap: var(--spacing-6);
            padding: var(--spacing-8) var(--spacing-4);
            min-height: auto;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-ctas {
            flex-direction: column;
          }

          .steps-grid,
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
