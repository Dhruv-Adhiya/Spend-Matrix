import api from './api';

export const adminAPI = {
  // Dashboard stats
  getStats: () => api.get('/admin/dashboard'),

  // Users
  getUsers: (params) => api.get('/admin/users', { params }),
  blockUser: (id, is_blocked) => api.patch(`/admin/users/${id}/block`, { is_blocked }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Transactions (global — dedicated admin endpoint)
  getTransactions: (params) => api.get('/admin/transactions', { params }),

  // Recurring (global — dedicated admin endpoint)
  getRecurring: (params) => api.get('/admin/recurring', { params }),
  updateRecurring: (id, data) => api.put(`/recurring/${id}`, data),

  // Audit logs
  getLogs: (params) => api.get('/admin/logs', { params }),
};
