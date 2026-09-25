'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        
        try {
          // Fetch user data
          const userDocRef = doc(db, 'users', authUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          }

          // Fetch user's projects
          const projectsQuery = query(
            collection(db, 'projects'),
            where('userId', '==', authUser.uid)
          );
          const projectsSnap = await getDocs(projectsQuery);
          
          const projectsList = projectsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          
          // Sort by creation date (newest first)
          projectsList.sort((a, b) => {
            const aTime = a.createdAt?.toMillis?.() || 0;
            const bTime = b.createdAt?.toMillis?.() || 0;
            return bTime - aTime;
          });
          
          setProjects(projectsList);
        } catch (err) {
          console.error('Error fetching data:', err);
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

  const handleDeleteProject = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    setDeletingId(projectId);
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recently';
    const date = timestamp.toDate?.() || new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your projects...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-container">
          <div className="header-left">
            <h1>Dashboard</h1>
          </div>
          <div className="header-right">
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        <div className="content-container">
          {/* Welcome Section */}
          <section className="welcome-section">
            <h2>Welcome back, {userData?.firstName || 'User'}</h2>
            <p>Manage your AI receptionist chatbots</p>
          </section>

          {/* Projects Section */}
          <section className="projects-section">
            <div className="section-header">
              <h3>Your Projects</h3>
              <Link href="/projects/new" className="btn btn-primary btn-sm">
                <span className="btn-icon">+</span>
                New Project
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📁</div>
                <h4>No projects yet</h4>
                <p>Create your first project to get started with your AI receptionist</p>
                <Link href="/projects/new" className="btn btn-primary">
                  Create First Project
                </Link>
              </div>
            ) : (
              <div className="projects-grid">
                {projects.map((project) => (
                  <div key={project.id} className="project-card">
                    <div className="project-header">
                      <div className="project-title-section">
                        <h4>{project.name}</h4>
                        <span className={`project-status status-${project.status}`}>
                          {project.status === 'processing' ? '⏳ Processing' : '✓ Active'}
                        </span>
                      </div>
                    </div>

                    {project.description && (
                      <p className="project-description">{project.description}</p>
                    )}

                    <div className="project-meta">
                      <div className="meta-item">
                        <span className="meta-label">File:</span>
                        <span className="meta-value">{project.fileName}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Created:</span>
                        <span className="meta-value">{formatDate(project.createdAt)}</span>
                      </div>
                    </div>

                    <div className="project-footer">
                      <button className="btn btn-secondary btn-xs">
                        View
                      </button>
                      <button className="btn btn-secondary btn-xs">
                        Share
                      </button>
                      <button 
                        className="btn btn-danger btn-xs"
                        onClick={() => handleDeleteProject(project.id)}
                        disabled={deletingId === project.id}
                      >
                        {deletingId === project.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Quick Start Section */}
          {projects.length === 0 && (
            <section className="quickstart-section">
              <h3>Quick Start Guide</h3>
              <div className="quickstart-grid">
                <div className="quickstart-card">
                  <div className="step-number">1</div>
                  <h4>Upload PDF</h4>
                  <p>Upload your company documentation and policies</p>
                </div>
                <div className="quickstart-card">
                  <div className="step-number">2</div>
                  <h4>AI Learns</h4>
                  <p>Our AI analyzes your documents automatically</p>
                </div>
                <div className="quickstart-card">
                  <div className="step-number">3</div>
                  <h4>Share Link</h4>
                  <p>Get a shareable chatbot link or embed code</p>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: linear-gradient(180deg, #1a1a1e 0%, #252529 100%);
          color: white;
        }

        .dashboard-loading {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-4);
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: var(--color-primary-500);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Header */
        .dashboard-header {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: var(--spacing-6) 0;
        }

        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--spacing-4);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left h1 {
          font-size: 1.875rem;
          margin: 0;
        }

        .header-right {
          display: flex;
          gap: var(--spacing-4);
        }

        .btn-logout {
          padding: 10px 20px;
          background: transparent;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
          font-family: var(--font-family);
        }

        .btn-logout:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.4);
        }

        /* Content */
        .dashboard-content {
          padding: var(--spacing-12) 0;
          min-height: calc(100vh - 80px);
        }

        .content-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--spacing-4);
        }

        /* Welcome Section */
        .welcome-section {
          margin-bottom: var(--spacing-12);
        }

        .welcome-section h2 {
          font-size: 2.5rem;
          margin-bottom: var(--spacing-2);
          background: linear-gradient(135deg, #64d3ff 0%, #00d4ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .welcome-section p {
          color: #b0b0b8;
          font-size: 1.125rem;
        }

        /* Projects Section */
        .projects-section {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          padding: var(--spacing-8);
          margin-bottom: var(--spacing-12);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-6);
        }

        .section-header h3 {
          font-size: 1.5rem;
          margin: 0;
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

        .btn-primary:hover {
          box-shadow: 0 8px 20px rgba(2, 132, 199, 0.4);
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: transparent;
          color: #64d3ff;
          border: 1px solid rgba(100, 211, 255, 0.3);
        }

        .btn-secondary:hover {
          background: rgba(2, 132, 199, 0.1);
          border-color: #64d3ff;
        }

        .btn-danger {
          background: transparent;
          color: #ff7777;
          border: 1px solid rgba(255, 119, 119, 0.3);
        }

        .btn-danger:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.1);
          border-color: #ff7777;
        }

        .btn-danger:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-sm {
          padding: 8px 16px;
          font-size: 0.9rem;
        }

        .btn-xs {
          padding: 6px 12px;
          font-size: 0.85rem;
        }

        .btn-icon {
          font-size: 1.25rem;
          font-weight: 700;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: var(--spacing-12);
          background: rgba(255, 255, 255, 0.02);
          border: 1px dashed rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: var(--spacing-4);
        }

        .empty-state h4 {
          font-size: 1.25rem;
          margin-bottom: var(--spacing-2);
          color: white;
        }

        .empty-state p {
          color: #b0b0b8;
          margin-bottom: var(--spacing-6);
        }

        /* Projects Grid */
        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: var(--spacing-6);
        }

        .project-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          padding: var(--spacing-6);
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
        }

        .project-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(2, 132, 199, 0.5);
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(2, 132, 199, 0.2);
        }

        .project-header {
          margin-bottom: var(--spacing-4);
        }

        .project-title-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--spacing-3);
        }

        .project-title-section h4 {
          font-size: 1.125rem;
          margin: 0;
          flex: 1;
          word-break: break-word;
        }

        .project-status {
          display: inline-block;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .status-active {
          background: rgba(52, 199, 89, 0.2);
          color: #34c759;
        }

        .status-processing {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
        }

        .project-description {
          color: #b0b0b8;
          font-size: 0.95rem;
          margin: 0 0 var(--spacing-4);
          line-height: 1.5;
          flex-grow: 1;
        }

        .project-meta {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
          margin-bottom: var(--spacing-4);
          padding-bottom: var(--spacing-4);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 0.85rem;
        }

        .meta-item {
          display: flex;
          justify-content: space-between;
        }

        .meta-label {
          color: #7a7a82;
        }

        .meta-value {
          color: #b0b0b8;
          text-align: right;
          word-break: break-word;
        }

        .project-footer {
          display: flex;
          gap: var(--spacing-2);
        }

        /* Quick Start Section */
        .quickstart-section {
          margin-top: var(--spacing-12);
        }

        .quickstart-section h3 {
          font-size: 1.5rem;
          margin-bottom: var(--spacing-6);
        }

        .quickstart-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-6);
        }

        .quickstart-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(2, 132, 199, 0.3);
          border-radius: var(--radius-lg);
          padding: var(--spacing-6);
          text-align: center;
          transition: all 0.3s;
        }

        .quickstart-card:hover {
          background: rgba(2, 132, 199, 0.1);
          border-color: rgba(2, 132, 199, 0.6);
          transform: translateY(-4px);
        }

        .step-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          border-radius: 50%;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: var(--spacing-4);
        }

        .quickstart-card h4 {
          font-size: 1.125rem;
          margin-bottom: var(--spacing-2);
        }

        .quickstart-card p {
          color: #b0b0b8;
          font-size: 0.95rem;
          margin: 0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header-container {
            flex-direction: column;
            gap: var(--spacing-4);
          }

          .welcome-section h2 {
            font-size: 1.75rem;
          }

          .section-header {
            flex-direction: column;
            gap: var(--spacing-4);
            align-items: flex-start;
          }

          .projects-grid {
            grid-template-columns: 1fr;
          }

          .quickstart-grid {
            grid-template-columns: 1fr;
          }

          .project-title-section {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
