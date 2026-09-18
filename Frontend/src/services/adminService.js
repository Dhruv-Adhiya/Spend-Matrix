import api from './api';

export const adminService = {
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getUser: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  blockUser: async (id) => {
    const response = await api.patch(`/admin/users/${id}/block`);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  getTransactions: async () => {
    const response = await api.get('/admin/transactions');
    return response.data;
  },

  getRecurring: async () => {
    const response = await api.get('/admin/recurring');
    return response.data;
  },

  toggleRecurring: async (id) => {
    const response = await api.patch(`/admin/recurring/${id}/toggle`);
    return response.data;
  },

  getLogs: async (page = 1, limit = 50) => {
    const response = await api.get('/admin/logs', { params: { page, limit } });
    return response.data;
  }
};
