import api from './api';

export const analyticsService = {
  getMonthlySummary: async (month, year) => {
    const response = await api.get('/analytics/monthly-summary', { params: { month, year } });
    return response.data;
  },
  getCategoryBreakdown: async (month, year) => {
    const response = await api.get('/analytics/category-breakdown', { params: { month, year } });
    return response.data;
  },
  getBudgetVsActual: async (month, year) => {
    const response = await api.get('/analytics/budget-vs-actual', { params: { month, year } });
    return response.data;
  },
  getDailyExpense: async (month, year) => {
    const response = await api.get('/analytics/daily-expense', { params: { month, year } });
    return response.data;
  },
  getPaymentSourceBreakdown: async (month, year) => {
    const response = await api.get('/analytics/payment-source-breakdown', { params: { month, year } });
    return response.data;
  }
};
