import axios from 'axios';

// Replace with your Raspberry Pi's IP address
const API_BASE_URL = 'http://192.168.2.6:5000'; // CHANGE THIS TO YOUR PI'S IP

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getItems = () => api.get('/items');
export const getItem = (id) => api.get(`/items/${id}`);
export const createItem = (data) => api.post('/items', data);
export const updateItem = (id, data) => api.patch(`/items/${id}`, data);
export const deleteItem = (id) => api.delete(`/items/${id}`);
export const getStats = () => api.get('/stats');

export default api;