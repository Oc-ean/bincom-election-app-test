import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  timeout: 15000
});

export default {
  getLgas: () => api.get('/api/lgas').then(r => r.data),
  getWards: (lgaId) => api.get(`/api/wards/${lgaId}`).then(r => r.data),
  getPollingUnits: (wardId) => api.get(`/api/polling-units/${wardId}`).then(r => r.data),
  getParties: () => api.get('/api/parties').then(r => r.data),

  getPollingUnitResult: (uniqueid) =>
    api.get(`/api/polling-unit-result/${uniqueid}`).then(r => r.data),

  getLgaSum: (lgaId) => api.get(`/api/lga-sum/${lgaId}`).then(r => r.data),

  addPollingUnit: (payload) => api.post('/api/polling-unit', payload).then(r => r.data)
};