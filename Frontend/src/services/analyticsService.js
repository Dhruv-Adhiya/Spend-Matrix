import api from './api';

const analyticsAPI = {
  getMonthlySummary: (params) => api.get('/analytics/monthly-summary', { params }),
  getCategoryBreakdown: (params) => api.get('/analytics/category-breakdown', { params }),
  getPaymentSourceBreakdown: () => api.get('/analytics/payment-source-breakdown'),
  getBudgetVsActual: (params) => api.get('/analytics/budget-vs-actual', { params }),
  getDailyExpense: (params) => api.get('/analytics/daily-expense', { params }),
};

export default analyticsAPI;
