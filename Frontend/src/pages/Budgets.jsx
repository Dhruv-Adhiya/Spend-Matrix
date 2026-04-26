import { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { budgetAPI } from '../services/api';
import { getCategories } from '../services/categoryService';

const now = new Date();

const EMPTY = { category_id: '', amount: '', month: now.getMonth() + 1, year: now.getFullYear() };

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

function BudgetModal({ initial, onClose, onSaved }) {
  const isEdit = !!initial;
  const [form, setForm] = useState(
    isEdit
      ? { category_id: String(initial.category_id), amount: String(initial.budget), month: initial.month, year: initial.year }
      : EMPTY
  );
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories()
      .then((cats) => setCategories(cats.filter((c) => c.type === 'expense')))
      .catch(() => setError('Failed to load categories.'));
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category_id) return setError('Select a category.');
    if (!form.amount || Number(form.amount) <= 0) return setError('Amount must be > 0.');
    setError('');
    setLoading(true);
    try {
      await budgetAPI.save({
        category_id: Number(form.category_id),
        amount: Number(form.amount),
        month: Number(form.month),
        year: Number(form.year),
      });
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save budget.');
    } finally {
      setLoading(false);
    }
  };
  const lbl = { fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.8125rem', color: 'var(--color-text-sub)', marginBottom: 6, display: 'block' };
  const readonlyStyle = { width: '100%', padding: '11px 14px', fontFamily: '"DM Sans",sans-serif', fontSize: '0.9375rem', background: '#F9FAFB', border: '1.5px solid #E5E7EB', borderRadius: 10, color: '#9CA3AF' };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 520 }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 0', marginBottom: 20 }}>
          <h2 style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 600, fontSize: '1.125rem', color: 'var(--color-text)' }}>{isEdit ? 'Edit Budget' : 'Set Budget'}</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'rgba(79,70,229,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#EF4444'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(79,70,229,0.06)'; e.currentTarget.style.color = '#6B7280'; }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {error && (
          <div style={{ margin: '0 24px 16px', background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '10px 14px', color: '#DC2626', fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={lbl}>Expense Category</label>
            {isEdit ? (
              <div style={readonlyStyle}>{initial.category_name}</div>
            ) : (
              <select value={form.category_id} onChange={e => set('category_id', e.target.value)} className="input">
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            )}
          </div>

          <div>
            <label style={lbl}>Budget Amount</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontFamily: '"DM Sans",sans-serif', fontWeight: 500, color: '#9CA3AF', pointerEvents: 'none' }}>₹</span>
              <input type="number" min="0.01" step="0.01" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0.00" className="input" style={{ paddingLeft: 32 }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={lbl}>Month</label>
              {isEdit ? (
                <div style={readonlyStyle}>{MONTH_NAMES[initial.month - 1]}</div>
              ) : (
                <select value={form.month} onChange={e => set('month', e.target.value)} className="input">
                  {MONTH_NAMES.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
                </select>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label style={lbl}>Year</label>
              {isEdit ? (
                <div style={readonlyStyle}>{initial.year}</div>
              ) : (
                <input type="number" min="2000" max="2100" value={form.year} onChange={e => set('year', e.target.value)} className="input" />
              )}
            </div>
          </div>
        </form>

        <div style={{ padding: '20px 24px', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button type="button" onClick={onClose} className="btn btn-secondary" style={{ padding: '10px 20px' }}>Cancel</button>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '10px 20px' }} onClick={handleSubmit}>
            {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</> : isEdit ? 'Update Budget' : 'Save Budget'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ pct }) {
  const clamped = Math.min(pct, 100);
  const grad = pct >= 100 ? 'linear-gradient(90deg,#EF4444,#F87171)'
    : pct >= 80 ? 'linear-gradient(90deg,#F97316,#FB923C)'
    : pct >= 60 ? 'linear-gradient(90deg,#F59E0B,#FCD34D)'
    : 'linear-gradient(90deg,#10B981,#34D399)';
  const color = pct >= 100 ? '#EF4444' : pct >= 80 ? '#F97316' : pct >= 60 ? '#F59E0B' : '#10B981';
  return { grad, color, clamped };
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState(null);
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchBudgets = () => {
    setLoading(true);
    setError('');
    Promise.all([budgetAPI.getAll(month, year), budgetAPI.getSummary(month, year)])
      .then(([b, s]) => {
        setBudgets(b.data.data || []);
        setSummary(s.data.data);
      })
      .catch(() => setError('Failed to load budgets.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBudgets(); }, [month, year]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await budgetAPI.remove(deleteId);
      setDeleteId(null);
      fetchBudgets();
    } catch {
      setError('Failed to delete budget.');
      setDeleteId(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const fmt = (n) => Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  return (
    <MainLayout>
      <div className="page-enter">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 className="gradient-text" style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 700, fontSize: '1.5rem' }}>Budgets</h1>
        <button onClick={() => { setEditTarget(null); setShowModal(true); }} className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '0.875rem' }}>+ Set Budget</button>
      </div>

      {/* Month/Year filter */}
      <div className="card" style={{ padding: '14px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.8125rem', color: 'var(--color-text-sub)', marginBottom: 4 }}>Month</label>
            <select value={month} onChange={e => setMonth(Number(e.target.value))} className="input" style={{ width: 150 }}>
              {MONTH_NAMES.map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.8125rem', color: 'var(--color-text-sub)', marginBottom: 4 }}>Year</label>
            <select value={year} onChange={e => setYear(Number(e.target.value))} className="input" style={{ width: 110 }}>
              {[2023,2024,2025,2026,2027].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <button onClick={fetchBudgets} className="btn btn-primary" style={{ padding: '10px 16px', fontSize: '0.875rem' }}>Apply</button>
          {summary && (
            <span style={{ marginLeft: 'auto', fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: '#6B7280' }}>
              {budgets.length} of {budgets.length} categories budgeted
            </span>
          )}
        </div>
      </div>

      {error && <div style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '12px 16px', color: '#DC2626', fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 192 }}><span className="spinner" /></div>
      ) : budgets.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 260, gap: 14 }}>
          <span style={{ fontSize: 52 }}>🎯</span>
          <p style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.9375rem', color: '#9CA3AF' }}>No budgets set for this month</p>
          <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: '#9CA3AF' }}>Set budget limits to track your spending!</p>
          <button className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '0.875rem' }} onClick={() => { setEditTarget(null); setShowModal(true); }}>+ Set Budget</button>
        </div>
      ) : (
        <div className="grid-budgets">
          {budgets.map((b, i) => {
            const pct = b.percentage_used || 0;
            const over = b.spent > b.budget;
            const { grad, color, clamped } = ProgressBar({ pct });
            return (
              <div key={b.category_id} className="card card-hover"
                style={{ padding: '20px 22px', animation: 'fadeInUp 0.3s ease both', animationDelay: `${i*0.05}s`,
                  ...(over ? { borderColor: 'rgba(239,68,68,0.35)', borderTop: '4px solid #EF4444' } : {}) }}
                className={`card card-hover ${over ? 'budget-card-over' : ''}`}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DM Sans",sans-serif', fontWeight: 700, fontSize: 13, color: '#4F46E5' }}>{b.category_name?.[0]?.toUpperCase()}</div>
                    <span style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-text)', marginLeft: 10 }}>{b.category_name}</span>
                  </div>
                  <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8rem', color: '#9CA3AF' }}>{MONTH_NAMES[month-1]} {year}</span>
                </div>
                {/* Amounts */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
                  <span style={{ fontFamily: '"JetBrains Mono",monospace', fontWeight: 700, fontSize: '1.25rem', color }}>₹{fmt(b.spent)}</span>
                  <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '1rem', color: '#9CA3AF' }}>/</span>
                  <span style={{ fontFamily: '"JetBrains Mono",monospace', fontWeight: 400, fontSize: '1.125rem', color: '#6B7280' }}>₹{fmt(b.budget)}</span>
                </div>
                {/* Progress bar */}
                <div style={{ height: 10, borderRadius: 999, background: '#F3F4F6' }}>
                  <div style={{ height: 10, borderRadius: 999, background: grad, width: `${clamped}%`, transition: 'width 0.8s ease 0.1s' }} />
                </div>
                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                  {over
                    ? <span style={{ background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA', fontFamily: '"DM Sans",sans-serif', fontWeight: 700, fontSize: '0.7rem', padding: '2px 8px', borderRadius: 999 }}>OVER BUDGET</span>
                    : <span style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.8125rem', color }}>{pct}% used</span>
                  }
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => { setEditTarget(b); setShowModal(true); }}
                      style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#4F46E5'}
                      onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={() => setDeleteId(b.id)}
                      style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                      onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && <BudgetModal initial={editTarget} onClose={() => { setShowModal(false); setEditTarget(null); }} onSaved={fetchBudgets} />}

      {deleteId !== null && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box" style={{ maxWidth: 420, padding: 28, textAlign: 'center' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(239,68,68,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', animation: 'countUp 0.3s ease' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
            </div>
            <h3 style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 600, fontSize: '1.125rem', color: 'var(--color-text)' }}>Delete Budget?</h3>
            <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6, marginTop: 8 }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={() => setDeleteId(null)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button onClick={handleDelete} disabled={deleteLoading} className="btn btn-danger" style={{ flex: 1 }}>
                {deleteLoading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Deleting...</> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </MainLayout>
  );
}
