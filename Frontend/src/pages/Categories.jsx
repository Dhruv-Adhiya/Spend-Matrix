import { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/categoryService';

function CategoryFormModal({ initial, onClose, onSaved }) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({ name: initial?.name || '', type: initial?.type || 'expense' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return setError('Name is required.');
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await updateCategory(initial.id, { name, type: form.type });
      } else {
        await createCategory({ name, type: form.type });
      }
      onSaved();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save category.';
      setError(
        msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('duplicate')
          ? 'A category with this name already exists.'
          : msg
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">
            {isEdit ? 'Edit Category' : 'New Category'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
        </div>

        {error && (
          <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-3">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Travel"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="flex gap-2 mt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition disabled:opacity-60">
              {loading ? 'Saving…' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirm({ category, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xs p-6 text-center">
        <p className="text-sm text-gray-700 mb-1">Delete category</p>
        <p className="text-sm font-semibold text-gray-800 mb-4">"{category.name}"?</p>
        <p className="text-xs text-gray-400 mb-4">
          This cannot be undone. Categories with existing transactions cannot be deleted.
        </p>
        <div className="flex gap-2">
          <button onClick={onCancel}
            className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition disabled:opacity-60">
            {loading ? 'Deleting…' : 'Delete'}
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

  const income = categories.filter((c) => c.type === 'income');
  const expense = categories.filter((c) => c.type === 'expense');

  const renderGroup = (title, items, colorClass) => (
    <div>
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400 py-3">No {title.toLowerCase()} categories yet.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {items.map((cat) => (
              <li key={cat.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${colorClass}`} />
                  <span className="text-sm text-gray-800">{cat.name}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setEditTarget(cat); setShowModal(true); }}
                    className="text-indigo-500 hover:text-indigo-700 text-xs font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(cat)}
                    className="text-red-400 hover:text-red-600 text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Categories</h1>
        <button
          onClick={() => { setEditTarget(null); setShowModal(true); }}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
        >
          + Add Category
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Loading…</div>
      ) : (
        <div className="flex flex-col gap-6">
          {renderGroup('Income', income, 'bg-green-400')}
          {renderGroup('Expense', expense, 'bg-red-400')}
        </div>
      )}

      {showModal && (
        <CategoryFormModal
          initial={editTarget}
          onClose={() => { setShowModal(false); setEditTarget(null); }}
          onSaved={fetchCategories}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          category={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </MainLayout>
  );
}
