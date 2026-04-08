import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../services/adminService';

export default function UserTable() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [blockedFilter, setBlockedFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      if (blockedFilter !== '') params.is_blocked = blockedFilter;
      const res = await adminAPI.getUsers(params);
      setData(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, blockedFilter]);

  useEffect(() => { fetchUsers(1); }, [fetchUsers]);

  const handleBlock = async (id, currentBlocked) => {
    setActionError('');
    try {
      await adminAPI.blockUser(id, !currentBlocked);
      fetchUsers(pagination.page);
    } catch (err) {
      setActionError(err.response?.data?.error || 'Action failed');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This will also remove their transactions.`)) return;
    setActionError('');
    try {
      await adminAPI.deleteUser(id);
      fetchUsers(pagination.page);
    } catch (err) {
      setActionError(err.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={blockedFilter}
          onChange={(e) => setBlockedFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="">All Status</option>
          <option value="false">Active</option>
          <option value="true">Blocked</option>
        </select>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {actionError && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{actionError}</p>}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Joined</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">No users found</td></tr>
            ) : data.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-400">{u.id}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{u.full_name}</td>
                <td className="px-4 py-3 text-gray-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                  }`}>{u.role}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    u.is_blocked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>{u.is_blocked ? 'Blocked' : 'Active'}</span>
                </td>
                <td className="px-4 py-3 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 flex gap-2">
                  {u.role !== 'admin' && (
                    <>
                      <button
                        onClick={() => handleBlock(u.id, u.is_blocked)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                          u.is_blocked
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                      >
                        {u.is_blocked ? 'Unblock' : 'Block'}
                      </button>
                      <button
                        onClick={() => handleDelete(u.id, u.full_name)}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{pagination.total} total users</span>
        <div className="flex gap-2">
          <button
            disabled={pagination.page <= 1}
            onClick={() => fetchUsers(pagination.page - 1)}
            className="px-3 py-1 rounded-lg border disabled:opacity-40 hover:bg-gray-50"
          >← Prev</button>
          <span className="px-3 py-1">Page {pagination.page} / {pagination.totalPages}</span>
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => fetchUsers(pagination.page + 1)}
            className="px-3 py-1 rounded-lg border disabled:opacity-40 hover:bg-gray-50"
          >Next →</button>
        </div>
      </div>
    </div>
  );
}
