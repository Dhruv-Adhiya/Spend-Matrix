import api from './api';

export const recurringService = {
  getAllRecurring: async () => {
    const response = await api.get('/recurring');
    return response.data;
  },

  createRecurring: async (data) => {
    const response = await api.post('/recurring', data);
    return response.data;
  },

  updateRecurring: async (id, data) => {
    const response = await api.put(`/recurring/${id}`, data);
    return response.data;
  },

  deleteRecurring: async (id) => {
    const response = await api.delete(`/recurring/${id}`);
    return response.data;
  }
};
