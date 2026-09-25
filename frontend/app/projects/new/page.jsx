'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateProject() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        router.push('/auth/login');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [router]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        setPdfFile(null);
      } else {
        setPdfFile(file);
        setError('');
      }
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

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Step 1: Create project in Firestore (without PDF URL yet)
      const projectsRef = collection(db, 'projects');
      const docRef = await addDoc(projectsRef, {
        userId: user.uid,
        name: projectName.trim(),
        description: projectDescription.trim(),
        fileName: pdfFile.name,
        fileSize: pdfFile.size,
        createdAt: serverTimestamp(),
        status: 'uploading',
        pdfUrl: null,
        messages: [],
      });

      // Step 2: Upload PDF to Cloud Storage
      const storage = getStorage();
      const storageRef = ref(storage, `pdfs/${user.uid}/${docRef.id}/${pdfFile.name}`);

      const snapshot = await uploadBytes(storageRef, pdfFile);
      
      // Step 3: Get download URL
      const pdfUrl = await getDownloadURL(snapshot.ref);

      // Step 4: Update Firestore with PDF URL and change status to processing
      await updateDoc(doc(db, 'projects', docRef.id), {
        pdfUrl: pdfUrl,
        status: 'processing',
      });

      // TODO: Trigger PDF processing (chunk, embed, store in vector DB)
      // For now, just redirect

      router.push('/dashboard');
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to create project');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="create-project-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-container">
          <Link href="/dashboard" className="back-link">
            ← Back to Dashboard
          </Link>
          <h1>Create New Project</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="page-content">
        <div className="content-container">
          <div className="form-container">
            <div className="form-header">
              <h2>Set Up Your AI Receptionist</h2>
              <p>Upload a PDF and we'll create a chatbot trained on your document</p>
            </div>

            <form onSubmit={handleSubmit} className="create-form">
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
                  className="form-input"
                  disabled={isSubmitting}
                />
                <small>This will appear in your project list</small>
              </div>

              {/* Project Description */}
              <div className="form-group">
                <label htmlFor="projectDescription">Description (Optional)</label>
                <textarea
                  id="projectDescription"
                  placeholder="Describe what this chatbot will help with..."
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  rows={3}
                  className="form-textarea"
                  disabled={isSubmitting}
                />
                <small>Help yourself remember what this project is for</small>
              </div>

              {/* PDF Upload */}
              <div className="form-group">
                <label htmlFor="pdfFile">Upload PDF Document</label>
                <div className="file-upload-wrapper">
                  <input
                    id="pdfFile"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="file-input"
                    required
                    disabled={isSubmitting}
                  />
                  <div className="file-upload-area">
                    <div className="upload-icon">📄</div>
                    <div className="upload-text">
                      {pdfFile ? (
                        <>
                          <p className="file-name">{pdfFile.name}</p>
                          <p className="file-size">
                            {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <p className="change-file">Click to change</p>
                        </>
                      ) : (
                        <>
                          <p className="main-text">
                            Drag and drop your PDF here
                          </p>
                          <p className="sub-text">or click to browse</p>
                          <p className="file-hint">PDF files only • Max 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && <div className="error-message">{error}</div>}

              {/* Upload Progress */}
              {isSubmitting && uploadProgress > 0 && (
                <div className="progress-container">
                  <div className="progress-label">
                    <span>Uploading...</span>
                    <span className="progress-value">{uploadProgress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn btn-primary btn-lg btn-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-small"></span>
                    Creating Project...
                  </>
                ) : (
                  <>
                    Create Project
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>

            {/* Info Box */}
            <div className="info-box">
              <h4>What happens next?</h4>
              <ul>
                <li>We'll upload your PDF securely to our servers</li>
                <li>Extract and analyze the content</li>
                <li>Train our AI on your document</li>
                <li>Generate a shareable chatbot link</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .loading-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #1a1a1e 0%, #252529 100%);
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

        .spinner-small {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-right: var(--spacing-2);
        }

        /* Page Layout */
        .create-project-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #1a1a1e 0%, #252529 100%);
          color: white;
        }

        /* Header */
        .page-header {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding: var(--spacing-6) 0;
        }

        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--spacing-4);
        }

        .back-link {
          display: inline-block;
          color: #64d3ff;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          margin-bottom: var(--spacing-3);
          transition: color 0.2s;
        }

        .back-link:hover {
          color: #00d4ff;
        }

        .page-header h1 {
          font-size: 1.875rem;
          margin: 0;
        }

        /* Content */
        .page-content {
          padding: var(--spacing-12) 0;
          min-height: calc(100vh - 100px);
        }

        .content-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 0 var(--spacing-4);
        }

        .form-container {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          padding: var(--spacing-8);
        }

        .form-header {
          margin-bottom: var(--spacing-8);
          text-align: center;
        }

        .form-header h2 {
          font-size: 1.75rem;
          margin-bottom: var(--spacing-2);
        }

        .form-header p {
          color: #b0b0b8;
          font-size: 1rem;
          margin: 0;
        }

        /* Form */
        .create-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-6);
          margin-bottom: var(--spacing-8);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
        }

        .form-group label {
          font-weight: 600;
          font-size: 0.95rem;
        }

        .form-input,
        .form-textarea {
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
          color: white;
          font-size: 1rem;
          font-family: var(--font-family);
          transition: all 0.2s;
        }

        .form-input:disabled,
        .form-textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #7a7a82;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #0284c7;
          background: rgba(2, 132, 199, 0.1);
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
        }

        .form-textarea {
          resize: vertical;
        }

        .form-group small {
          color: #7a7a82;
          font-size: 0.85rem;
        }

        /* File Upload */
        .file-upload-wrapper {
          position: relative;
        }

        .file-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          z-index: 10;
        }

        .file-input:disabled {
          cursor: not-allowed;
        }

        .file-upload-area {
          border: 2px dashed rgba(2, 132, 199, 0.3);
          border-radius: var(--radius-md);
          padding: var(--spacing-8);
          text-align: center;
          background: rgba(2, 132, 199, 0.05);
          transition: all 0.2s;
          cursor: pointer;
        }

        .file-input:hover:not(:disabled) + .file-upload-area,
        .file-input:focus + .file-upload-area {
          border-color: #0284c7;
          background: rgba(2, 132, 199, 0.1);
        }

        .file-input:disabled + .file-upload-area {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .upload-icon {
          font-size: 2.5rem;
          margin-bottom: var(--spacing-3);
        }

        .upload-text p {
          margin: 0;
          line-height: 1.5;
        }

        .main-text {
          font-size: 1rem;
          font-weight: 600;
          color: white;
        }

        .sub-text {
          font-size: 0.95rem;
          color: #b0b0b8;
          margin-top: var(--spacing-2);
        }

        .file-hint {
          font-size: 0.85rem;
          color: #7a7a82;
          margin-top: var(--spacing-2);
        }

        .file-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: #64d3ff;
        }

        .file-size {
          font-size: 0.85rem;
          color: #b0b0b8;
          margin-top: var(--spacing-2);
        }

        .change-file {
          font-size: 0.85rem;
          color: #7a7a82;
          margin-top: var(--spacing-3);
        }

        /* Progress Bar */
        .progress-container {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2);
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: #b0b0b8;
        }

        .progress-value {
          font-weight: 600;
          color: #64d3ff;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #0284c7 0%, #0369a1 100%);
          transition: width 0.3s ease;
        }

        /* Buttons */
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

        .btn-lg {
          padding: 16px 32px;
          font-size: 1.125rem;
        }

        .btn-full {
          width: 100%;
        }

        .btn-arrow {
          transition: transform 0.2s;
        }

        .btn:hover:not(:disabled) .btn-arrow {
          transform: translateX(4px);
        }

        /* Error Message */
        .error-message {
          padding: var(--spacing-3) var(--spacing-4);
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ff7777;
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* Info Box */
        .info-box {
          background: rgba(2, 132, 199, 0.1);
          border: 1px solid rgba(2, 132, 199, 0.3);
          border-radius: var(--radius-md);
          padding: var(--spacing-6);
        }

        .info-box h4 {
          font-size: 1rem;
          margin: 0 0 var(--spacing-3);
          color: #64d3ff;
        }

        .info-box ul {
          margin: 0;
          padding: 0 0 0 var(--spacing-4);
          list-style: none;
        }

        .info-box li {
          color: #b0b0b8;
          font-size: 0.95rem;
          margin-bottom: var(--spacing-2);
        }

        .info-box li:before {
          content: "✓ ";
          color: #34c759;
          font-weight: 700;
          margin-right: var(--spacing-2);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .page-header h1 {
            font-size: 1.5rem;
          }

          .form-container {
            padding: var(--spacing-6);
          }

          .form-header h2 {
            font-size: 1.5rem;
          }

          .file-upload-area {
            padding: var(--spacing-6);
          }
        }
      `}</style>
    </div>
  );
}
