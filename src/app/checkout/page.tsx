'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SUBSCRIPTION_PLANS } from '../../config/plans';

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  plan: string;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const planKey = (searchParams.get('plan') || 'PREMIUM').toUpperCase() as keyof typeof SUBSCRIPTION_PLANS;
  const plan = SUBSCRIPTION_PLANS[planKey] || SUBSCRIPTION_PLANS.PREMIUM;
  const planName = plan.name;
  const price = plan.price;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handlePayment = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update user plan in DB
    try {
      await fetch('/api/v1/auth/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      });
      setSuccess(true);
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#666', fontSize: '1.1rem' }}>Loading...</div>
      </main>
    );
  }

  if (success) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{
          padding: '4rem',
          maxWidth: '600px',
          textAlign: 'center',
          background: '#fff',
          borderRadius: '24px',
          border: '1px solid #eee',
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎉</div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#111', fontWeight: 800 }}>Welcome to {planName}!</h1>
          <p style={{ color: '#666', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
            Your account has been upgraded successfully. Enjoy unlimited access to the IndiGram API.
          </p>
          <a href="/search" style={{
            display: 'inline-block',
            padding: '1rem 2.5rem',
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '1rem',
          }}>
            Start Exploring →
          </a>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{
          padding: '4rem',
          maxWidth: '600px',
          textAlign: 'center',
          background: '#fff',
          borderRadius: '24px',
          border: '1px solid #eee',
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🔒</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#111', fontWeight: 800 }}>Sign in to continue</h1>
          <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1rem' }}>
            You need to be signed in to purchase the {planName} plan.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="/login" style={{
              padding: '0.9rem 2rem',
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '1rem',
            }}>
              Sign In
            </a>
            <a href="/signup" style={{
              padding: '0.9rem 2rem',
              background: 'transparent',
              color: '#000',
              border: '1px solid #000',
              borderRadius: '12px',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '1rem',
            }}>
              Sign Up
            </a>
          </div>
          <a href="/" style={{ display: 'block', marginTop: '1.5rem', color: '#999', textDecoration: 'none', fontSize: '0.9rem' }}>
            &larr; Back to home
          </a>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{
        padding: '3rem',
        maxWidth: '600px',
        width: '100%',
        background: '#fff',
        borderRadius: '24px',
        border: '1px solid #eee',
        boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💎</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#111', fontWeight: 800 }}>Upgrade to {planName}</h1>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>
            Unlock higher rate limits and priority support.
          </p>
        </div>

        {/* User Info Card */}
        <div style={{
          background: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '16px',
          marginBottom: '1.5rem',
          border: '1px solid #eee',
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0070f3', marginBottom: '1rem' }}>
            Account Details
          </div>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#666', fontSize: '0.9rem' }}>Name</span>
              <span style={{ fontWeight: 600, color: '#111' }}>{user.name || '—'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#666', fontSize: '0.9rem' }}>Email</span>
              <span style={{ fontWeight: 600, color: '#111' }}>{user.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#666', fontSize: '0.9rem' }}>Phone</span>
              <span style={{ fontWeight: 600, color: '#111' }}>{user.phone || '—'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#666', fontSize: '0.9rem' }}>Current Plan</span>
              <span style={{
                fontWeight: 700,
                fontSize: '0.8rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                background: user.plan === 'FREE' ? '#f0f0f0' : '#e8f5e9',
                color: user.plan === 'FREE' ? '#666' : '#2e7d32',
              }}>
                {user.plan}
              </span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid #eee' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0070f3', marginBottom: '1rem' }}>
            Order Summary
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: '#666' }}>{planName} Subscription</span>
            <span style={{ fontWeight: 'bold' }}>${price}.00/mo</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
            <span style={{ fontWeight: 'bold' }}>Total due today</span>
            <span style={{ fontWeight: 'bold', color: '#0070f3', fontSize: '1.2rem' }}>${price}.00</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={processing}
          style={{
            width: '100%',
            marginBottom: '1rem',
            padding: '1rem',
            background: processing ? '#333' : '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: processing ? 'wait' : 'pointer',
            fontSize: '1rem',
            transition: 'all 0.2s ease',
          }}
        >
          {processing ? '⏳ Processing Payment...' : `Pay $${price}.00 → Upgrade to ${planName}`}
        </button>

        <a href="/" style={{ display: 'block', textAlign: 'center', color: '#999', textDecoration: 'none', fontSize: '0.9rem' }}>
          &larr; Back to plans
        </a>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ color: '#666', textAlign: 'center', paddingTop: '20vh' }}>Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
