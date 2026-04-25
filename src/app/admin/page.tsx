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

interface Stats {
  totalUsers: number;
  totalRequests: number;
  estimatedRevenue: number;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const fetchData = () => {
    // Fetch all users for admin
    fetch('/api/v1/admin/users')
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        setUsers(data.users || []);
        setStats(data.stats || null);
      })
      .catch(err => {
        setError(err.message);
      });

    // Fetch current admin user info
    fetch('/api/v1/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setCurrentUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/v1/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const handleUpdatePlan = async (userId: string, newPlan: string) => {
    setUpdating(userId);
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: newPlan }),
      });
      if (res.ok) {
        fetchData(); // Refresh data
      }
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setUpdating(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', color: '#fff' }}>
        <div className="loader">Loading Admin Console...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', color: '#fff' }}>
        <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(255,0,0,0.05)', borderRadius: '24px', border: '1px solid rgba(255,0,0,0.1)' }}>
          <h1 style={{ color: '#ff0080', fontSize: '2.5rem', marginBottom: '1rem' }}>Access Denied</h1>
          <p style={{ opacity: 0.6, marginBottom: '2rem' }}>You do not have administrative privileges to access this area.</p>
          <a href="/dashboard" style={{ color: '#fff', background: '#0070f3', padding: '0.8rem 2rem', borderRadius: '12px', textDecoration: 'none', fontWeight: 600 }}>Return to Dashboard</a>
        </div>
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fff', padding: '3rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.04em', margin: 0 }}>Platform Admin</h1>
            <p style={{ opacity: 0.5, marginTop: '0.5rem' }}>IndiGram Global Management & Analytics</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>
            <a href="/dashboard" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 600, padding: '0.6rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(0,112,243,0.3)' }}>
              &larr; Dashboard
            </a>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700 }}>{currentUser?.name}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{currentUser?.email}</div>
            </div>

            <button 
              onClick={() => {
                console.log('Admin Avatar clicked, current showMenu:', showMenu);
                setShowMenu(!showMenu);
              }}
              style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '50%', 
                background: 'linear-gradient(45deg, #0070f3, #ff0080)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#fff',
                fontSize: '1.1rem',
                fontWeight: 800,
                cursor: 'pointer',
                border: 'none',
                boxShadow: '0 4px 15px rgba(0,112,243,0.3)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: showMenu ? 'scale(1.1) rotate(5deg)' : 'scale(1)',
                zIndex: 1001,
                position: 'relative'
              }}>
              {currentUser?.name?.[0] || 'A'}
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '1rem',
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '0.6rem',
                minWidth: '200px',
                zIndex: 1002,
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                backdropFilter: 'blur(20px)',
                animation: 'revealUp 0.2s ease-out'
              }}>
                <a href="/" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.8rem 1rem',
                  color: '#fff',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  borderRadius: '10px',
                  transition: 'background 0.2s',
                  background: 'transparent'
                }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                   onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                  Home Page
                </a>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '0.4rem 0' }}></div>
                <button 
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.8rem 1rem',
                    color: '#ff4d4d',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '0.9rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,77,77,0.1)'}
                     onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                  Log Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '4rem' }}>
          {[
            { label: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: '#0070f3' },
            { label: 'API Requests', value: stats?.totalRequests.toLocaleString() || 0, icon: '⚡', color: '#ff0080' },
            { label: 'Est. Revenue', value: `$${stats?.estimatedRevenue || 0}`, icon: '💰', color: '#00ff80' }
          ].map((stat, i) => (
            <div key={i} style={{ 
              background: 'rgba(255,255,255,0.02)', 
              padding: '2rem', 
              borderRadius: '24px', 
              border: '1px solid rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{stat.icon}</div>
              <div style={{ opacity: 0.5, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{stat.label}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Users Management */}
        <div style={{ 
          background: 'rgba(255,255,255,0.02)', 
          borderRadius: '24px', 
          border: '1px solid rgba(255,255,255,0.05)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Registered Users</h2>
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '0.6rem 1.2rem',
                borderRadius: '12px',
                color: '#fff',
                width: '300px',
                outline: 'none'
              }}
            />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '1.25rem', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>User Details</th>
                <th style={{ padding: '1.25rem', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>Plan</th>
                <th style={{ padding: '1.25rem', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>API Key / Usage</th>
                <th style={{ padding: '1.25rem', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '1.25rem' }}>
                    <div style={{ fontWeight: 600 }}>{user.name}</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.4 }}>{user.email}</div>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 800, 
                      padding: '0.3rem 0.8rem', 
                      borderRadius: '20px', 
                      background: user.plan === 'FREE' ? 'rgba(255,255,255,0.05)' : 'rgba(0,255,128,0.1)',
                      color: user.plan === 'FREE' ? '#888' : '#00ff80',
                      border: `1px solid ${user.plan === 'FREE' ? 'rgba(255,255,255,0.1)' : 'rgba(0,255,128,0.2)'}`
                    }}>
                      {user.plan}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <code style={{ fontSize: '0.8rem', color: '#0070f3', display: 'block', marginBottom: '0.3rem' }}>
                      {user.apiKeys[0]?.key || 'None'}
                    </code>
                    <span style={{ fontSize: '0.75rem', opacity: 0.4 }}>
                      Used: <strong>{user.apiKeys[0]?.usage || 0}</strong> requests
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                    <select 
                      value={user.plan}
                      disabled={updating === user.id}
                      onChange={(e) => handleUpdatePlan(user.id, e.target.value)}
                      style={{
                        background: '#111',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="FREE">FREE</option>
                      <option value="PREMIUM">PREMIUM</option>
                      <option value="PRO">PRO</option>
                      <option value="UNLIMITED">UNLIMITED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div style={{ padding: '4rem', textAlign: 'center', opacity: 0.4 }}>
              No users found matching your search.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
