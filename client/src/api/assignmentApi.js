import api from '../lib/axios'

export const assignmentApi = {
  getAll: (params) => api.get('/assignments', { params }),
  assign: (data) => api.post('/assignments', data),
  return: (id, data) => api.patch(`/assignments/${id}/return`, data),
  getHistory: (params) => api.get('/assignments/history', { params }),
}
