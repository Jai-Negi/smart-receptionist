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

    setLoading(true);

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user profile to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        firstName: firstName,
        lastName: lastName,
        email: email,
        createdAt: new Date(),
      });

      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Sign Up</h1>
        <form onSubmit={handleSignup}>
          <div className="name-row">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        <p>
          Already have an account? <Link href="/auth/login">Login</Link>
        </p>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f5f7 0%, #ffffff 100%);
        }

        .auth-container {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          width: 100%;
          max-width: 400px;
        }

        h1 {
          margin-bottom: 24px;
          text-align: center;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .name-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        input {
          padding: 12px 16px;
          border: 1px solid #d2d2d7;
          border-radius: 8px;
          font-size: 1rem;
        }

        input:focus {
          outline: none;
          border-color: #0071e3;
          box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
        }

        button {
          padding: 12px 16px;
          background: #0071e3;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        button:hover:not(:disabled) {
          background: #0077ed;
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .error {
          color: #ff3b30;
          font-size: 0.9rem;
        }

        p {
          text-align: center;
          color: #86868b;
        }

        a {
          color: #0071e3;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}