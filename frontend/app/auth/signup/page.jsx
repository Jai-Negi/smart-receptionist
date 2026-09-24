'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim()) {
      setError('First and last name are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        firstName: firstName,
        lastName: lastName,
        email: email,
        createdAt: new Date(),
      });

      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Side - Form */}
      <div className="auth-left">
        <div className="auth-content">
          <Link href="/landing" className="logo-link">
            <span className="logo-icon">✨</span>
            <span className="logo-text">SmartReceptionist</span>
          </Link>

          <h1>Create Account</h1>
          <p className="auth-subtitle">Join thousands of companies automating support</p>

          <form onSubmit={handleSignup} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link href="/auth/login" className="auth-link">
                Sign in
              </Link>
            </p>
            <Link href="/landing" className="back-link">
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="auth-right">
        <div className="visual-content">
          <div className="feature-box">
            <div className="feature-icon">📄</div>
            <h3>Upload PDFs</h3>
            <p>Share your documents and company knowledge</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon">🧠</div>
            <h3>AI Learns</h3>
            <p>Our AI analyzes and understands your content</p>
          </div>
          <div className="feature-box">
            <div className="feature-icon">🚀</div>
            <h3>Deploy Instantly</h3>
            <p>Get a working chatbot in minutes</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: white;
        }

        .auth-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: var(--spacing-12);
          background: white;
        }

        .auth-content {
          max-width: 420px;
          width: 100%;
        }

        .logo-link {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-2);
          text-decoration: none;
          color: var(--color-neutral-900);
          margin-bottom: var(--spacing-8);
          transition: color 0.2s;
        }

        .logo-link:hover {
          color: var(--color-primary-500);
        }

        .logo-icon {
          font-size: 1.75rem;
        }

        .logo-text {
          font-size: 1.125rem;
          font-weight: 600;
        }

        .auth-content h1 {
          font-size: 2rem;
          margin-bottom: var(--spacing-2);
          color: var(--color-neutral-900);
        }

        .auth-subtitle {
          color: var(--color-neutral-600);
          margin-bottom: var(--spacing-6);
          font-size: 0.95rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-4);
          margin-bottom: var(--spacing-6);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-3);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
        }

        .form-group label {
          font-weight: 600;
          color: var(--color-neutral-900);
          font-size: 0.95rem;
        }

        .form-group input {
          padding: 12px 16px;
          border: 1px solid var(--color-neutral-300);
          border-radius: var(--radius-md);
          font-size: 1rem;
          font-family: var(--font-family);
          transition: all 0.2s;
          background: white;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--color-primary-500);
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
        }

        .form-group input::placeholder {
          color: var(--color-neutral-400);
        }

        .error-message {
          padding: var(--spacing-3) var(--spacing-4);
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #c33;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 500;
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
          text-decoration: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-family);
        }

        .btn-primary {
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
          width: 100%;
        }

        .btn-primary:hover:not(:disabled) {
          box-shadow: 0 8px 20px rgba(2, 132, 199, 0.4);
          transform: translateY(-2px);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-footer {
          margin-top: var(--spacing-6);
          text-align: center;
          font-size: 0.95rem;
          color: var(--color-neutral-600);
        }

        .auth-footer p {
          margin-bottom: var(--spacing-3);
        }

        .auth-link {
          color: var(--color-primary-500);
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }

        .auth-link:hover {
          color: var(--color-primary-600);
        }

        .back-link {
          display: inline-block;
          color: var(--color-neutral-600);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: var(--color-primary-500);
        }

        /* Right Side */
        .auth-right {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          padding: var(--spacing-12);
        }

        .visual-content {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-8);
          max-width: 380px;
        }

        .feature-box {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: var(--spacing-6);
          border-radius: var(--radius-lg);
          text-align: center;
          color: white;
          transition: all 0.3s;
        }

        .feature-box:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-4px);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: var(--spacing-3);
        }

        .feature-box h3 {
          font-size: 1.25rem;
          margin-bottom: var(--spacing-2);
          color: white;
        }

        .feature-box p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.95rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .auth-page {
            grid-template-columns: 1fr;
          }

          .auth-right {
            display: none;
          }

          .auth-left {
            padding: var(--spacing-6);
          }

          .auth-content {
            max-width: 100%;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
