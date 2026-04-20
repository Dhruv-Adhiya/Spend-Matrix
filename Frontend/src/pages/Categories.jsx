import { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/categoryService';

const CAT_BG_COLORS = ['#EEF2FF','#D1FAE5','#FEF3C7','#FCE7F3','#DBEAFE','#FEE2E2','#F3E8FF','#FDF4FF'];
const CAT_ACCENT_COLORS = ['#4F46E5','#10B981','#F59E0B','#EC4899','#3B82F6','#EF4444','#8B5CF6','#A855F7'];
const COLOR_OPTS = ['#4F46E5','#10B981','#F59E0B','#EF4444','#8B5CF6','#3B82F6','#EC4899','#14B8A6'];

function CategoryFormModal({ initial, onClose, onSaved, defaultType }) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({ name: initial?.name || '', type: initial?.type || defaultType || 'expense', color: initial?.color || COLOR_OPTS[0] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return setError('Name is required.');
    setError('');
    setLoading(true);
    try {
      if (isEdit) await updateCategory(initial.id, { name, type: form.type, color: form.color });
      else await createCategory({ name, type: form.type, color: form.color });
      onSaved();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save category.';
      setError(msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('duplicate') ? 'A category with this name already exists.' : msg);
    } finally {
      setLoading(false);
    }
  };

  const lbl = { fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.8125rem', color: 'var(--color-text-sub)', marginBottom: 6, display: 'block' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.50)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}>
      <div className="modal-content" style={{ background: '#fff', borderRadius: 20, width: 380, maxWidth: '100%', padding: 28, boxShadow: '0 24px 80px rgba(0,0,0,0.20)', animation: 'slideInRight 0.3s cubic-bezier(0.22,1,0.36,1) both' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 600, fontSize: '1.125rem', color: 'var(--color-text)' }}>{isEdit ? 'Edit Category' : 'New Category'}</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'rgba(79,70,229,0.06)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.color = '#EF4444'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(79,70,229,0.06)'; e.currentTarget.style.color = '#6B7280'; }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        {error && <div style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '10px 14px', color: '#DC2626', fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', marginBottom: 16 }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={lbl}>Category Name</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Travel, Food, Salary..." className="input" />
          </div>
          {!isEdit && (
            <div>
              <label style={lbl}>Type</label>
              <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: 10, padding: 4, gap: 4 }}>
                {['expense','income'].map(t => (
                  <button key={t} type="button" onClick={() => setForm(f => ({ ...f, type: t }))}
                    style={{ flex: 1, padding: 8, borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s',
                      ...(form.type === t ? { background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', color: '#fff', boxShadow: '0 2px 8px rgba(79,70,229,0.3)' } : { background: 'transparent', color: '#9CA3AF' }) }}
                  >{t === 'expense' ? 'Expense' : 'Income'}</button>
                ))}
              </div>
            </div>
          )}
          <div>
            <label style={lbl}>Pick a Color</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {COLOR_OPTS.map(c => (
                <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                  style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: form.color === c ? `3px solid ${c}80` : '2px solid transparent', cursor: 'pointer', transform: form.color === c ? 'scale(1.15)' : 'scale(1)', transition: 'all 0.15s', outline: form.color === c ? `2px solid ${c}` : 'none', outlineOffset: 2 }}
                />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
              {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</> : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirm({ category, onConfirm, onCancel, loading }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.50)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onCancel}>
      <div style={{ background: '#fff', borderRadius: 20, width: 380, maxWidth: '100%', padding: 28, boxShadow: '0 24px 80px rgba(0,0,0,0.20)', animation: 'slideInRight 0.3s cubic-bezier(0.22,1,0.36,1) both', textAlign: 'center' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(239,68,68,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', animation: 'countUp 0.3s ease' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
        </div>
        <h3 style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 600, fontSize: '1.125rem', color: '#111827' }}>Delete Category?</h3>
        <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6, marginTop: 8 }}>
          Delete <strong>"{category.name}"</strong>? This cannot be undone. Categories with existing transactions cannot be deleted.
        </p>
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

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('expense');

  const fetchCategories = () => {
    setLoading(true);
    getCategories()
      .then(setCategories)
      .catch(() => setError('Failed to load categories.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteCategory(deleteTarget.id);
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category.');
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const filtered = categories.filter(c => c.type === activeTab);

  return (
    <MainLayout>
      <div className="page-enter">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 className="gradient-text" style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 700, fontSize: '1.5rem' }}>Categories</h1>
        <button onClick={() => { setEditTarget(null); setShowModal(true); }} className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '0.875rem' }}>+ New Category</button>
      </div>

      {/* Tab Switcher */}
      <div className="pill-toggle" style={{ display: 'inline-flex', background: '#F3F4F6', borderRadius: 12, padding: 4, gap: 8, marginBottom: 20 }}>
        {['expense','income'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{
              padding: '8px 20px', borderRadius: 9, border: 'none', cursor: 'pointer',
              fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.875rem',
              transition: 'all 0.2s ease',
              ...(activeTab === t
                ? { background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', color: '#fff', boxShadow: '0 2px 8px rgba(79,70,229,0.3)' }
                : { background: 'transparent', color: '#9CA3AF' }),
            }}
          >{t === 'expense' ? 'Expense Categories' : 'Income Categories'}</button>
        ))}
      </div>

      {error && <div style={{ background: 'rgba(239,68,68,0.07)', border: '1.5px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #EF4444', borderRadius: 10, padding: '12px 16px', color: '#DC2626', fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 192, gap: 10 }}>
          <span className="spinner" />
        </div>
      ) : (
        <>
          {/* Category Grid */}
          {filtered.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 240, gap: 12 }}>
              <span style={{ fontSize: 52 }}>🏷️</span>
              <p style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.9375rem', color: '#9CA3AF' }}>No {activeTab} categories yet</p>
              <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }} onClick={() => { setEditTarget(null); setShowModal(true); }}>+ Add Category</button>
            </div>
          ) : (
            <div className="grid-categories">
              {filtered.map((cat, i) => (
                <div key={cat.id} className="card card-hover"
                  style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, position: 'relative', overflow: 'hidden', animation: 'fadeInUp 0.3s ease both', animationDelay: `${i*0.05}s` }}
                  onMouseEnter={e => e.currentTarget.querySelector('.cat-actions').style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.querySelector('.cat-actions').style.opacity = '0'}
                >
                  {/* Icon circle */}
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: CAT_BG_COLORS[i % CAT_BG_COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"DM Sans",sans-serif', fontWeight: 700, fontSize: 16, flexShrink: 0, color: '#374151' }}>
                    {cat.name[0].toUpperCase()}
                  </div>
                  {/* Center */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 600, fontSize: '0.9375rem', color: '#111827' }}>{cat.name}</p>
                    <p style={{ fontFamily: '"DM Sans",sans-serif', fontWeight: 400, fontSize: '0.8rem', color: '#9CA3AF', marginTop: 3 }}>{cat.transaction_count ?? 0} transactions</p>
                    <div style={{ marginTop: 8, height: 4, borderRadius: 999, background: '#F3F4F6' }}>
                      <div style={{ height: 4, borderRadius: 999, background: CAT_ACCENT_COLORS[i % CAT_ACCENT_COLORS.length], width: `${Math.min((cat.transaction_count || 0) * 5, 100)}%`, transition: 'width 0.8s ease' }} />
                    </div>
                  </div>
                  {/* System badge */}
                  {cat.is_default && (
                    <span style={{ position: 'absolute', top: 8, right: 8, background: '#F3F4F6', color: '#9CA3AF', border: '1px solid #E5E7EB', fontFamily: '"DM Sans",sans-serif', fontWeight: 500, fontSize: '0.75rem', padding: '2px 8px', borderRadius: 999 }}>Default</span>
                  )}
                  {/* Actions */}
                  <div className="cat-actions" style={{ display: 'flex', gap: 4, opacity: 0, transition: 'opacity 0.15s', flexShrink: 0 }}>
                    <button onClick={() => { setEditTarget(cat); setShowModal(true); }} disabled={cat.is_default}
                      style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'transparent', cursor: cat.is_default ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', opacity: cat.is_default ? 0.4 : 1 }}
                      onMouseEnter={e => { if (!cat.is_default) e.currentTarget.style.color = '#4F46E5'; }}
                      onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button onClick={() => setDeleteTarget(cat)} disabled={cat.is_default}
                      style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'transparent', cursor: cat.is_default ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', opacity: cat.is_default ? 0.4 : 1 }}
                      onMouseEnter={e => { if (!cat.is_default) e.currentTarget.style.color = '#EF4444'; }}
                      onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showModal && (
        <CategoryFormModal
          initial={editTarget}
          onClose={() => { setShowModal(false); setEditTarget(null); }}
          onSaved={fetchCategories}
          defaultType={activeTab}
        />
      )}

      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.50)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
          onClick={() => setDeleteTarget(null)}>
          <div className="modal-content" style={{ background: '#fff', borderRadius: 20, width: 380, maxWidth: '100%', padding: 28, boxShadow: '0 24px 80px rgba(0,0,0,0.20)', animation: 'slideInRight 0.3s cubic-bezier(0.22,1,0.36,1) both', textAlign: 'center' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(239,68,68,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', animation: 'countUp 0.3s ease' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
            </div>
            <h3 style={{ fontFamily: '"Plus Jakarta Sans",sans-serif', fontWeight: 600, fontSize: '1.125rem', color: 'var(--color-text)' }}>Delete Category?</h3>
            <p style={{ fontFamily: '"DM Sans",sans-serif', fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.6, marginTop: 8 }}>This cannot be undone. Categories with existing transactions cannot be deleted.</p>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={() => setDeleteTarget(null)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
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
