import { useState } from 'react';
import { settingsAPI } from '../services/settingsService';

const lbl = { fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.8125rem', color: 'var(--color-text-sub)', marginBottom: 6, display: 'block' };

function StyledInput({ label, error, readOnly, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {label && <label style={lbl}>{label}</label>}
      <input
        className={`input${error ? ' error' : ''}`}
        style={{
          borderColor: focused && !error ? '#4F46E5' : readOnly ? 'var(--color-border)' : undefined,
          boxShadow: focused && !error ? '0 0 0 3px rgba(79,70,229,0.15)' : undefined,
          background: readOnly ? 'var(--color-bg)' : undefined,
          color: readOnly ? 'var(--color-muted)' : undefined,
          cursor: readOnly ? 'not-allowed' : undefined,
        }}
        readOnly={readOnly}
        onFocus={() => !readOnly && setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error && <p className="input-error">{error}</p>}
    </div>
  );
}

function getInitials(name) {
  const parts = (name || '').split(' ');
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
}

export default function ProfileForm({ initialData }) {
  const [form, setForm] = useState({ full_name: initialData?.full_name || '', email: initialData?.email || '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(''); setSuccess(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.full_name.trim()) return setError('Full name is required.');
    setLoading(true);
    try {
      await settingsAPI.updateProfile({ full_name: form.full_name });
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to update profile.');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 480 }}>
      {/* Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4 }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: '"DM Sans",sans-serif', fontWeight: 700, fontSize: 28, color: '#fff',
          flexShrink: 0,
        }}>{getInitials(form.full_name)}</div>
        <div>
          <p className="settings-name" style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-text)' }}>{form.full_name || 'Your Name'}</p>
          <p className="settings-sub" style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: 2 }}>{form.email}</p>
        </div>
      </div>

      <StyledInput label="Full Name" name="full_name" type="text" value={form.full_name} onChange={handleChange} placeholder="John Doe" />
      <StyledInput label="Email" name="email" type="email" value={form.email} readOnly />

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '10px 14px', color: '#DC2626', fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: 'rgba(16,185,129,0.07)', border: '1.5px solid rgba(16,185,129,0.25)', borderLeft: '3px solid #10B981', borderRadius: 10, padding: '10px 14px', color: '#065F46', fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem' }}>
          ✅ {success}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn btn-primary" style={{ height: 46, alignSelf: 'flex-start', padding: '0 28px' }}>
        {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</> : 'Save Profile'}
      </button>
    </form>
  );
}
