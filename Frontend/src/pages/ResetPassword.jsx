import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Eye, EyeOff } from 'lucide-react';

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
    <div style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '12px 14px', color: '#DC2626', fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: '0.875rem', marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
      <span style={{ flexShrink: 0 }}>⚠️</span><span>{msg}</span>
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

function PasswordInput({ label, name, value, onChange, error, showStrength, placeholder }) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  const s = getStrength(value);
  return (
    <div>
      <label className="input-label">{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          className={`input${error ? ' error' : ''}`}
          type={show ? 'text' : 'password'}
          name={name} value={value} onChange={onChange}
          placeholder={placeholder || 'Min. 6 characters'}
          style={{ paddingRight: 42, borderColor: focused && !error ? '#4F46E5' : undefined, boxShadow: focused && !error ? '0 0 0 3px rgba(79,70,229,0.15)' : undefined }}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        />
        <button type="button" onClick={() => setShow(v => !v)}
          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex' }}>
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="input-error">{error}</p>}
      {showStrength && value && (
        <div style={{ marginTop: 6 }}>
          <div style={{ display: 'flex', gap: 3 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i <= s ? strengthColors[s] : '#E5E7EB', transition: 'background-color 0.3s ease' }} />
            ))}
          </div>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 500, fontSize: '0.75rem', color: strengthColors[s], textAlign: 'right', marginTop: 3 }}>{strengthLabels[s]}</p>
        </div>
      )}
    </div>
  );
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!success) return;
    const t = setInterval(() => setCountdown(c => c - 1), 1000);
    const nav = setTimeout(() => navigate('/login'), 3000);
    return () => { clearInterval(t); clearTimeout(nav); };
  }, [success, navigate]);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.newPassword || !form.confirmPassword) return setError('All fields are required.');
    if (form.newPassword.length < 6) return setError('Password must be at least 6 characters.');
    if (form.newPassword !== form.confirmPassword) return setError('Passwords do not match.');
    if (!token) return setError('Invalid or missing reset token.');
    setLoading(true);
    try {
      await authAPI.resetPassword({ token, newPassword: form.newPassword });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password. The link may have expired.');
    } finally { setLoading(false); }
  };

  if (!token) {
    return (
      <AuthBackground>
        <AuthCard>
          <p style={{ color: '#DC2626', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', marginBottom: 16 }}>Invalid or missing reset token.</p>
          <Link to="/forgot-password" style={{ color: '#4F46E5', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem' }}>Request a new link</Link>
        </AuthCard>
      </AuthBackground>
    );
  }

  return (
    <AuthBackground>
      <AuthCard>
        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', animation: 'countUp 0.4s ease' }}>
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M6 15l6 6 12-12" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '1.25rem', color: '#111827' }}>Password Updated!</h2>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', color: '#6B7280', marginTop: 8 }}>Your password has been changed successfully.</p>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', color: '#9CA3AF', marginTop: 8 }}>Redirecting to login in {countdown}s...</p>
          </div>
        ) : (
          <>
            <h1 style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '1.625rem', color: '#111827', marginBottom: 4 }}>Reset Password</h1>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 400, fontSize: '0.875rem', color: '#6B7280', marginBottom: 28 }}>Choose a new password for your account.</p>
            <ErrorAlert msg={error} />
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }} noValidate>
              <PasswordInput label="New Password" name="newPassword" value={form.newPassword} onChange={handleChange} placeholder="Min. 6 characters" showStrength />
              <PasswordInput
                label="Confirm Password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                placeholder="Repeat new password"
                error={form.confirmPassword && form.newPassword !== form.confirmPassword ? 'Passwords do not match' : ''}
              />
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ height: 48, width: '100%' }}>
                {loading ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2.5 }} /> Updating...</> : 'Update Password'}
              </button>
            </form>
          </>
        )}
      </AuthCard>
    </AuthBackground>
  );
}
