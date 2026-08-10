import api from './api';

export const getGoals = async () => {
  const response = await api.get('/goals');
  return response.data;
};

export const getGoal = async (id) => {
  const response = await api.get(`/goals/${id}`);
  return response.data;
};

export const createGoal = async (goalData) => {
  const response = await api.post('/goals', goalData);
  return response.data;
};

export const updateGoal = async (id, goalData) => {
  const response = await api.patch(`/goals/${id}`, goalData);
  return response.data;
};

export const deleteGoal = async (id) => {
  const response = await api.delete(`/goals/${id}`);
  return response.data;
};

export const contributeToGoal = async (id, amount) => {
  const response = await api.post(`/goals/${id}/contribute`, { amount });
  return response.data;
};
