'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import ChatHistory from '@/components/ChatHistory';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

export default function ProjectDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push('/auth/login');
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'projects', id));
        if (!snap.exists() || snap.data().userId !== user.uid) {
          setError('Project not found');
        } else {
          setProject({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        setError('Could not load project');
      }
      setReady(true);
    });
    return unsubscribe;
  }, [id, router]);

  if (!ready) {
    return <div style={{ padding: 32, color: '#b0b0b8' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ padding: 32, color: '#ff7777' }}>{error}</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #1a1a1e 0%, #252529 100%)', color: 'white' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Link href="/dashboard" style={{ color: '#64d3ff', textDecoration: 'none' }}>
          ← Back to Dashboard
        </Link>

        <div>
          <h1 style={{ fontSize: '1.75rem', margin: 0 }}>{project.name}</h1>
          {project.description && (
            <p style={{ color: '#b0b0b8', margin: '8px 0 0' }}>{project.description}</p>
          )}
          <p style={{ color: '#7a7a82', margin: '8px 0 0', fontSize: '0.9rem' }}>
            Status: {project.status} · Public link:{' '}
            <a href={`/chat/${project.id}`} target="_blank" rel="noreferrer" style={{ color: '#64d3ff' }}>
              /chat/{project.id}
            </a>
          </p>
        </div>

        <AnalyticsDashboard projectId={project.id} />
        <ChatHistory projectId={project.id} />
      </div>
    </div>
  );
}
