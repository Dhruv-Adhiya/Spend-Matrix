import api from './api';

export const settingsService = {
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },

  updateSettings: async (data) => {
    const response = await api.patch('/settings', data);
    return response.data;
  }
};
