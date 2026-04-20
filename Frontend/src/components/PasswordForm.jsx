import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { settingsAPI } from '../services/settingsService';

const lbl = { fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.8125rem', color: 'var(--color-text-sub)', marginBottom: 6, display: 'block' };

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
      <label style={lbl}>{label}</label>
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
          <p style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.75rem', color: strengthColors[s], textAlign: 'right', marginTop: 3 }}>{strengthLabels[s]}</p>
        </div>
      )}
    </div>
  );
}

export default function PasswordForm() {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError(''); setSuccess(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) return setError('All fields are required.');
    if (form.newPassword !== form.confirmPassword) return setError('New passwords do not match.');
    if (form.newPassword.length < 8) return setError('New password must be at least 8 characters.');
    setLoading(true);
    try {
      await settingsAPI.changePassword({ oldPassword: form.oldPassword, newPassword: form.newPassword });
      setSuccess('Password changed successfully.');
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to change password.');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 480 }}>
      <PasswordInput label="Current Password" name="oldPassword" value={form.oldPassword} onChange={handleChange} placeholder="Your current password" />
      <PasswordInput label="New Password" name="newPassword" value={form.newPassword} onChange={handleChange} showStrength />
      <PasswordInput
        label="Confirm New Password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
        placeholder="Repeat new password"
        error={form.confirmPassword && form.newPassword !== form.confirmPassword ? 'Passwords do not match' : ''}
      />

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '10px 14px', color: '#DC2626', fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem' }}>
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div style={{ background: 'rgba(16,185,129,0.07)', border: '1.5px solid rgba(16,185,129,0.25)', borderLeft: '3px solid #10B981', borderRadius: 10, padding: '10px 14px', color: '#065F46', fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem' }}>
          ✅ {success}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn btn-primary" style={{ height: 46, alignSelf: 'flex-start', padding: '0 28px' }}>
        {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</> : 'Change Password'}
      </button>
    </form>
  );
}
