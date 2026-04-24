'use client';

import React, { useEffect } from 'react';
import { SUBSCRIPTION_PLANS, Plan } from '../config/plans';

export default function LandingPage() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <div className="grid-overlay"></div>

      {/* Floating Navbar */}
      <nav className="nav-pill">
        <span style={{ fontWeight: '800', letterSpacing: '-0.02em', fontSize: '1.2rem' }}>IndiGram</span>
        <a href="#features" className="nav-link">Features</a>
        <a href="#plans" className="nav-link">Plans</a>
        <a href="/search" className="btn-buy">Get Started</a>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <img 
          src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=2070" 
          alt="Peaceful Boatman Landscape" 
          className="hero-img" 
        />
        <h1 className="hero-title reveal" style={{ textTransform: 'none', color: '#111', zIndex: 10 }}>IndiGram</h1>
      </section>

      {/* Feature Grid */}
      <section id="features" className="container">
        <div className="grid">
          <div className="card reveal">
            <div className="card-img-wrap">
              <img src="https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&q=80&w=800" alt="Innovation" className="card-img" />
            </div>
            <span className="card-label">Innovation</span>
            <h2 className="card-title">Real-Time Geographical Data</h2>
          </div>

          <div className="card reveal">
            <div className="card-img-wrap">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800" alt="Performance" className="card-img" />
            </div>
            <span className="card-label">Performance</span>
            <h2 className="card-title">Sub-100ms API Response</h2>
          </div>

          <div className="card reveal">
            <div className="card-img-wrap">
              <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" alt="Precision" className="card-img" />
            </div>
            <span className="card-label">Reliability</span>
            <h2 className="card-title">Verified Village Datasets</h2>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="plans" className="container" style={{ paddingTop: 0 }}>
        <h2 className="reveal" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '3rem' }}>Selected Plans</h2>
        <div className="pricing-grid">
          {Object.values(SUBSCRIPTION_PLANS).map((plan: Plan, index: number) => (
            <div key={index} className="price-card reveal">
              <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 600, opacity: 0.5 }}>{plan.name}</span>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, margin: '1rem 0' }}>
                ${plan.price}<span style={{ fontSize: '1rem', fontWeight: 400, opacity: 0.5 }}>/mo</span>
              </div>
              <ul style={{ listStyle: 'none', margin: '2rem 0', flexGrow: 1 }}>
                <li style={{ marginBottom: '1rem' }}>✓ {plan.limit === Infinity ? 'Unlimited' : plan.limit} daily requests</li>
                <li style={{ marginBottom: '1rem' }}>✓ Standard API Access</li>
                <li style={{ marginBottom: '1rem', opacity: plan.price > 0 ? 1 : 0.3 }}>✓ Priority Support</li>
              </ul>
              <a 
                href={plan.name === 'Free' ? "/search" : `/checkout?plan=${plan.name}`} 
                className="btn-buy" 
                style={{ textAlign: 'center', background: plan.price > 0 ? '#000' : 'transparent', color: plan.price > 0 ? '#fff' : '#000', border: '1px solid #000' }}
              >
                {plan.price > 0 ? 'Buy Plan' : 'Get Started'}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container" style={{ textAlign: 'center', opacity: 0.3, fontSize: '0.9rem' }}>
        © 2024 IndiGram API Platform. High-Performance Geospatial Data.
      </footer>
    </main>
  );
}
