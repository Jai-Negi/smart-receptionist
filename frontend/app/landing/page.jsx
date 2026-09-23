'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">1000+</div>
              <div className="stat-label">Companies</div>
            </div>
            <div className="stat">
              <div className="stat-value">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
            <div className="stat">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Support</div>
            </div>
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
              <div className="step-number">1</div>
              <h3>Upload Your PDF</h3>
              <p>Share your company policies, FAQs, or procedures in a single PDF file</p>
              <div className="step-icon">📄</div>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3>AI Learns</h3>
              <p>Our AI analyzes your document and learns how to answer questions accurately</p>
              <div className="step-icon">🧠</div>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Share & Deploy</h3>
              <p>Get a shareable link or embed code for your website</p>
              <div className="step-icon">🚀</div>
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
              <div className="feature-icon">🔒</div>
              <h3>Enterprise Security</h3>
              <p>Your data is encrypted end-to-end and stored securely with GDPR compliance</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Responses in milliseconds. 99.9% uptime guarantee</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Accurate Answers</h3>
              <p>AI trained specifically on your documents with confidence scoring</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Deep Analytics</h3>
              <p>Track conversations, identify gaps, and improve documentation</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔗</div>
              <h3>Easy Integration</h3>
              <p>Embed on your website with a single line of code or share a link</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💰</div>
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
          <div className="footer-content">
            <div className="footer-section">
              <h4>Product</h4>
              <Link href="#how-it-works">How It Works</Link>
              <Link href="#features">Features</Link>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <Link href="#">About</Link>
              <Link href="#">Blog</Link>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <Link href="#">Privacy</Link>
              <Link href="#">Terms</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 SmartReceptionist. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .landing {
          background: var(--color-neutral-50);
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
        }

        .hero-badge {
          display: inline-block;
          padding: 8px 16px;
          background: rgba(14, 165, 233, 0.1);
          color: var(--color-primary-600);
          border: 1px solid rgba(14, 165, 233, 0.2);
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
          margin-bottom: var(--spacing-12);
          flex-wrap: wrap;
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-6);
          padding-top: var(--spacing-6);
          border-top: 1px solid var(--color-neutral-200);
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--color-neutral-500);
          margin-top: var(--spacing-2);
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
          box-shadow: var(--shadow-md);
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
          background: white;
        }

        .features {
          padding: var(--spacing-12) var(--spacing-4);
          background: linear-gradient(180deg, var(--color-primary-50) 0%, white 100%);
        }

        .cta-final {
          padding: var(--spacing-12) var(--spacing-4);
          background: var(--gradient-accent);
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
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-subtitle {
          text-align: center;
          color: var(--color-neutral-500);
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
          padding: var(--spacing-6);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          text-align: center;
          border: 1px solid var(--color-neutral-200);
          transition: all 0.3s;
        }

        .step-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--color-primary-200);
        }

        .step-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: var(--gradient-primary);
          color: white;
          border-radius: 50%;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: var(--spacing-4);
        }

        .step-icon {
          font-size: 3rem;
          margin-top: var(--spacing-4);
        }

        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-6);
        }

        .feature-card {
          padding: var(--spacing-6);
          border-radius: var(--radius-lg);
          background: white;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--color-neutral-200);
          transition: all 0.3s;
        }

        .feature-card:hover {
          box-shadow: var(--shadow-base);
          border-color: var(--color-primary-200);
          transform: translateY(-2px);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: var(--spacing-4);
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
          background: var(--gradient-primary);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(14, 165, 233, 0.3);
        }

        .btn-primary-white {
          background: white;
          color: var(--color-primary-600);
        }

        .btn-primary-white:hover {
          background: var(--color-neutral-100);
        }

        .btn-secondary {
          background: transparent;
          color: var(--color-primary-500);
          border: 2px solid var(--color-primary-500);
        }

        .btn-secondary:hover {
          background: rgba(14, 165, 233, 0.05);
          border-color: var(--color-primary-600);
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
          padding: var(--spacing-12) var(--spacing-4);
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-8);
          margin-bottom: var(--spacing-12);
        }

        .footer-section h4 {
          color: white;
          margin-bottom: var(--spacing-4);
        }

        .footer-section a {
          display: block;
          color: var(--color-neutral-400);
          margin-bottom: var(--spacing-3);
          transition: color 0.2s;
        }

        .footer-section a:hover {
          color: var(--color-primary-400);
        }

        .footer-bottom {
          text-align: center;
          padding-top: var(--spacing-6);
          border-top: 1px solid var(--color-neutral-700);
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

          .footer-content {
            grid-template-columns: 1fr;
          }

          .hero-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
