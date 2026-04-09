import { useState, useEffect } from 'react';
import { adminAPI } from '../services/adminService';

const FREQ_COLOR = {
  daily: 'bg-blue-100 text-blue-700',
  weekly: 'bg-purple-100 text-purple-700',
  monthly: 'bg-indigo-100 text-indigo-700',
  yearly: 'bg-pink-100 text-pink-700',
};

export default function AdminRecurringTable() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toggling, setToggling] = useState(null);
  const [toggleError, setToggleError] = useState('');

  const fetchData = async (p = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.getRecurring({ page: p, limit: 20 });
      // backend returns: { data: [...], pagination: { total, page, totalPages } }
      setData(res.data?.data ?? []);
      const pg = res.data?.pagination ?? {};
      setMeta({ total: pg.total ?? 0, page: pg.page ?? 1, totalPages: pg.totalPages ?? 1 });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load recurring rules.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(page); }, [page]);

  const handleToggle = async (rule) => {
    if (toggling === rule.id) return;
    setToggling(rule.id);
    setToggleError('');
    try {
      await adminAPI.toggleRecurring(rule.id);
      setData((prev) =>
        prev.map((r) => (r.id === rule.id ? { ...r, is_active: !r.is_active } : r))
      );
    } catch (err) {
      setToggleError(err.response?.data?.message || err.response?.data?.error || 'Toggle failed.');
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      {toggleError && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{toggleError}</p>}

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Frequency</th>
              <th className="px-4 py-3 text-left">Next Run</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-10 text-gray-400">Loading...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-10 text-gray-400">No recurring rules found.</td>
              </tr>
            ) : data.map((r) => (
              <tr key={r.id} className={`hover:bg-gray-50 ${!r.is_active ? 'opacity-60' : ''}`}>
                <td className="px-4 py-3 text-gray-400">{r.id}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{r.user_email ?? r.user_id}</td>
                <td className="px-4 py-3 text-gray-700">{r.category_name ?? `#${r.category_id}`}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    r.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                  }`}>
                    {r.type}
                  </span>
                </td>
                <td className={`px-4 py-3 font-semibold ${r.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                  {r.type === 'income' ? '+' : '-'}₹{Number(r.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${FREQ_COLOR[r.frequency] ?? 'bg-gray-100 text-gray-600'}`}>
                    {r.frequency}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {r.next_run_date ? new Date(r.next_run_date).toLocaleDateString('en-IN') : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    r.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {r.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    disabled={toggling === r.id}
                    onClick={() => handleToggle(r)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition disabled:opacity-50 ${
                      r.is_active
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {toggling === r.id ? '…' : r.is_active ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{meta.total} total rules</span>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 rounded-lg border disabled:opacity-40 hover:bg-gray-50"
          >← Prev</button>
          <span className="px-3 py-1">Page {meta.page} / {meta.totalPages || 1}</span>
          <button
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded-lg border disabled:opacity-40 hover:bg-gray-50"
          >Next →</button>
        </div>
      </div>
    </div>
  );
}
