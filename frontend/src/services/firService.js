import api from './api';

export const submitFIR = (data, idempotencyKey) => api.post('/firs', data, { headers: { 'Idempotency-Key': idempotencyKey } });
export const getFIRs = () => api.get('/firs');
export const getFIR = (id) => api.get(`/firs/${id}`);
export const trackFIR = (ref) => api.get(`/firs/track/${ref}`);
export const updateFIR = (id, data) => api.put(`/firs/${id}`, data);
export const updateFIRStatus = (id, data) => api.put(`/firs/${id}/status`, data);
export const deleteFIR = (id) => api.delete(`/firs/${id}`);
