'use client';

import React, { useState, useEffect } from 'react';
import { SAMPLE_VILLAGES } from '../../lib/data';

interface Village {
  name: string;
  district: string;
  state: string;
  pincode: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Village[]>(SAMPLE_VILLAGES as Village[]);
  const [loading, setLoading] = useState(false);
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults(SAMPLE_VILLAGES as Village[]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}`, {
          headers: {
            'x-api-key': isDev ? 'DEV-MASTER-KEY' : 'anonymous',
            'x-plan-tier': 'FREE'
          }
        });
        const data = await response.json();
        
        if (response.status === 429) {
          alert('Rate limit exceeded for your Free plan (10 requests/day).');
          return;
        }

        setResults(data.results || []);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <main style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            &larr; Back to Home
          </a>
          <button 
            onClick={() => setIsDev(!isDev)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '20px',
              border: `1px solid ${isDev ? '#000' : '#ddd'}`,
              background: isDev ? '#000' : 'transparent',
              color: isDev ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            {isDev ? '🚀 Developer Mode ON' : 'Enable Dev Mode'}
          </button>
        </div>
        
        <h1 className="title" style={{ fontSize: '3rem', textAlign: 'left', marginBottom: '2rem' }}>
          Explore India
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
          Search through 600,000+ villages, sub-districts, and districts across India.
        </p>

        <div style={{ 
          padding: '0.5rem 1rem', 
          marginBottom: '3rem', 
          display: 'flex', 
          gap: '1rem',
          background: '#f5f5f7',
          borderRadius: '16px',
          border: '1px solid #eee'
        }}>
          <input 
            type="text" 
            placeholder="Search by Village, District, or State..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flexGrow: 1,
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              fontSize: '1.1rem',
              outline: 'none',
              padding: '0.8rem'
            }}
          />
          <button style={{ 
            padding: '0.5rem 2rem',
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Search
          </button>
        </div>

        <div className="results-grid" style={{ display: 'grid', gap: '1.5rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Searching the database...
            </div>
          ) : results.length > 0 ? (
            results.map((village, index) => (
              <div key={index} style={{ 
                padding: '1.5rem', 
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid #eee',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', color: '#111', fontWeight: 700, marginBottom: '0.25rem' }}>{village.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {village.district}, {village.state}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: '#0070f3', fontWeight: '800', letterSpacing: '0.05em' }}>PINCODE</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{village.pincode}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No results found for "{query}".
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
