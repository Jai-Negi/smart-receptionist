'use client';

import Link from 'next/link';

export default function Landing() {
  return (
    <main className="landing">
      <section className="hero">
        <div className="hero-content">
          <h1>Your Company's AI Receptionist<br />in 3 Clicks</h1>
          <p>Upload a PDF. Get a chatbot. Share a link.</p>
          <Link href="/auth/signup" className="cta-button">
            Get Started Free
          </Link>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <h3>Upload PDF</h3>
            <p>Upload documentation about your company policies, procedures, or FAQs</p>
          </div>
          <div className="step">
            <div className="step-num">2</div>
            <h3>AI Learns</h3>
            <p>Our AI analyzes your document and learns how to answer questions</p>
          </div>
          <div className="step">
            <div className="step-num">3</div>
            <h3>Share Link</h3>
            <p>Get a shareable link or API key to deploy your chatbot anywhere</p>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Powerful Features</h2>
        <div className="feature-grid">
          <div className="feature">
            <h3>🔒 Secure</h3>
            <p>Your data is encrypted and stored securely</p>
          </div>
          <div className="feature">
            <h3>⚡ Fast</h3>
            <p>Get responses in milliseconds</p>
          </div>
          <div className="feature">
            <h3>🎯 Accurate</h3>
            <p>AI trained specifically on your documents</p>
          </div>
          <div className="feature">
            <h3>📊 Analytics</h3>
            <p>Track chatbot usage and performance</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Automate Your Support?</h2>
        <Link href="/auth/signup" className="cta-button">
          Start Free Trial
        </Link>
      </section>

      <style jsx>{`
        .landing { width: 100%; background: white; }
        .hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; background: linear-gradient(135deg, #f5f5f7 0%, #ffffff 100%); padding: 40px 20px; }
        .hero-content h1 { font-size: 3.5rem; font-weight: 700; margin-bottom: 16px; line-height: 1.2; }
        .hero-content p { font-size: 1.25rem; color: #86868b; margin-bottom: 32px; }
        .cta-button { display: inline-block; padding: 16px 32px; background: #0071e3; color: white; text-decoration: none; border-radius: 12px; font-weight: 600; transition: background 0.2s; }
        .cta-button:hover { background: #0077ed; }
        .how-it-works { padding: 80px 40px; max-width: 1200px; margin: 0 auto; }
        .how-it-works h2, .features h2, .cta-section h2 { font-size: 2.5rem; margin-bottom: 48px; text-align: center; }
        .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; }
        .step { text-align: center; }
        .step-num { width: 60px; height: 60px; background: #0071e3; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; margin: 0 auto 16px; }
        .step h3 { font-size: 1.25rem; margin-bottom: 12px; }
        .step p { color: #86868b; line-height: 1.6; }
        .features { padding: 80px 40px; background: #f5f5f7; max-width: 1200px; margin: 0 auto; width: 100%; }
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 32px; }
        .feature h3 { font-size: 1.25rem; margin-bottom: 12px; }
        .feature p { color: #86868b; }
        .cta-section { padding: 80px 40px; text-align: center; max-width: 1200px; margin: 0 auto; }
        @media (max-width: 768px) {
          .hero-content h1 { font-size: 2rem; }
          .how-it-works, .features, .cta-section { padding: 40px 20px; }
          .how-it-works h2, .features h2, .cta-section h2 { font-size: 1.75rem; }
        }
      `}</style>
    </main>
  );
}
