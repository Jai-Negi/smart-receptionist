'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import ShareModal from '@/components/ShareModal';
import Link from 'next/link';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        
        // Real-time listener for projects
        const q = query(
          collection(db, 'projects'),
          where('userId', '==', authUser.uid)
        );

        const unsubscribeProjects = onSnapshot(q, (snapshot) => {
          const projectList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProjects(projectList);
          setLoading(false);
        });

        return unsubscribeProjects;
      } else {
        router.push('/auth/login');
      }
    });

    return unsubscribe;
  }, [router]);

  const handleDeleteProject = async (projectId) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteDoc(doc(db, 'projects', projectId));
      } catch (err) {
        console.error('Error deleting project:', err);
      }
    }
  };

  const handleOpenShareModal = (project) => {
    setSelectedProject(project);
    setShareModalOpen(true);
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-container">
          <div className="header-left">
            <h1>Dashboard</h1>
          </div>
          <button
            onClick={() => auth.signOut()}
            className="btn btn-outline"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="page-content">
        <div className="content-container">
          {/* Welcome */}
          <section className="welcome-section">
            <h2 className="section-title">
              Welcome back, {user?.displayName || 'User'}
            </h2>
            <p className="section-subtitle">
              Manage your AI receptionist chatbots
            </p>
          </section>

          {/* Projects */}
          <section className="projects-section">
            <div className="section-header">
              <h3>Your Projects</h3>
              <Link href="/projects/new" className="btn btn-primary">
                + New Project
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No projects yet</h3>
                <p>Create your first AI receptionist chatbot</p>
                <Link href="/projects/new" className="btn btn-primary btn-lg">
                  Create Project
                </Link>
              </div>
            ) : (
              <div className="projects-grid">
                {projects.map((project) => (
                  <div key={project.id} className="project-card">
                    <div className="card-header">
                      <h4>{project.name}</h4>
                      <span className={`status-badge status-${project.status}`}>
                        {project.status === 'processing' ? '⏳ Processing' : '✓ Ready'}
                      </span>
                    </div>

                    {project.description && (
                      <p className="card-description">{project.description}</p>
                    )}

                    <div className="card-meta">
                      <div className="meta-item">
                        <span className="meta-label">File:</span>
                        <span className="meta-value">{project.fileName}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Size:</span>
                        <span className="meta-value">
                          {(project.fileSize / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Created:</span>
                        <span className="meta-value">
                          {project.createdAt?.toDate?.().toLocaleDateString?.() || 'Recently'}
                        </span>
                      </div>
                    </div>

                    <div className="card-actions">
                      <button
                        onClick={() => handleOpenShareModal(project)}
                        className="btn btn-secondary"
                      >
                        🔗 Share
                      </button>
                      <Link
                        href={`/chat/${project.id}`}
                        target="_blank"
                        className="btn btn-secondary"
                      >
                        💬 View
                      </Link>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="btn btn-danger"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Share Modal */}
      {shareModalOpen && selectedProject && (
        <ShareModal
          projectId={selectedProject.id}
          projectName={selectedProject.name}
          onClose={() => {
            setShareModalOpen(false);
            setSelectedProject(null);
          }}
        />
      )}

      <style jsx>{`
        .dashboard-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #1a1a1e 0%, #252529 100%);
          color: white;
        }

        .page-header {
          background: rgba(255, 255, 255, 0.02);
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
          font-size: 2rem;
          margin: 0;
        }

        .page-content {
          padding: var(--spacing-12) 0;
          min-height: calc(100vh - 100px);
        }

        .content-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--spacing-4);
        }

        .welcome-section {
          margin-bottom: var(--spacing-12);
        }

        .section-title {
          font-size: 1.875rem;
          margin: 0 0 var(--spacing-2);
          color: #64d3ff;
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: #b0b0b8;
          margin: 0;
        }

        .projects-section {
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

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: var(--spacing-12) var(--spacing-6);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: var(--spacing-4);
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin: 0 0 var(--spacing-2);
        }

        .empty-state p {
          color: #b0b0b8;
          margin: 0 0 var(--spacing-6);
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: var(--spacing-6);
        }

        .project-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          padding: var(--spacing-6);
          transition: all 0.3s;
        }

        .project-card:hover {
          border-color: rgba(2, 132, 199, 0.3);
          background: rgba(2, 132, 199, 0.05);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: var(--spacing-3);
        }

        .card-header h4 {
          font-size: 1.25rem;
          margin: 0;
          flex: 1;
          word-break: break-word;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          white-space: nowrap;
          margin-left: var(--spacing-2);
        }

        .status-processing {
          background: rgba(251, 191, 36, 0.1);
          color: #fbbf24;
        }

        .status-ready {
          background: rgba(52, 199, 89, 0.1);
          color: #34c759;
        }

        .card-description {
          color: #b0b0b8;
          font-size: 0.95rem;
          margin: 0 0 var(--spacing-4);
          line-height: 1.5;
        }

        .card-meta {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
          padding: var(--spacing-4) 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: var(--spacing-4);
        }

        .meta-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
        }

        .meta-label {
          color: #7a7a82;
        }

        .meta-value {
          color: #64d3ff;
          font-weight: 500;
        }

        .card-actions {
          display: flex;
          gap: var(--spacing-2);
        }

        .btn {
          flex: 1;
          padding: 10px 16px;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-1);
        }

        .btn-primary {
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          color: white;
        }

        .btn-primary:hover {
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: #64d3ff;
          border: 1px solid rgba(2, 132, 199, 0.3);
        }

        .btn-secondary:hover {
          background: rgba(2, 132, 199, 0.1);
          border-color: #0284c7;
        }

        .btn-danger {
          background: rgba(239, 68, 68, 0.1);
          color: #ff7777;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .btn-danger:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: #ef4444;
        }

        .btn-outline {
          background: transparent;
          color: #64d3ff;
          border: 1px solid #0284c7;
        }

        .btn-outline:hover {
          background: rgba(2, 132, 199, 0.1);
        }

        .btn-lg {
          padding: 16px 32px;
          font-size: 1rem;
        }

        .loading-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #1a1a1e 0%, #252529 100%);
        }

        .spinner {
          width: 50px;
          height: 50px;
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

        @media (max-width: 768px) {
          .header-container {
            flex-direction: column;
            gap: var(--spacing-4);
          }

          .projects-grid {
            grid-template-columns: 1fr;
          }

          .card-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
