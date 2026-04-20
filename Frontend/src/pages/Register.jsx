import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundImage: 'radial-gradient(circle, rgba(79,70,229,0.18) 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.6, pointerEvents: 'none' }} />
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
    <div style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '12px 14px', color: '#DC2626', fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: '0.875rem', marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <span style={{ flexShrink: 0 }}>⚠️</span><span>{msg}</span>
    </div>
  );
}

function SuccessAlert({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ background: 'rgba(16,185,129,0.07)', border: '1.5px solid rgba(16,185,129,0.25)', borderLeft: '3px solid #10B981', borderRadius: 10, padding: '12px 14px', color: '#065F46', fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: '0.875rem', marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <span style={{ flexShrink: 0 }}>✅</span><span>{msg}</span>
    </div>
  );
}

function StyledInput({ label, error, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {label && <label className="input-label">{label}</label>}
      <input
        className={`input${error ? ' error' : ''}`}
        style={{ borderColor: focused && !error ? '#4F46E5' : undefined, boxShadow: focused && !error ? '0 0 0 3px rgba(79,70,229,0.15)' : undefined }}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        {...props}
      />
      {error && <p className="input-error">{error}</p>}
    </div>
  );
}

function getStrength(pw) {
  if (!pw) return 0;
  if (pw.length < 6) return 1;
  if (pw.length >= 10 && /[^a-zA-Z0-9]/.test(pw)) return 4;
  if (pw.length >= 8 && /[A-Z]/.test(pw) && /[a-z]/.test(pw)) return 3;
  return 2;
}

const strengthColors = ['', '#EF4444', '#F97316', '#F59E0B', '#10B981'];
const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

function PasswordStrengthBar({ password }) {
  const s = getStrength(password);
  if (!password) return null;
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', gap: 3 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i <= s ? strengthColors[s] : '#E5E7EB', transition: 'background-color 0.3s ease' }} />
        ))}
      </div>
      <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: '0.75rem', color: strengthColors[s], textAlign: 'right', marginTop: 3 }}>{strengthLabels[s]}</p>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!success) return;
    const t = setInterval(() => setCountdown(c => c - 1), 1000);
    const nav = setTimeout(() => navigate('/login'), 3000);
    return () => { clearInterval(t); clearTimeout(nav); };
  }, [success, navigate]);

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
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
      await authAPI.register(form);
      setSuccess('Registration successful. Please verify your email.');
    } catch (err) {
      setServerError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <AuthBackground>
      <AuthCard>
        <h1 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '1.625rem', color: '#111827', marginBottom: 4 }}>Create account</h1>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '0.875rem', color: '#6B7280', marginBottom: 28 }}>Start tracking your expenses today</p>

        {success ? (
          <>
            <SuccessAlert msg={success} />
            <p style={{ textAlign: 'center', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', color: '#9CA3AF', marginTop: 8 }}>
              Redirecting to login in {countdown}s...
            </p>
          </>
        ) : (
          <>
            <ErrorAlert msg={serverError} />
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }} noValidate>
              <StyledInput label="Full Name" name="full_name" type="text" placeholder="John Doe" value={form.full_name} onChange={handleChange} error={errors.full_name} />
              <StyledInput label="Email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} error={errors.email} />
              <div>
                <StyledInput label="Password" name="password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} error={errors.password} />
                <PasswordStrengthBar password={form.password} />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ height: 48, width: '100%' }}>
                {loading ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2.5 }} /> Creating account...</> : 'Register'}
              </button>
            </form>
          </>
        )}

        <p style={{ textAlign: 'center', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', color: '#6B7280', marginTop: 20 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#4F46E5', fontWeight: 600, textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
          >Sign in</Link>
        </p>
      </AuthCard>
    </AuthBackground>
  );
}
