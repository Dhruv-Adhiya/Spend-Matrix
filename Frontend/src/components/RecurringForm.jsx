import { useState } from 'react';
import CategoryDropdown from './CategoryDropdown';
import FrequencySelector from './FrequencySelector';

const lbl = { fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.8125rem', color: 'var(--color-text-sub)', marginBottom: 6, display: 'block' };

const CREATE_DEFAULTS = {
  type: 'expense', category_id: '', amount: '', frequency: '',
  start_date: '', end_date: '', description: '', payment_source: 'online',
};

const pillToggle = (options, active, onSelect) => (
  <div className="pill-toggle" style={{ display: 'flex', background: '#F3F4F6', borderRadius: 10, padding: 4, gap: 4 }}>
    {options.map(o => (
      <button key={o.value} type="button" onClick={() => onSelect(o.value)}
        style={{
          flex: 1, padding: 8, borderRadius: 8, border: 'none', cursor: 'pointer',
          fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s',
          ...(active === o.value
            ? { background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', color: '#fff', boxShadow: '0 2px 8px rgba(79,70,229,0.3)' }
            : { background: 'transparent', color: '#9CA3AF' }),
        }}
      >{o.label}</button>
    ))}
  </div>
);

export default function RecurringForm({ initial, onSubmit, onCancel, loading }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(
    isEdit
      ? { amount: initial.amount, frequency: initial.frequency, end_date: initial.end_date?.split('T')[0] ?? '', description: initial.description || '', payment_source: initial.payment_source || 'online', type: initial.type, category_id: String(initial.category_id), start_date: initial.start_date?.split('T')[0] ?? '' }
      : CREATE_DEFAULTS
  );
  const [error, setError] = useState('');

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEdit && !form.category_id) return setError('Please select a category.');
    if (!form.amount || Number(form.amount) <= 0) return setError('Amount must be greater than 0.');
    if (!form.frequency) return setError('Frequency is required.');
    if (!isEdit && !form.start_date) return setError('Start date is required.');
    if (form.end_date && form.start_date && form.end_date < form.start_date) return setError('End date must be on or after start date.');
    setError('');
    if (isEdit) {
      onSubmit({ amount: Number(form.amount), frequency: form.frequency, end_date: form.end_date || null, description: form.description, payment_source: form.payment_source });
    } else {
      onSubmit({ type: form.type, category_id: Number(form.category_id), amount: Number(form.amount), frequency: form.frequency, start_date: form.start_date, end_date: form.end_date || null, description: form.description, payment_source: form.payment_source });
    }
  };

  const selectStyle = { fontFamily: '"DM Sans",sans-serif', fontWeight: 400, fontSize: '0.9375rem', background: '#FAFBFF', border: '1.5px solid #E5E7EB', borderRadius: 10, padding: '11px 14px', color: '#111827', outline: 'none', width: '100%', transition: 'border-color 0.2s, box-shadow 0.2s' };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '10px 14px', color: '#DC2626', fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem' }}>
          ⚠️ {error}
        </div>
      )}

      {!isEdit && (
        <>
          <div>
            <label style={lbl}>Type</label>
            {pillToggle([{ value: 'expense', label: 'Expense' }, { value: 'income', label: 'Income' }], form.type, v => setForm(f => ({ ...f, type: v, category_id: '' })))}
          </div>
          <div>
            <label style={lbl}>Category</label>
            <CategoryDropdown value={form.category_id} onChange={v => set('category_id', v)} type={form.type} />
          </div>
        </>
      )}

      {isEdit && (
        <div style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border)', borderRadius: 10, padding: '10px 14px', display: 'flex', gap: 20 }}>
          <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: 'var(--color-text-sub)' }}>Type: <strong style={{ color: 'var(--color-text)', textTransform: 'capitalize' }}>{form.type}</strong></span>
          <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: 'var(--color-text-sub)' }}>Category: <strong style={{ color: 'var(--color-text)' }}>{initial.category_name ?? `#${initial.category_id}`}</strong></span>
          <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: 'var(--color-text-sub)' }}>Started: <strong style={{ color: 'var(--color-text)' }}>{form.start_date || '—'}</strong></span>
        </div>
      )}

      <div>
        <label style={lbl}>Amount</label>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontFamily: '"DM Sans",sans-serif', fontWeight: 500, color: '#9CA3AF', pointerEvents: 'none' }}>₹</span>
          <input type="number" min="0.01" step="0.01" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0.00" className="input" style={{ paddingLeft: 32 }} />
        </div>
      </div>

      <div>
        <label style={lbl}>Frequency</label>
        <FrequencySelector value={form.frequency} onChange={v => set('frequency', v)} />
      </div>

      {!isEdit && (
        <div>
          <label style={lbl}>Start Date</label>
          <input type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} className="input" />
        </div>
      )}

      <div>
        <label style={lbl}>End Date <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span></label>
        <input type="date" value={form.end_date} min={form.start_date || undefined} onChange={e => set('end_date', e.target.value)} className="input" />
      </div>

      <div>
        <label style={lbl}>Payment Source</label>
        {pillToggle([{ value: 'online', label: 'Online' }, { value: 'cash', label: 'Cash' }, { value: 'credit_card', label: 'Credit Card' }], form.payment_source, v => set('payment_source', v))}
      </div>

      <div>
        <label style={lbl}>Description <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span></label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} placeholder="Add a note…"
          className="input"
          style={{ width: '100%', minHeight: 64, resize: 'vertical', boxSizing: 'border-box' }} />
      </div>

      <div style={{ display: 'flex', gap: 10, paddingTop: 4, borderTop: '1px solid var(--color-border)', marginTop: 4 }}>
        <button type="button" onClick={onCancel} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
          {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</> : isEdit ? 'Update Rule' : 'Create Rule'}
        </button>
      </div>
    </form>
  );
}
