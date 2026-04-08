import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../services/adminService';

export default function TransactionTable() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [filters, setFilters] = useState({ search: '', type: '', startDate: '', endDate: '', page: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { limit: 15, page: filters.page };
      if (filters.search) params.search = filters.search;
      if (filters.type) params.type = filters.type;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      const res = await adminAPI.getTransactions(params);
      const d = res.data;
      setData(d.data ?? d.transactions ?? []);
      setMeta({
        total: d.total ?? 0,
        page: d.page ?? 1,
        totalPages: d.totalPages ?? Math.ceil((d.total ?? 0) / 15),
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const set = (key, val) => setFilters((f) => ({ ...f, [key]: val, page: 1 }));

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search description..."
          value={filters.search}
          onChange={(e) => set('search', e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <select
          value={filters.type}
          onChange={(e) => set('type', e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => set('startDate', e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => set('endDate', e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Source</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">No transactions found</td></tr>
            ) : data.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400">{t.id}</td>
                <td className="px-4 py-3 text-gray-700">{t.description || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                  }`}>{t.type}</span>
                </td>
                <td className={`px-4 py-3 font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                  {t.type === 'income' ? '+' : '-'}${parseFloat(t.amount).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-gray-600">{t.category_name ?? t.category_id}</td>
                <td className="px-4 py-3 text-gray-500 capitalize">{t.payment_source ?? '—'}</td>
                <td className="px-4 py-3 text-gray-500">{new Date(t.transaction_date ?? t.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{meta.total} total transactions</span>
        <div className="flex gap-2">
          <button
            disabled={filters.page <= 1}
            onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
            className="px-3 py-1 rounded-lg border disabled:opacity-40 hover:bg-gray-50"
          >← Prev</button>
          <span className="px-3 py-1">Page {meta.page} / {meta.totalPages || 1}</span>
          <button
            disabled={filters.page >= meta.totalPages}
            onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
            className="px-3 py-1 rounded-lg border disabled:opacity-40 hover:bg-gray-50"
          >Next →</button>
        </div>
      </div>
    </div>
  );
}
