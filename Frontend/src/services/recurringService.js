import api from './api';
import { getCategories } from './categoryService';

export const getRecurring = async () => {
  const [rules, categories] = await Promise.all([
    api.get('/recurring').then((r) => r.data.data),
    getCategories(),
  ]);
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  return rules.map((r) => ({ ...r, category_name: catMap[r.category_id] ?? `#${r.category_id}` }));
};

export const createRecurring = (data) => api.post('/recurring', data).then((r) => r.data.data);

// Backend update only accepts: amount, description, frequency, end_date, is_active, payment_source
export const updateRecurring = (id, data) => {
  const { amount, description, frequency, end_date, is_active, payment_source } = data;
  const payload = {};
  if (amount !== undefined) payload.amount = amount;
  if (description !== undefined) payload.description = description;
  if (frequency !== undefined) payload.frequency = frequency;
  if (end_date !== undefined) payload.end_date = end_date;
  if (is_active !== undefined) payload.is_active = is_active;
  if (payment_source !== undefined) payload.payment_source = payment_source;
  return api.put(`/recurring/${id}`, payload).then((r) => r.data.data);
};

export const deleteRecurring = (id) => api.delete(`/recurring/${id}`).then((r) => r.data);

// Backend has no /toggle route — uses PUT /:id with { is_active }
export const toggleRecurring = (id, is_active) =>
  api.put(`/recurring/${id}`, { is_active }).then((r) => r.data.data);
