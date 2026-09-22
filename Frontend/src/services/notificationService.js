import api from './api';

export const notificationService = {
  getNotifications: async (page = 1, limit = 20, is_read = false) => {
    const response = await api.get('/notifications', { params: { page, limit, is_read } });
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  }
};
