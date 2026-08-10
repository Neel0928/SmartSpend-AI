import api from './api';

export const getDashboardInsights = async () => {
  const response = await api.get('/insights');
  return response.data;
};

export const scanReceipt = async (formData) => {
  const response = await api.post('/insights/scan-receipt', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getBudgetInsights = async (budgets) => {
  const response = await api.post('/insights/budgets', { budgets });
  return response.data;
};
