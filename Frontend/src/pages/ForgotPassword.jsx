import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';

function AuthBackground({ children }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(145deg, #F0F4FF 0%, #FEFEFF 40%, #F5F0FF 100%)',
    }}>
      <div className="blob-wrap">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(79,70,229,0.08) 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.4, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 400 }}>
        {children}
      </div>
    </div>
  );
}

function AuthCard({ children }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)',
      border: '1.5px solid rgba(255,255,255,0.7)', borderRadius: 24,
      padding: '40px 36px',
      boxShadow: '0 20px 80px rgba(79,70,229,0.15), 0 4px 24px rgba(0,0,0,0.05)',
      animation: 'fadeInUp 0.4s cubic-bezier(0.22,1,0.36,1) both',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <span style={{ fontSize: 36, display: 'block', margin: '0 auto 8px' }}>💰</span>
        <span className="gradient-text" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '1.125rem' }}>Spend Matrix</span>
        <div style={{ height: 1.5, background: 'linear-gradient(90deg, transparent, rgba(79,70,229,0.2), transparent)', margin: '16px 0' }} />
      </div>
      {children}
    </div>
  );
}

function ErrorAlert({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '12px 14px', color: '#DC2626', fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: '0.875rem', marginBottom: 16, display: 'flex', gap: 8 }}>
      ⚠️ {msg}
    </div>
  );
}

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) return setError('Email is required.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Enter a valid email.');
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <AuthBackground>
      <AuthCard>
        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 60, height: 60, borderRadius: '50%', background: 'rgba(16,185,129,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', animation: 'countUp 0.4s ease',
            }}>
              <span style={{ fontSize: 30, color: '#059669' }}>✓</span>
            </div>
            <h2 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '1.25rem', color: '#111827' }}>Check your inbox!</h2>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6, marginTop: 8 }}>
              A reset link has been sent to your email address. Check your spam folder if you don't see it.
            </p>
            <Link to="/login" style={{ display: 'block', marginTop: 20, fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: '0.875rem', color: '#4F46E5', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
            >← Back to Sign In</Link>
          </div>
        ) : (
          <>
            <h1 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '1.625rem', color: '#111827', marginBottom: 4 }}>Forgot Password</h1>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '0.875rem', color: '#6B7280', marginBottom: 28 }}>Enter your email and we'll send you a reset link.</p>

            <ErrorAlert msg={error} />

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }} noValidate>
              <div>
                <label className="input-label">Email</label>
                <input
                  className="input"
                  type="email" placeholder="you@example.com" value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                  style={{ borderColor: focused ? '#4F46E5' : undefined, boxShadow: focused ? '0 0 0 3px rgba(79,70,229,0.15)' : undefined }}
                />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ height: 48, width: '100%' }}>
                {loading ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2.5 }} /> Sending...</> : 'Send Reset Link'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', color: '#6B7280', marginTop: 20 }}>
              Remember your password?{' '}
              <Link to="/login" style={{ color: '#4F46E5', fontWeight: 600, textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
              >Sign in</Link>
            </p>
          </>
        )}
      </AuthCard>
    </AuthBackground>
  );
}
