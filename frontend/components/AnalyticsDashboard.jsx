'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { authHeaders } from '@/lib/authHeaders';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function AnalyticsDashboard({ projectId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!projectId) return;
    (async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/projects/${projectId}/stats`,
          { headers: await authHeaders() }
        );
        setStats(res.data.stats);
      } catch (err) {
        setError(err.response?.data?.detail || err.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    })();
  }, [projectId]);

  const box = {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 24,
  };

  const card = {
    background: 'rgba(2,132,199,0.1)',
    border: '1px solid rgba(2,132,199,0.3)',
    borderRadius: 8,
    padding: 16,
    textAlign: 'center',
  };

  if (loading) return <div style={box}><p style={{ color: '#b0b0b8', margin: 0 }}>Loading analytics...</p></div>;
  if (error) return <div style={box}><p style={{ color: '#ff7777', margin: 0 }}>{error}</p></div>;
  if (!stats) return null;

  return (
    <div style={box}>
      <h3 style={{ margin: '0 0 16px', color: 'white' }}>Analytics</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
        <div style={card}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#64d3ff' }}>{stats.totalMessages}</div>
          <div style={{ fontSize: '0.85rem', color: '#b0b0b8' }}>Total Messages</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#64d3ff' }}>{Math.round((stats.averageConfidence || 0) * 100)}%</div>
          <div style={{ fontSize: '0.85rem', color: '#b0b0b8' }}>Avg Confidence</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#64d3ff' }}>{stats.groundedPercentage || 0}%</div>
          <div style={{ fontSize: '0.85rem', color: '#b0b0b8' }}>Grounded</div>
        </div>
      </div>
    </div>
  );
}
