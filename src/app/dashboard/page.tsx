'use client';

import React, { useState, useEffect } from 'react';
import { SUBSCRIPTION_PLANS } from '../../config/plans';

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

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        } else {
          window.location.href = '/login';
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        window.location.href = '/login';
      });
  }, []);

  const handleLogout = async () => {
    await fetch('/api/v1/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff' }}>
        <div className="loader">Loading Dashboard...</div>
      </div>
    );
  }

  if (!user) return null;

  const userPlan = SUBSCRIPTION_PLANS[user.plan] || SUBSCRIPTION_PLANS.FREE;
  const apiKey = user.apiKeys[0]?.key || 'No key generated';
  const usage = user.apiKeys[0]?.usage || 0;
  const limit = userPlan.limit;
  const usagePercent = limit === Infinity ? 0 : Math.min(100, (usage / limit) * 100);

  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fff', padding: '2rem' }}>
      {/* Background Decor */}
      <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(0,112,243,0.15) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }}></div>
      <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(255,0,128,0.1) 0%, transparent 70%)', filter: 'blur(100px)', zIndex: 0 }}></div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem', paddingTop: '2rem' }}>
          <div>
            <a href="/" style={{ textDecoration: 'none', color: '#fff' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.04em', margin: 0 }}>IndiGram</h1>
            </a>
            <p style={{ opacity: 0.5, fontSize: '0.9rem', marginTop: '0.4rem' }}>Developer Console</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>
             {user.role === 'ADMIN' && (
               <a href="/admin" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>Admin Panel</a>
             )}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700 }}>{user.name}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{user.email}</div>
            </div>
            <button 
              onClick={() => {
                console.log('Avatar clicked, current showMenu:', showMenu);
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
              {user.name?.[0] || 'U'}
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
                  <span style={{ fontSize: '1.1rem' }}>🏠</span> Home Page
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
                  <span style={{ fontSize: '1.1rem' }}>🚪</span> Log Out
                </button>
              </div>
            )}
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* API Key Card */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              borderRadius: '24px', 
              padding: '2.5rem', 
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)'
            }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#0070f3' }}>●</span> Your API Key
              </h2>
              <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Use this key in the <code>x-api-key</code> header to authenticate your requests. Keep it secret!
              </p>
              
              <div style={{ 
                display: 'flex', 
                background: 'rgba(0,0,0,0.3)', 
                padding: '1rem 1.5rem', 
                borderRadius: '16px', 
                border: '1px solid rgba(255,255,255,0.1)',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <code style={{ flexGrow: 1, fontSize: '1.1rem', letterSpacing: '0.05em', color: '#0070f3' }}>
                  {apiKey}
                </code>
                <button 
                  onClick={() => copyToClipboard(apiKey)}
                  style={{
                    background: copied ? '#0070f3' : 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    border: 'none',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.85rem'
                  }}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Usage Stats Card */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              borderRadius: '24px', 
              padding: '2.5rem', 
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Daily API Usage</h2>
                <span style={{ 
                  fontSize: '0.8rem', 
                  padding: '0.4rem 1rem', 
                  borderRadius: '20px', 
                  background: 'rgba(0,112,243,0.1)', 
                  color: '#0070f3',
                  fontWeight: 700
                }}>
                  {user.plan} PLAN
                </span>
              </div>

              <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ opacity: 0.6 }}>Requests Used</span>
                <span style={{ fontWeight: 700 }}>{usage} / {limit === Infinity ? '∞' : limit}</span>
              </div>

              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${usagePercent}%`, 
                  height: '100%', 
                  background: 'linear-gradient(90deg, #0070f3, #ff0080)', 
                  borderRadius: '4px',
                  transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}></div>
              </div>

              <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', opacity: 0.5 }}>
                Resetting in 14 hours. Upgrade to Pro for higher limits.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              borderRadius: '24px', 
              padding: '2rem', 
              border: '1px solid rgba(255, 255, 255, 0.08)' 
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Current Plan</h3>
              <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>${userPlan.price}<span style={{ fontSize: '1rem', opacity: 0.5 }}>/mo</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {userPlan.features.map((f, i) => (
                  <li key={i} style={{ fontSize: '0.9rem', opacity: 0.7, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#0070f3' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <a 
                href="/#plans"
                style={{ 
                  display: 'block', 
                  width: '100%', 
                  padding: '1rem', 
                  background: '#fff', 
                  color: '#000', 
                  textAlign: 'center', 
                  textDecoration: 'none', 
                  borderRadius: '12px', 
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}
              >
                Upgrade Plan
              </a>
            </div>

            <div style={{ 
              background: 'rgba(255, 255, 255, 0.03)', 
              borderRadius: '24px', 
              padding: '2rem', 
              border: '1px solid rgba(255, 255, 255, 0.08)' 
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.2rem' }}>Quick Links</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a href="/search" style={{ color: '#fff', opacity: 0.6, textDecoration: 'none', fontSize: '0.9rem' }}>Try API Search →</a>
                <a href="#" style={{ color: '#fff', opacity: 0.6, textDecoration: 'none', fontSize: '0.9rem' }}>Documentation →</a>
                <a href="#" style={{ color: '#fff', opacity: 0.6, textDecoration: 'none', fontSize: '0.9rem' }}>Support Ticket →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
