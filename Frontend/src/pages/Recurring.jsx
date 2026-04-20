import { useCallback, useEffect, useRef, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import RecurringTable from '../components/RecurringTable';
import RecurringForm from '../components/RecurringForm';
import Modal from '../components/Modal';
import {
  getRecurring,
  createRecurring,
  updateRecurring,
  deleteRecurring,
  toggleRecurring,
} from '../services/recurringService';

export default function Recurring() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggling, setToggling] = useState(null);
  const togglingRef = useRef(null);

  const fetchRules = useCallback(() => {
    setLoading(true);
    setError('');
    getRecurring()
      .then(setRules)
      .catch(() => setError('Failed to load recurring rules. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchRules(); }, [fetchRules]);

  const openCreate = () => { setEditTarget(null); setFormError(''); setShowForm(true); };
  const openEdit = (rule) => { setEditTarget(rule); setFormError(''); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditTarget(null); setFormError(''); };

  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    setFormError('');
    try {
      if (editTarget) {
        const updated = await updateRecurring(editTarget.id, data);
        // Preserve category_name since backend update response doesn't include it
        setRules((prev) =>
          prev.map((r) =>
            r.id === editTarget.id
              ? { ...r, ...updated, category_name: r.category_name }
              : r
          )
        );
      } else {
        // After create, re-fetch to get category_name enriched
        await createRecurring(data);
        await fetchRules();
      }
      closeForm();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save rule.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteRecurring(deleteTarget.id);
      setRules((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete rule.');
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggle = async (rule) => {
    if (togglingRef.current === rule.id) return; // prevent rapid toggling
    togglingRef.current = rule.id;
    setToggling(rule.id);
    const newState = !rule.is_active;
    try {
      await toggleRecurring(rule.id, newState);
      setRules((prev) =>
        prev.map((r) => (r.id === rule.id ? { ...r, is_active: newState } : r))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle rule.');
    } finally {
      togglingRef.current = null;
      setToggling(null);
    }
  };

  return (
    <MainLayout>
      <div className="page-enter">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 className="gradient-text" style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 700, fontSize: '1.5rem' }}>Recurring Transactions</h1>
        <button onClick={openCreate} className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '0.875rem' }}>+ Add Recurring</button>
      </div>

      {error && <div style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '12px 16px', color: '#DC2626', fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', marginBottom: 16, display: 'flex', gap: 8 }}><span style={{ flexShrink: 0 }}>⚠️</span><span>{error}</span></div>}

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 192, gap: 10 }}>
          <span className="spinner" />
          <span style={{ fontFamily: '"DM Sans",sans-serif', color: '#9CA3AF', fontSize: '0.875rem' }}>Loading recurring rules...</span>
        </div>
      ) : rules.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 240, gap: 12 }}>
          <span style={{ fontSize: 52 }}>🔁</span>
          <p style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.9375rem', color: '#9CA3AF' }}>No recurring rules yet</p>
          <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: '#9CA3AF' }}>Automate your regular expenses and income!</p>
          <button className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '0.875rem' }} onClick={openCreate}>+ Add Recurring</button>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden', borderRadius: 16 }}>
          {/* Table header */}
          <div className="tx-header" style={{ display: 'grid', gridTemplateColumns: '1fr 130px 110px 110px 120px 90px 80px', alignItems: 'center', padding: '12px 20px', background: 'rgba(79,70,229,0.04)', borderBottom: '1.5px solid rgba(79,70,229,0.08)' }}>
            {['NAME','CATEGORY','FREQUENCY','AMOUNT','NEXT DATE','STATUS','ACTIONS'].map(c => (
              <span key={c} style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{c}</span>
            ))}
          </div>
          {/* Rows */}
          {rules.map((rule, i) => (
            <div key={rule.id} className="tx-row"
              style={{ display: 'grid', gridTemplateColumns: '1fr 130px 110px 110px 120px 90px 80px', alignItems: 'center', padding: '14px 20px', borderBottom: i < rules.length-1 ? '1px solid var(--color-border)' : 'none', transition: 'background 0.15s ease', animation: 'fadeInUp 0.3s ease both', animationDelay: `${i*0.04}s` }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(79,70,229,0.025)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = ''; }}
            >
              {/* Name */}
              <div>
                <p style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-text)' }}>{rule.name}</p>
                {rule.description && <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.8rem', color: '#9CA3AF' }}>{rule.description}</p>}
              </div>
              {/* Category */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4F46E5', flexShrink: 0 }} />
                <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: 'var(--color-text-sub)' }}>{rule.category_name || '—'}</span>
              </div>
              {/* Frequency badge */}
              {(() => {
                const freq = { monthly: { bg:'#EEF2FF',color:'#4F46E5',border:'#C7D2FE' }, weekly: { bg:'#ECFDF5',color:'#059669',border:'#A7F3D0' }, daily: { bg:'#FFFBEB',color:'#D97706',border:'#FDE68A' }, yearly: { bg:'#F5F3FF',color:'#7C3AED',border:'#DDD6FE' } }[rule.frequency] || { bg:'#F3F4F6',color:'#6B7280',border:'#E5E7EB' };
                return <span style={{ display:'inline-flex', alignItems:'center', width:'fit-content', fontFamily:'"DM Sans",sans-serif', fontWeight:600, fontSize:'0.7rem', borderRadius:999, padding:'2px 6px', border:'1px solid', background:freq.bg, color:freq.color, borderColor:freq.border }}>{rule.frequency}</span>;
              })()}
              {/* Amount */}
              <span style={{ fontFamily: '"JetBrains Mono",monospace', fontWeight: 600, fontSize: '0.9375rem', color: rule.type === 'income' ? '#059669' : '#DC2626' }}>
                {rule.type === 'income' ? '+' : '-'}{new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR'}).format(rule.amount)}
              </span>
              {/* Next date */}
              <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: '#6B7280' }}>
                {rule.next_run_date ? new Date(rule.next_run_date).toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'}) : '—'}
              </span>
              {/* Status toggle */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                <button type="button"
                  onClick={() => handleToggle(rule)}
                  disabled={toggling === rule.id}
                  style={{ width: 44, height: 24, borderRadius: 999, border: 'none', cursor: toggling === rule.id ? 'wait' : 'pointer', position: 'relative', opacity: toggling === rule.id ? 0.6 : 1, transition: 'background 0.2s', background: rule.is_active ? 'linear-gradient(135deg,#10B981,#059669)' : '#D1D5DB' }}
                >
                  <span style={{ position: 'absolute', top: 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s cubic-bezier(0.34,1.56,0.64,1)', left: rule.is_active ? 23 : 3 }} />
                </button>
                <span style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.7rem', color: rule.is_active ? '#059669' : '#9CA3AF' }}>{rule.is_active ? 'Active' : 'Paused'}</span>
              </div>
              {/* Actions */}
              <div className="rec-actions" style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => openEdit(rule)} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#4F46E5'} onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button onClick={() => setDeleteTarget(rule)} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#EF4444'} onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <Modal isOpen={showForm} onClose={closeForm} title={editTarget ? 'Edit Recurring Rule' : 'Add Recurring Rule'} width="500px">
          {formError && <div style={{ margin: '0 0 16px', background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '10px 14px', color: '#DC2626', fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem' }}>{formError}</div>}
          <RecurringForm initial={editTarget} onSubmit={handleFormSubmit} onCancel={closeForm} loading={formLoading} />
        </Modal>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.50)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => setDeleteTarget(null)}>
          <div className="modal-content" style={{ background: '#fff', borderRadius: 20, width: 380, maxWidth: '100%', padding: 28, boxShadow: '0 24px 80px rgba(0,0,0,0.20)', animation: 'slideInRight 0.3s cubic-bezier(0.22,1,0.36,1) both', textAlign: 'center' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', animation: 'countUp 0.3s ease' }}>
              <span style={{ fontSize: 28, color: '#D97706' }}>⚠️</span>
            </div>
            <h3 style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 600, fontSize: '1.125rem', color: 'var(--color-text)' }}>Delete Recurring Rule?</h3>
            <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6, marginTop: 8 }}>This will stop all future automatic transactions for this rule. Existing transactions will not be affected.</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={() => setDeleteTarget(null)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button onClick={handleDelete} disabled={deleteLoading} className="btn btn-danger" style={{ flex: 1 }}>
                {deleteLoading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Deleting...</> : 'Delete Rule'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </MainLayout>
  );
}
