import api from '../lib/axios'

export const consumableApi = {
  getAll: (params) => api.get('/consumables', { params }),
  getById: (id) => api.get(`/consumables/${id}`),
  create: (data) => api.post('/consumables', data),
  update: (id, data) => api.put(`/consumables/${id}`, data),
  delete: (id) => api.delete(`/consumables/${id}`),
  stockIn: (id, data) => api.post(`/consumables/${id}/stock-in`, data),
  stockOut: (id, data) => api.post(`/consumables/${id}/stock-out`, data),
  markDamaged: (id, data) => api.post(`/consumables/${id}/damaged`, data),
  getTransactions: (id, params) => api.get(`/consumables/${id}/transactions`, { params }),
  // Issue (assign) bulk-inventory items to an employee
  issue: (id, data) => api.post(`/consumables/${id}/issue`, data),
  getAssignments: (params) => api.get('/consumables/assignments', { params }),
  returnIssue: (assignmentId, data) =>
    api.patch(`/consumables/assignments/${assignmentId}/return`, data),
}
