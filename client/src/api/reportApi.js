import api from '../lib/axios'

export const reportApi = {
  getEmployeeAssets: () => api.get('/reports/employees'),
  getCategoryAssets: () => api.get('/reports/categories'),
  getAssetStatus: (params) => api.get('/reports/asset-status', { params }),
  getAssignmentHistory: (params) => api.get('/reports/assignment-history', { params }),
  getConsumableStock: () => api.get('/reports/consumable-stock'),
  getBulkInventoryTransactions: (params) => api.get('/reports/bulk-inventory-transactions', { params }),
  getDamagedAssets: () => api.get('/reports/damaged-assets'),
}

export const exportApi = {
  exportEmployees: () => api.get('/export/employees', { responseType: 'blob' }),
  exportAssets: () => api.get('/export/assets', { responseType: 'blob' }),
  exportAssignments: () => api.get('/export/assignments', { responseType: 'blob' }),
  exportStock: () => api.get('/export/stock', { responseType: 'blob' }),
  exportBulkInventoryTransactions: (params) =>
    api.get('/export/bulk-inventory-transactions', { params, responseType: 'blob' }),
}

export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
