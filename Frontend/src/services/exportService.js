import api from './api';

export const exportService = {
  exportCSV: async (startDate, endDate) => {
    const response = await api.get('/export/csv', {
      params: { startDate, endDate },
      responseType: 'blob' // Important for file downloads
    });
    return response.data;
  },

  exportPDF: async (startDate, endDate) => {
    const response = await api.get('/export/pdf', {
      params: { startDate, endDate },
      responseType: 'blob' // Important for file downloads
    });
    return response.data;
  }
};
