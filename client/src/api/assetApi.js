import api from '../lib/axios'

export const assetApi = {
  getAll:       (params)  => api.get('/assets', { params }),
  getById:      (id)      => api.get(`/assets/${id}`),
  create:       (data)    => api.post('/assets', data),
  update:       (id, data) => api.put(`/assets/${id}`, data),
  updateStatus: (id, status) => api.patch(`/assets/${id}/status`, { status }),
  delete:       (id)      => api.delete(`/assets/${id}`),
}
