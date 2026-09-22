'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        
        // Fetch user profile from Firestore
        try {
          const userDocRef = doc(db, 'users', authUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      } else {
        router.push('/auth/login');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/landing');
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome, {userData?.firstName || 'User'}</h2>
          <p>Create your first project to get started</p>
        </div>

        <div className="projects-section">
          <h3>Your Projects</h3>
          <div className="empty-state">
            <p>No projects yet</p>
            <Link href="/projects/new" className="create-btn">
              Create First Project
            </Link>
          </div>
        </div>
      </main>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: #f5f5f7;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          font-size: 1.1rem;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 40px;
          background: white;
          border-bottom: 1px solid #e5e5e7;
        }

        .dashboard-header h1 {
          font-size: 2rem;
          margin: 0;
        }

        .logout-btn {
          padding: 8px 16px;
          background: #ff3b30;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .logout-btn:hover {
          background: #ff453a;
        }

        .dashboard-content {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 20px;
        }

        .welcome-section {
          background: white;
          padding: 40px;
          border-radius: 12px;
          margin-bottom: 40px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
        }

        .welcome-section h2 {
          margin: 0 0 8px;
        }

        .welcome-section p {
          color: #86868b;
          margin: 0;
        }

        .projects-section {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
        }

        .projects-section h3 {
          margin-top: 0;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-state p {
          color: #86868b;
          margin-bottom: 20px;
        }

        .create-btn {
          display: inline-block;
          padding: 12px 24px;
          background: #0071e3;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
        }

        .create-btn:hover {
          background: #0077ed;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .dashboard-content {
            padding: 0 16px;
          }
        }
      `}</style>
    </div>
  );
}