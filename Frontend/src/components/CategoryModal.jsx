import { useState } from 'react';
import { createPortal } from 'react-dom';
import { createCategory } from '../services/categoryService';

const lbl = { fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.8125rem', color: '#374151', marginBottom: 6, display: 'block' };

export default function CategoryModal({ onClose, onCreated, defaultType }) {
  const [form, setForm] = useState({ name: '', type: defaultType || 'expense' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return setError('Name is required.');
    setError(''); setLoading(true);
    try {
      const created = await createCategory({ name, type: form.type });
      onCreated(created); onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create category.';
      setError(msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('duplicate') ? 'A category with this name already exists.' : msg);
    } finally { setLoading(false); }
  };

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.50)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 20, width: 380, maxWidth: '100%', padding: 28, boxShadow: '0 24px 80px rgba(0,0,0,0.20)', animation: 'slideInRight 0.3s cubic-bezier(0.22,1,0.36,1) both' }}
        onClick={e => e.stopPropagation()}>
        <h2 style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 600, fontSize: '1.125rem', color: '#111827', marginBottom: 20 }}>New Category</h2>

        {error && <div style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '10px 14px', color: '#DC2626', fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', marginBottom: 16 }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={lbl}>Name</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Travel" className="input" />
          </div>
          <div>
            <label style={lbl}>Type</label>
            <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: 10, padding: 4, gap: 4 }}>
              {['expense', 'income'].map(t => (
                <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                  style={{ flex: 1, padding: 8, borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s', textTransform: 'capitalize', ...(form.type === t ? { background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', color: '#fff', boxShadow: '0 2px 8px rgba(79,70,229,0.3)' } : { background: 'transparent', color: '#9CA3AF' }) }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
              {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</> : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
