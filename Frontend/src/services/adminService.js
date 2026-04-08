import api from './api';

export const adminAPI = {
  // Dashboard stats
  getStats: () => api.get('/admin/dashboard'),

  // Users
  getUsers: (params) => api.get('/admin/users', { params }),
  blockUser: (id, is_blocked) => api.patch(`/admin/users/${id}/block`, { is_blocked }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Transactions (global — uses existing /transactions with admin token)
  getTransactions: (params) => api.get('/transactions/search', { params }),

  // Recurring (global — uses existing /recurring, admin sees all via their token)
  getRecurring: (params) => api.get('/recurring', { params }),
  updateRecurring: (id, data) => api.put(`/recurring/${id}`, data),

  // Audit logs
  getLogs: (params) => api.get('/admin/logs', { params }),
};
