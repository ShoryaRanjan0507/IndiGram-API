'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { SUBSCRIPTION_PLANS } from '../../config/plans';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const planKey = (searchParams.get('plan') || 'PREMIUM').toUpperCase() as keyof typeof SUBSCRIPTION_PLANS;
  const plan = SUBSCRIPTION_PLANS[planKey] || SUBSCRIPTION_PLANS.PREMIUM;
  const planName = plan.name;
  const price = plan.price;

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ 
        padding: '4rem', 
        maxWidth: '600px', 
        textAlign: 'center',
        background: '#fff',
        borderRadius: '24px',
        border: '1px solid #eee',
        boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>💎</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#111', fontWeight: 800 }}>Upgrade to {planName}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
          You're about to unlock advanced geographical data, higher rate limits, and priority support with the {planName} tier.
        </p>
        
        <div style={{ background: '#f5f5f7', padding: '2rem', borderRadius: '16px', marginBottom: '2.5rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>{planName} Subscription</span>
            <span style={{ fontWeight: 'bold' }}>${price}.00/mo</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '1rem', marginTop: '1rem' }}>
            <span style={{ fontWeight: 'bold' }}>Total due today</span>
            <span style={{ fontWeight: 'bold', color: '#0070f3', fontSize: '1.2rem' }}>${price}.00</span>
          </div>
        </div>

        <button style={{ 
          width: '100%', 
          marginBottom: '1.5rem',
          padding: '1rem',
          background: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Proceed to Secure Payment
        </button>
        
        <a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>
          &larr; Back to plans
        </a>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ color: 'white', textAlign: 'center', paddingTop: '20vh' }}>Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
