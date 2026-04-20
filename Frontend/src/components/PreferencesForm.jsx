import { useState } from 'react';
import { settingsAPI } from '../services/settingsService';

const lbl = { fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.8125rem', color: 'var(--color-text-sub)', marginBottom: 6, display: 'block' };

function ToggleRow({ icon, label, checked, onChange }) {
  return (
    <div className="toggle-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span className="toggle-row-label" style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.9375rem', color: 'var(--color-text)' }}>{label}</span>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          width: 48, height: 26, borderRadius: 999, border: 'none', cursor: 'pointer',
          position: 'relative', transition: 'background 0.2s',
          background: checked ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' : '#D1D5DB',
          flexShrink: 0,
        }}
        aria-checked={checked}
        role="switch"
      >
        <span style={{
          position: 'absolute', top: 3, width: 20, height: 20, borderRadius: '50%',
          background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
          transition: 'left 0.2s cubic-bezier(0.34,1.56,0.64,1)',
          left: checked ? 25 : 3,
        }} />
      </button>
    </div>
  );
}

export default function PreferencesForm({ initialData }) {
  const [form, setForm] = useState({
    currency: initialData?.currency || 'INR',
    timezone: initialData?.timezone || 'Asia/Kolkata',
    date_format: initialData?.date_format || 'DD-MM-YYYY',
    notification_enabled: initialData?.notification_enabled ?? true,
    budget_alert_threshold: initialData?.budget_alert_threshold ?? 80,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (key, val) => { setForm(p => ({ ...p, [key]: val })); setError(''); setSuccess(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const threshold = Number(form.budget_alert_threshold);
    if (!Number.isInteger(threshold) || threshold < 0 || threshold > 100)
      return setError('Budget alert threshold must be between 0 and 100.');
    setLoading(true);
    try {
      await settingsAPI.updatePreferences({ ...form, budget_alert_threshold: threshold });
      setSuccess('Preferences saved successfully.');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to save preferences.');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 480 }}>
      {/* Toggles */}
      <ToggleRow icon="🔔" label="Email Notifications" checked={form.notification_enabled} onChange={v => set('notification_enabled', v)} />

      {/* Currency */}
      <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column' }}>
        <label style={lbl}>Currency</label>
        <select value={form.currency} onChange={e => set('currency', e.target.value)} className="input" style={{ width: 200 }}>
          <option value="INR">₹ INR — Indian Rupee</option>
          <option value="USD">$ USD — US Dollar</option>
          <option value="EUR">€ EUR — Euro</option>
          <option value="GBP">£ GBP — British Pound</option>
        </select>
      </div>

      {/* Date format */}
      <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column' }}>
        <label style={lbl}>Date Format</label>
        <select value={form.date_format} onChange={e => set('date_format', e.target.value)} className="input" style={{ width: 200 }}>
          {['DD-MM-YYYY', 'MM-DD-YYYY', 'YYYY-MM-DD'].map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      {/* Budget alert threshold */}
      <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column' }}>
        <label style={lbl}>Budget Alert Threshold (%)</label>
        <input
          type="number" min={0} max={100}
          value={form.budget_alert_threshold}
          onChange={e => set('budget_alert_threshold', e.target.value)}
          className="input" style={{ width: 120 }}
        />
        <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.75rem', color: '#9CA3AF', marginTop: 4 }}>
          Get alerted when spending reaches this % of your budget
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '10px 14px', color: '#DC2626', fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', marginTop: 8 }}>
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div style={{ background: 'rgba(16,185,129,0.07)', border: '1.5px solid rgba(16,185,129,0.25)', borderLeft: '3px solid #10B981', borderRadius: 10, padding: '10px 14px', color: '#065F46', fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', marginTop: 8 }}>
          ✅ {success}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn btn-primary" style={{ height: 46, alignSelf: 'flex-start', padding: '0 28px', marginTop: 16 }}>
        {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</> : 'Save Preferences'}
      </button>
    </form>
  );
}
