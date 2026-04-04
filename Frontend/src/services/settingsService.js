import api from './api';

export const settingsAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
  changePassword: (data) => api.put('/users/change-password', data),
  getPreferences: () => api.get('/settings'),
  updatePreferences: (data) => api.patch('/settings', data),
};
