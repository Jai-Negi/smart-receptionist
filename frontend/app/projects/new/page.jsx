'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateProject() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/auth/login');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [router]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setError('');
    } else {
      setError('Please select a valid PDF file');
      setPdfFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!projectName.trim()) {
      setError('Project name is required');
      return;
    }

    if (!pdfFile) {
      setError('PDF file is required');
      return;
    }

    // TODO: Save to Firestore and upload PDF
    console.log('Project name:', projectName);
    console.log('PDF file:', pdfFile);
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="create-project-page">
      <header className="header">
        <Link href="/dashboard" className="back-link">
          ← Back to Dashboard
        </Link>
      </header>

      <main className="create-project-content">
        <div className="form-container">
          <h1>Create New Project</h1>
          <p className="subtitle">Upload a PDF and create your AI receptionist chatbot</p>

          <form onSubmit={handleSubmit}>
            {/* Project Name */}
            <div className="form-group">
              <label htmlFor="projectName">Project Name</label>
              <input
                id="projectName"
                type="text"
                placeholder="e.g., Company Support Bot"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
              <small>Give your chatbot a name</small>
            </div>

            {/* PDF Upload */}
            <div className="form-group">
              <label htmlFor="pdfFile">Upload PDF</label>
              <div className="file-upload-area">
                <input
                  id="pdfFile"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <div className="file-upload-content">
                  <p className="upload-icon">📄</p>
                  <p className="upload-text">
                    {pdfFile ? pdfFile.name : 'Drag and drop your PDF here, or click to select'}
                  </p>
                  <small>PDF files only • Max 10MB</small>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && <p className="error-message">{error}</p>}

            {/* Submit Button */}
            <button type="submit" className="submit-btn">
              Create Project
            </button>
          </form>
        </div>
      </main>

      <style jsx>{`
        .create-project-page {
          min-height: 100vh;
          background: #f5f5f7;
        }

        .loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }

        .header {
          padding: 20px 40px;
          background: white;
          border-bottom: 1px solid #e5e5e7;
        }

        .back-link {
          color: #0071e3;
          text-decoration: none;
          font-weight: 500;
        }

        .back-link:hover {
          text-decoration: underline;
        }

        .create-project-content {
          max-width: 600px;
          margin: 40px auto;
          padding: 0 20px;
        }

        .form-container {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
        }

        h1 {
          margin-bottom: 8px;
          font-size: 2rem;
        }

        .subtitle {
          color: #86868b;
          margin-bottom: 32px;
          font-size: 1rem;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-weight: 600;
          color: #1d1d1f;
        }

        input[type="text"] {
          padding: 12px 16px;
          border: 1px solid #d2d2d7;
          border-radius: 8px;
          font-size: 1rem;
          font-family: inherit;
        }

        input[type="text"]:focus {
          outline: none;
          border-color: #0071e3;
          box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.1);
        }

        small {
          color: #86868b;
          font-size: 0.875rem;
        }

        .file-input {
          display: none;
        }

        .file-upload-area {
          position: relative;
          border: 2px dashed #d2d2d7;
          border-radius: 8px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }

        .file-upload-area:hover {
          border-color: #0071e3;
          background: rgba(0, 113, 227, 0.05);
        }

        .file-upload-content {
          pointer-events: none;
        }

        .upload-icon {
          font-size: 3rem;
          margin: 0 0 12px;
        }

        .upload-text {
          font-size: 1rem;
          color: #1d1d1f;
          margin: 0;
          font-weight: 500;
        }

        .error-message {
          padding: 12px 16px;
          background: #fee;
          border: 1px solid #fcc;
          color: #c33;
          border-radius: 8px;
          font-size: 0.9rem;
          margin: 0;
        }

        .submit-btn {
          padding: 12px 24px;
          background: #0071e3;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }

        .submit-btn:hover {
          background: #0077ed;
        }

        .submit-btn:active {
          transform: scale(0.98);
        }

        @media (max-width: 768px) {
          .header {
            padding: 16px 20px;
          }

          .form-container {
            padding: 24px;
          }

          h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
