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

const Spinner = () => (
  <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
    <svg className="animate-spin w-5 h-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
    Loading…
  </div>
);

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Recurring Transactions</h1>
          <p className="text-xs text-gray-400 mt-0.5">Rules are auto-processed daily by the scheduler</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
        >
          + Add Rule
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>
      )}

      {loading ? (
        <Spinner />
      ) : (
        <RecurringTable
          rules={rules}
          toggling={toggling}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
          onToggle={handleToggle}
        />
      )}

      {showForm && (
        <Modal
          title={editTarget ? 'Edit Recurring Rule' : 'New Recurring Rule'}
          onClose={closeForm}
        >
          {formError && (
            <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-4">{formError}</p>
          )}
          <RecurringForm
            initial={editTarget}
            onSubmit={handleFormSubmit}
            onCancel={closeForm}
            loading={formLoading}
          />
        </Modal>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-xs p-6 text-center">
            <p className="text-sm text-gray-700 mb-1">Delete this recurring rule?</p>
            <p className="text-xs text-gray-400 mb-4">This action cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition disabled:opacity-60"
              >
                {deleteLoading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
