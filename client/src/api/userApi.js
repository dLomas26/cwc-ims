import api from '../lib/axios'

export const userApi = {
  getAll: () => api.get('/users'),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  create: (data) => api.post('/users', data),
}
