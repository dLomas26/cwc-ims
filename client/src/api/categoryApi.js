import api from '../lib/axios'

export const categoryApi = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  getWithFields: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
  getFields: (id) => api.get(`/categories/${id}/fields`),
  addField: (id, data) => api.post(`/categories/${id}/fields`, data),
  updateField: (categoryId, fieldId, data) => api.put(`/categories/${categoryId}/fields/${fieldId}`, data),
  deleteField: (categoryId, fieldId) => api.delete(`/categories/${categoryId}/fields/${fieldId}`),
}
