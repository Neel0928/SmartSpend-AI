import api from './api';

export const getCategoryBreakdown = async (range = 'month') => {
  const response = await api.get(`/analytics/category?range=${range}`);
  return response.data;
};

export const getMonthlyTrend = async () => {
  const response = await api.get('/analytics/trend');
  return response.data;
};
