import { useCallback, useEffect, useRef, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import CategoryDropdown from '../components/CategoryDropdown';
import SearchBar from '../components/SearchBar';
import FilterBar, { FILTER_DEFAULTS } from '../components/FilterBar';
import ExportButtons from '../components/ExportButtons';
import { transactionAPI } from '../services/api';

const EMPTY_FORM = {
  type: 'expense',
  amount: '',
  category_id: '',
  description: '',
  transaction_date: new Date().toISOString().split('T')[0],
  payment_source: 'online',
};

const SOURCE_LABEL = { online: 'Online', cash: 'Cash', credit_card: 'Credit Card' };

// ─── Transaction Modal ────────────────────────────────────────────────────────
function TransactionModal({ initial, onClose, onSaved }) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState(
    isEdit
      ? {
          type: initial.type,
          amount: initial.amount,
          category_id: String(initial.category_id),
          description: initial.description || '',
          transaction_date: initial.transaction_date?.split('T')[0] ?? initial.transaction_date,
          payment_source: initial.payment_source,
        }
      : EMPTY_FORM
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category_id) return setError('Please select a category.');
    if (!form.amount || Number(form.amount) <= 0) return setError('Amount must be greater than 0.');
    if (!form.transaction_date) return setError('Date is required.');
    setError('');
    setLoading(true);
    try {
      const payload = { ...form, amount: Number(form.amount), category_id: Number(form.category_id) };
      if (isEdit) await transactionAPI.update(initial.id, payload);
      else await transactionAPI.create(payload);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save transaction.');
    } finally {
      setLoading(false);
    }
  };

  const pillToggle = (options, active, onSelect) => (
    <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: 10, padding: 4, gap: 4 }}>
      {options.map(o => (
        <button key={o.value} type="button" onClick={() => onSelect(o.value)}
          style={{
            flex: 1, padding: 8, borderRadius: 8, border: 'none', cursor: 'pointer',
            fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.875rem',
            transition: 'all 0.2s',
            ...(active === o.value
              ? { background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', color: '#fff', boxShadow: '0 2px 8px rgba(79,70,229,0.3)' }
              : { background: 'transparent', color: '#9CA3AF' }),
          }}
        >{o.label}</button>
      ))}
    </div>
  );

  const lbl = { fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.8125rem', color: '#374151', marginBottom: 6, display: 'block' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.50)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 20, width: 480, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.20)', animation: 'slideInRight 0.3s cubic-bezier(0.22,1,0.36,1) both' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 0', marginBottom: 20 }}>
          <h2 style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 600, fontSize: '1.125rem', color: '#111827' }}>
            {isEdit ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'rgba(79,70,229,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#EF4444'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(79,70,229,0.06)'; e.currentTarget.style.color = '#6B7280'; }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ margin: '0 24px 16px', background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '12px 14px', color: '#DC2626', fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.875rem', display: 'flex', gap: 8 }}>
            <span style={{ flexShrink: 0 }}>⚠️</span><span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Type toggle */}
          <div>
            <label style={lbl}>Type</label>
            {pillToggle(
              [{ value: 'expense', label: 'Expense' }, { value: 'income', label: 'Income' }],
              form.type,
              v => setForm(f => ({ ...f, type: v, category_id: '' }))
            )}
          </div>

          {/* Category */}
          <div>
            <label style={lbl}>Category</label>
            <CategoryDropdown value={form.category_id} onChange={v => set('category_id', v)} type={form.type} />
          </div>

          {/* Amount */}
          <div>
            <label style={lbl}>Amount</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontFamily: '"DM Sans",sans-serif', fontWeight: 500, color: '#9CA3AF', pointerEvents: 'none' }}>₹</span>
              <input type="number" min="0.01" step="0.01" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0.00"
                className="input" style={{ paddingLeft: 32 }} />
            </div>
          </div>

          {/* Date */}
          <div>
            <label style={lbl}>Date</label>
            <input type="date" value={form.transaction_date} onChange={e => set('transaction_date', e.target.value)} className="input" />
          </div>

          {/* Description */}
          <div>
            <label style={lbl}>Description (optional)</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3}
              placeholder="What was this for?"
              style={{ width: '100%', minHeight: 80, padding: '11px 14px', fontFamily: '"DM Sans",sans-serif', fontSize: '0.9375rem', background: '#FAFBFF', border: '1.5px solid #E5E7EB', borderRadius: 10, color: '#111827', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>

          {/* Payment Source toggle */}
          <div>
            <label style={lbl}>Payment Source</label>
            {pillToggle(
              [{ value: 'online', label: 'Online' }, { value: 'cash', label: 'Cash' }, { value: 'credit_card', label: 'Credit Card' }],
              form.payment_source,
              v => set('payment_source', v)
            )}
          </div>
        </form>

        {/* Footer */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button type="button" onClick={onClose} className="btn btn-secondary" style={{ padding: '10px 20px' }}>Cancel</button>
          <button type="submit" form="tx-form" disabled={loading} className="btn btn-primary" style={{ padding: '10px 20px' }}
            onClick={handleSubmit}>
            {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</> : isEdit ? 'Update Transaction' : 'Save Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
function DeleteConfirm({ onConfirm, onCancel, loading }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.50)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onCancel}>
      <div style={{ background: '#fff', borderRadius: 20, width: 380, maxWidth: '100%', padding: 28, boxShadow: '0 24px 80px rgba(0,0,0,0.20)', animation: 'slideInRight 0.3s cubic-bezier(0.22,1,0.36,1) both', textAlign: 'center' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(239,68,68,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', animation: 'countUp 0.3s ease' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </div>
        <h3 style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 600, fontSize: '1.125rem', color: '#111827' }}>Delete Transaction?</h3>
        <p style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 400, fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6, marginTop: 8 }}>This action cannot be undone. The transaction will be permanently removed.</p>
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={onCancel} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="btn btn-danger" style={{ flex: 1 }}>
            {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Deleting...</> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(FILTER_DEFAULTS);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Reset to page 1 when search or filters change
  const prevSearchRef = useRef(search);
  const prevFiltersRef = useRef(filters);
  useEffect(() => {
    if (search !== prevSearchRef.current || filters !== prevFiltersRef.current) {
      setPage(1);
      prevSearchRef.current = search;
      prevFiltersRef.current = filters;
    }
  }, [search, filters]);

  const fetchTransactions = useCallback(() => {
    // Block invalid date range
    if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) return;

    setLoading(true);
    setError('');

    const params = { page, limit: 20, sortBy: filters.sortBy, order: filters.order };
    if (search) params.search = search;
    if (filters.type) params.type = filters.type;
    if (filters.category_id) params.category_id = filters.category_id;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.minAmount) params.minAmount = filters.minAmount;
    if (filters.maxAmount) params.maxAmount = filters.maxAmount;

    transactionAPI
      .search(params)
      .then((r) => {
        setTransactions(r.data.data.data || []);
        setPagination(r.data.data.pagination || { page: 1, totalPages: 1, total: 0 });
      })
      .catch(() => setError('Failed to load transactions. Please try again.'))
      .finally(() => setLoading(false));
  }, [search, filters, page]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await transactionAPI.remove(deleteTarget.id);
      setDeleteTarget(null);
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete transaction.');
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const hasActiveSearch = search || Object.entries(filters).some(([k, v]) =>
    k !== 'sortBy' && k !== 'order' && v !== ''
  );

  // ── helpers ──
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  const fmtAmt  = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(n));

  const payBadge = {
    online:      { bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE', label: 'Online' },
    cash:        { bg: '#ECFDF5', color: '#065F46', border: '#A7F3D0', label: 'Cash' },
    credit_card: { bg: '#F5F3FF', color: '#5B21B6', border: '#DDD6FE', label: 'Credit Card' },
  };

  const buildPages = (cur, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (cur <= 4) return [1,2,3,4,5,'…',total];
    if (cur >= total - 3) return [1,'…',total-4,total-3,total-2,total-1,total];
    return [1,'…',cur-1,cur,cur+1,'…',total];
  };

  const pgBtn = (active) => ({
    width: 36, height: 36, borderRadius: 8, border: active ? 'none' : '1.5px solid #E5E7EB',
    background: active ? '#4F46E5' : '#fff', color: active ? '#fff' : '#374151',
    fontFamily: '"DM Sans", sans-serif', fontWeight: active ? 600 : 400, fontSize: '0.875rem',
    cursor: 'pointer', transition: 'all 0.15s ease',
    boxShadow: active ? '0 2px 8px rgba(79,70,229,0.35)' : 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  });

  return (
    <MainLayout>
      <div className="page-enter">

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 className="gradient-text" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: '1.5rem' }}>Transactions</h1>
        <button
          onClick={() => { setEditTarget(null); setShowModal(true); }}
          className="btn btn-primary"
          style={{ padding: '10px 18px', fontSize: '0.875rem' }}
        >+ Add Transaction</button>
      </div>

      {/* ── Filter Bar ── */}
      <FilterBar
        filters={filters} onChange={setFilters}
        search={search} onSearch={setSearch}
        exportFilters={{ search, ...filters }}
      />

      {/* ── Error ── */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '12px 16px', color: '#DC2626', fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.875rem', marginBottom: 16, display: 'flex', gap: 8 }}>
          <span style={{ flexShrink: 0 }}>⚠️</span><span>{error}</span>
        </div>
      )}

      {/* ── Results count ── */}
      {!loading && !error && (
        <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: '#6B7280', marginBottom: 8 }}>
          Showing {Math.min((page-1)*20+1, pagination.total)}–{Math.min(page*20, pagination.total)} of {pagination.total} transactions
        </p>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 192, gap: 10 }}>
          <span className="spinner" />
          <span style={{ fontFamily: '"DM Sans",sans-serif', color: '#9CA3AF', fontSize: '0.875rem' }}>Loading...</span>
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && transactions.length === 0 && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 240, gap: 12 }}>
          <span style={{ fontSize: 52 }}>💳</span>
          <p style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 600, fontSize: '1rem', color: '#9CA3AF' }}>No transactions found</p>
          <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: '#9CA3AF' }}>Try adjusting your filters or add a new transaction.</p>
          <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }} onClick={() => { setEditTarget(null); setShowModal(true); }}>+ Add Transaction</button>
        </div>
      )}

      {/* ── Table ── */}
      {!loading && transactions.length > 0 && (
        <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 16 }}>

          {/* Header row */}
          <div style={{
            display: 'grid', gridTemplateColumns: '110px 90px 130px 1fr 130px 110px 80px',
            alignItems: 'center', padding: '12px 20px',
            background: 'rgba(79,70,229,0.04)', borderBottom: '1.5px solid rgba(79,70,229,0.08)',
          }}>
            {['DATE','TYPE','CATEGORY','DESCRIPTION','PAYMENT','AMOUNT','ACTIONS'].map(col => (
              <span key={col} style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{col}</span>
            ))}
          </div>

          {/* Data rows */}
          {transactions.map((tx, i) => (
            <div
              key={tx.id}
              style={{
                display: 'grid', gridTemplateColumns: '110px 90px 130px 1fr 130px 110px 80px',
                alignItems: 'center', padding: '14px 20px',
                borderBottom: i < transactions.length - 1 ? '1px solid #F3F4F6' : 'none',
                transition: 'background 0.15s ease',
                animation: 'fadeInUp 0.3s ease both',
                animationDelay: `${i * 0.04}s`,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(79,70,229,0.025)'}
              onMouseLeave={e => e.currentTarget.style.background = ''}
            >
              {/* DATE */}
              <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: '#6B7280' }}>{fmtDate(tx.transaction_date)}</span>

              {/* TYPE BADGE */}
              <span style={{
                display: 'inline-flex', alignItems: 'center',
                fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.75rem',
                borderRadius: 999, padding: '3px 10px', border: '1px solid',
                ...(tx.type === 'income'
                  ? { background: '#ECFDF5', color: '#065F46', borderColor: '#A7F3D0' }
                  : { background: '#FEF2F2', color: '#991B1B', borderColor: '#FECACA' }),
              }}>{tx.type === 'income' ? 'Income' : 'Expense'}</span>

              {/* CATEGORY */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: tx.category_color || '#4F46E5', flexShrink: 0 }} />
                <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: '#374151' }}>{tx.category_name || '—'}</span>
              </div>

              {/* DESCRIPTION */}
              <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.9375rem', color: '#111827', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.description || '—'}</span>

              {/* PAYMENT BADGE */}
              {(() => { const p = payBadge[tx.payment_source] || { bg: '#F3F4F6', color: '#6B7280', border: '#E5E7EB', label: tx.payment_source }; return (
                <span style={{ display: 'inline-flex', alignItems: 'center', fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.75rem', borderRadius: 999, padding: '3px 10px', border: '1px solid', background: p.bg, color: p.color, borderColor: p.border }}>{p.label}</span>
              ); })()}

              {/* AMOUNT */}
              <span style={{ fontFamily: '"JetBrains Mono",monospace', fontWeight: 600, fontSize: '0.9375rem', color: tx.type === 'income' ? '#059669' : '#DC2626' }}>
                {tx.type === 'income' ? '+' : '-'}{fmtAmt(tx.amount)}
              </span>

              {/* ACTIONS — visible on row hover */}
              <div
                className="row-actions"
                style={{ display: 'flex', gap: 4, opacity: 0, transition: 'opacity 0.15s' }}
                ref={el => { if (el) { const row = el.closest('[style]'); row?.addEventListener('mouseenter', () => el.style.opacity = '1'); row?.addEventListener('mouseleave', () => el.style.opacity = '0'); } }}
              >
                <button
                  onClick={() => { setEditTarget(tx); setShowModal(true); }}
                  style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(79,70,229,0.08)'; e.currentTarget.style.color = '#4F46E5'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B7280'; }}
                  aria-label="Edit"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button
                  onClick={() => setDeleteTarget(tx)}
                  style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#EF4444'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6B7280'; }}
                  aria-label="Delete"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
              </div>
            </div>
          ))}

          {/* ── Pagination ── */}
          {pagination.totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 20px', flexWrap: 'wrap', gap: 12 }}>
              <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8125rem', color: '#6B7280' }}>
                Showing {Math.min((page-1)*20+1, pagination.total)}–{Math.min(page*20, pagination.total)} of {pagination.total} transactions
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {/* Prev */}
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  style={{ ...pgBtn(false), opacity: page <= 1 ? 0.4 : 1, cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
                  onMouseEnter={e => { if (page > 1) { e.currentTarget.style.borderColor = '#4F46E5'; e.currentTarget.style.color = '#4F46E5'; e.currentTarget.style.background = '#EEF2FF'; } }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.background = '#fff'; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                </button>

                {/* Page numbers */}
                {buildPages(page, pagination.totalPages).map((p, i) =>
                  p === '…'
                    ? <span key={`e${i}`} style={{ width: 36, textAlign: 'center', color: '#9CA3AF', fontFamily: '"DM Sans",sans-serif' }}>…</span>
                    : <button key={p} onClick={() => setPage(p)} style={pgBtn(p === page)}
                        onMouseEnter={e => { if (p !== page) { e.currentTarget.style.borderColor = '#4F46E5'; e.currentTarget.style.color = '#4F46E5'; e.currentTarget.style.background = '#EEF2FF'; } }}
                        onMouseLeave={e => { if (p !== page) { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.background = '#fff'; } }}
                      >{p}</button>
                )}

                {/* Next */}
                <button
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page >= pagination.totalPages}
                  style={{ ...pgBtn(false), opacity: page >= pagination.totalPages ? 0.4 : 1, cursor: page >= pagination.totalPages ? 'not-allowed' : 'pointer' }}
                  onMouseEnter={e => { if (page < pagination.totalPages) { e.currentTarget.style.borderColor = '#4F46E5'; e.currentTarget.style.color = '#4F46E5'; e.currentTarget.style.background = '#EEF2FF'; } }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = '#374151'; e.currentTarget.style.background = '#fff'; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      </div>

      {showModal && (
        <TransactionModal
          initial={editTarget}
          onClose={() => { setShowModal(false); setEditTarget(null); }}
          onSaved={fetchTransactions}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </MainLayout>
  );
}
