import { useCallback, useEffect, useRef, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import CategoryDropdown from '../components/CategoryDropdown';
import SearchBar from '../components/SearchBar';
import FilterBar, { FILTER_DEFAULTS } from '../components/FilterBar';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">
            {isEdit ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
        </div>

        {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Type</label>
            <select value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value, category_id: '' }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Category</label>
            <CategoryDropdown value={form.category_id} onChange={(val) => set('category_id', val)} type={form.type} />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Amount (₹)</label>
            <input type="number" min="0.01" step="0.01" value={form.amount}
              onChange={(e) => set('amount', e.target.value)} placeholder="0.00"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Date</label>
            <input type="date" value={form.transaction_date}
              onChange={(e) => set('transaction_date', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Payment Source</label>
            <select value={form.payment_source} onChange={(e) => set('payment_source', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <option value="online">Online</option>
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Description (optional)</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
              rows={2} placeholder="Add a note…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition disabled:opacity-60">
              {loading ? 'Saving…' : isEdit ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
function DeleteConfirm({ onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-xs p-6 text-center">
        <p className="text-sm text-gray-700 mb-4">Delete this transaction?</p>
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

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Transactions</h1>
        <button
          onClick={() => { setEditTarget(null); setShowModal(true); }}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition"
        >
          + Add Transaction
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 mb-4">
        <SearchBar onSearch={setSearch} />
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-4">{error}</p>
      )}

      {/* Results count */}
      {!loading && !error && (
        <p className="text-xs text-gray-400 mb-2">
          {pagination.total} result{pagination.total !== 1 ? 's' : ''}
          {hasActiveSearch ? ' for current search/filters' : ''}
        </p>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
          <svg className="animate-spin w-5 h-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Loading…
        </div>
      ) : transactions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-400 text-sm">
          {hasActiveSearch
            ? 'No transactions match your search or filters.'
            : 'No transactions yet. Click "+ Add Transaction" to get started.'}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Source</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(tx.transaction_date).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      tx.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`px-4 py-3 font-semibold ${
                    tx.type === 'income' ? 'text-green-600' : 'text-red-500'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}₹
                    {Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{SOURCE_LABEL[tx.payment_source] || tx.payment_source}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-[180px] truncate">{tx.description || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => { setEditTarget(tx); setShowModal(true); }}
                      className="text-indigo-500 hover:text-indigo-700 text-xs font-medium mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(tx)}
                      className="text-red-400 hover:text-red-600 text-xs font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
              <span>Page {pagination.page} of {pagination.totalPages}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.page <= 1}
                  className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

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
