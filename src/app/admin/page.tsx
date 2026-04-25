'use client';

import React, { useState, useEffect } from 'react';

interface ApiKey {
  key: string;
  usage: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  plan: string;
  role: string;
  apiKeys: ApiKey[];
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/v1/admin/users')
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff' }}>
        <div>Loading Admin Panel...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: '#ff0080' }}>Access Denied</h1>
          <p>You do not have administrative privileges.</p>
          <a href="/dashboard" style={{ color: '#0070f3' }}>Back to Dashboard</a>
        </div>
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#fafafa', color: '#111', padding: '3rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Admin Overview</h1>
            <p style={{ color: '#666' }}>Manage all IndiGram API users and keys</p>
          </div>
          <a href="/dashboard" style={{ textDecoration: 'none', color: '#0070f3', fontWeight: 600 }}>← Back to Dashboard</a>
        </header>

        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eee', overflow: 'hidden', boxShadow: '0 4px 30px rgba(0,0,0,0.03)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                <th style={{ padding: '1.25rem', fontSize: '0.85rem', fontWeight: 700, color: '#666' }}>USER</th>
                <th style={{ padding: '1.25rem', fontSize: '0.85rem', fontWeight: 700, color: '#666' }}>PLAN</th>
                <th style={{ padding: '1.25rem', fontSize: '0.85rem', fontWeight: 700, color: '#666' }}>API KEY</th>
                <th style={{ padding: '1.25rem', fontSize: '0.85rem', fontWeight: 700, color: '#666' }}>USAGE</th>
                <th style={{ padding: '1.25rem', fontSize: '0.85rem', fontWeight: 700, color: '#666' }}>ROLE</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1.25rem' }}>
                    <div style={{ fontWeight: 600 }}>{user.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#888' }}>{user.email}</div>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      padding: '0.25rem 0.6rem', 
                      borderRadius: '12px', 
                      background: user.plan === 'FREE' ? '#eee' : '#e8f5e9',
                      color: user.plan === 'FREE' ? '#666' : '#2e7d32'
                    }}>
                      {user.plan}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <code style={{ fontSize: '0.85rem', color: '#0070f3', background: '#f0f7ff', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {user.apiKeys[0]?.key || 'None'}
                    </code>
                  </td>
                  <td style={{ padding: '1.25rem', fontWeight: 600 }}>
                    {user.apiKeys[0]?.usage || 0}
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <span style={{ opacity: user.role === 'ADMIN' ? 1 : 0.3, fontWeight: user.role === 'ADMIN' ? 700 : 400 }}>
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
