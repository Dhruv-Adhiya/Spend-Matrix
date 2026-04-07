import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const buildParams = (filters = {}) => {
  const params = {};
  if (filters.search) params.search = filters.search;
  if (filters.type) params.type = filters.type;
  if (filters.category_id) params.category_id = filters.category_id;
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;
  if (filters.minAmount) params.minAmount = filters.minAmount;
  if (filters.maxAmount) params.maxAmount = filters.maxAmount;
  if (filters.payment_source) params.payment_source = filters.payment_source;
  return params;
};

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportCSV = async (filters) => {
  const res = await api.get('/export/csv', {
    params: buildParams(filters),
    responseType: 'blob',
  });
  downloadBlob(res.data, 'transactions.csv');
};

export const exportPDF = async (filters) => {
  const res = await api.get('/export/pdf', {
    params: buildParams(filters),
    responseType: 'blob',
  });
  downloadBlob(res.data, 'transactions.pdf');
};
