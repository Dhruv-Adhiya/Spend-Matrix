import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;
    if (!token) { setStatus('error'); setMessage('Invalid or missing verification token.'); return; }
    authAPI.verifyEmail(token)
      .then(() => { setStatus('success'); setMessage('Your account is ready. You can now sign in to Spend Matrix.'); })
      .catch((err) => {
        const e = err.response?.data?.error || '';
        if (e === 'Email is already verified.') { setStatus('success'); setMessage('Your email is already verified. You can log in.'); }
        else { setStatus('error'); setMessage(e || 'Verification failed. The link may have expired.'); }
      });
  }, [token]);

  return (
    <AuthBackground>
      <div style={{
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)',
        border: '1.5px solid rgba(255,255,255,0.7)', borderRadius: 24,
        padding: '40px 36px', textAlign: 'center',
        boxShadow: '0 20px 80px rgba(79,70,229,0.15), 0 4px 24px rgba(0,0,0,0.05)',
        animation: 'fadeInUp 0.4s cubic-bezier(0.22,1,0.36,1) both',
      }}>
        {/* Logo */}
        <span style={{ fontSize: 36, display: 'block', margin: '0 auto 8px' }}>💰</span>
        <span className="gradient-text" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '1.125rem' }}>Spend Matrix</span>
        <div style={{ height: 1.5, background: 'linear-gradient(90deg, transparent, rgba(79,70,229,0.2), transparent)', margin: '16px 0 24px' }} />

        {status === 'loading' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <span className="spinner" style={{ width: 48, height: 48, borderWidth: 4 }} />
            </div>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: '0.9375rem', color: '#6B7280' }}>Verifying your email...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{
              width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', animation: 'countUp 0.5s cubic-bezier(0.34,1.56,0.64,1)',
            }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M8 18l7 7 13-13" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="gradient-text" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '1.5rem' }}>Email Verified!</h2>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '0.9375rem', color: '#6B7280', lineHeight: 1.6, margin: '12px 0 24px' }}>{message}</p>
            <Link to="/login" className="btn btn-primary" style={{ display: 'flex', height: 48, textDecoration: 'none', justifyContent: 'center', alignItems: 'center' }}>
              Go to Login →
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{
              width: 80, height: 80, borderRadius: '50%', background: 'rgba(245,158,11,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', animation: 'countUp 0.5s ease',
            }}>
              <span style={{ fontSize: 36, color: '#D97706' }}>⚠️</span>
            </div>
            <h2 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '1.5rem', color: '#111827' }}>Verification Failed</h2>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '0.875rem', color: '#6B7280', margin: '12px 0 24px' }}>{message}</p>
            <Link to="/login" className="btn btn-secondary" style={{ display: 'flex', height: 48, textDecoration: 'none', justifyContent: 'center', alignItems: 'center' }}>
              ← Back to Login
            </Link>
          </>
        )}
      </div>
    </AuthBackground>
  );
}
