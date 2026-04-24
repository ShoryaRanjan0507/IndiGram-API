'use client';

import React, { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials');
        return;
      }

      window.location.href = '/search';
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#fafafa' }}>
      <div style={{
        width: '100%',
        maxWidth: '460px',
        background: '#fff',
        borderRadius: '24px',
        padding: '3rem',
        border: '1px solid #eee',
        boxShadow: '0 10px 40px rgba(0,0,0,0.06)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#111' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em' }}>IndiGram</span>
          </a>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: '1.5rem', color: '#111' }}>Welcome back</h1>
          <p style={{ color: '#666', fontSize: '0.95rem', marginTop: '0.5rem' }}>
            Sign in to your IndiGram account
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fff0f0',
            border: '1px solid #ffcdd2',
            color: '#d32f2f',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: '0.4rem' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '12px',
                border: '1px solid #ddd',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border 0.2s ease',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#333', marginBottom: '0.4rem' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Your password"
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '12px',
                border: '1px solid #ddd',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border 0.2s ease',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.9rem',
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
          Don&apos;t have an account?{' '}
          <a href="/signup" style={{ color: '#0070f3', fontWeight: 600, textDecoration: 'none' }}>Sign Up</a>
        </p>
      </div>
    </main>
  );
}
