'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Link href="/landing" className="logo-link">
            <span className="logo-icon">✨</span>
            <span className="logo-text">SmartReceptionist</span>
          </Link>
        </div>

        <div className="auth-content">
          <h1>Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>

          <form onSubmit={handleLogin} className="auth-form">
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

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-divider">
            <span>Don't have an account?</span>
          </div>

          <Link href="/auth/signup" className="btn btn-secondary btn-full">
            Create Account
          </Link>

          <div className="auth-footer">
            <Link href="/landing">Back to Home</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1a1a1e 0%, #252529 100%);
          padding: var(--spacing-4);
        }

        .auth-container {
          width: 100%;
          max-width: 420px;
          background: white;
          border-radius: var(--radius-lg);
          padding: var(--spacing-8);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .auth-header {
          margin-bottom: var(--spacing-8);
          text-align: center;
        }

        .logo-link {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-2);
          text-decoration: none;
          color: var(--color-neutral-900);
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
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--color-primary-500);
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
          background: rgba(2, 132, 199, 0.02);
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
        }

        .btn-primary:hover:not(:disabled) {
          box-shadow: 0 8px 20px rgba(2, 132, 199, 0.4);
          transform: translateY(-2px);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
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

        .btn-full {
          width: 100%;
        }

        .auth-divider {
          text-align: center;
          margin: var(--spacing-6) 0;
          color: var(--color-neutral-600);
          font-size: 0.9rem;
        }

        .auth-footer {
          text-align: center;
          margin-top: var(--spacing-6);
        }

        .auth-footer a {
          color: var(--color-primary-500);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          transition: color 0.2s;
        }

        .auth-footer a:hover {
          color: var(--color-primary-600);
        }

        @media (max-width: 480px) {
          .auth-container {
            padding: var(--spacing-6);
          }

          .auth-content h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
