import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

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
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440 }}>
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
      {/* Logo */}
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
    <div style={{
      background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)',
      borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '12px 14px',
      color: '#DC2626', fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: '0.875rem',
      marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 8,
    }}>⚠️ {msg}</div>
  );
}

function StyledInput({ label, error, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {label && <label className="input-label">{label}</label>}
      <input
        className={`input${error ? ' error' : ''}`}
        style={{ boxShadow: focused ? '0 0 0 3px rgba(79,70,229,0.15)' : undefined, borderColor: focused && !error ? '#4F46E5' : undefined }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error && <p className="input-error">{error}</p>}
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ve = validate();
    if (Object.keys(ve).length) return setErrors(ve);
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <AuthBackground>
      <AuthCard>
        <h1 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '1.625rem', color: '#111827', marginBottom: 4 }}>Welcome back</h1>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '0.875rem', color: '#6B7280', marginBottom: 28 }}>Sign in to your Spend Matrix account</p>

        <ErrorAlert msg={serverError} />

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }} noValidate>
          <StyledInput label="Email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} error={errors.email} />
          <StyledInput label="Password" name="password" type="password" placeholder="Your password" value={form.password} onChange={handleChange} error={errors.password} />

          <div style={{ textAlign: 'right', marginTop: -8 }}>
            <Link to="/forgot-password" style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: '0.8rem', color: '#4F46E5', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
            >Forgot password?</Link>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ height: 48, width: '100%' }}>
            {loading ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2.5 }} /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #E5E7EB' }} />
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', color: '#9CA3AF' }}>or</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #E5E7EB' }} />
        </div>

        <p style={{ textAlign: 'center', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', color: '#6B7280' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#4F46E5', fontWeight: 600, textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
          >Register</Link>
        </p>
      </AuthCard>
    </AuthBackground>
  );
}
