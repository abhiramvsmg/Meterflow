import axios from 'axios';

const API_BASE = 'http://localhost:8002';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Auth
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE}/token`, { email, password });
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
      }
      return response.data;
    } catch (error) {
      return error.response?.data || { detail: 'Login failed' };
    }
  },

  register: async (email, password, full_name) => {
    try {
      const response = await axios.post(`${API_BASE}/register`, { email, password, full_name });
      return response.data;
    } catch (error) {
      return error.response?.data || { detail: 'Registration failed' };
    }
  },

  getMe: async () => {
    try {
      const response = await axios.get(`${API_BASE}/me`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      return null;
    }
  },

  // APIs
  getApis: async () => {
    const response = await axios.get(`${API_BASE}/apis`, { headers: getAuthHeader() });
    return response.data;
  },

  registerApi: async (name, base_url, description) => {
    const response = await axios.post(`${API_BASE}/apis`, { name, base_url, description }, { headers: getAuthHeader() });
    return response.data;
  },

  deleteApi: async (id) => {
    const response = await axios.delete(`${API_BASE}/apis/${id}`, { headers: getAuthHeader() });
    return response.data;
  },

  // Keys
  getKeys: async () => {
    const response = await axios.get(`${API_BASE}/keys`, { headers: getAuthHeader() });
    return response.data;
  },

  createKey: async (name, usage_limit, token, api_id) => {
    const response = await axios.post(`${API_BASE}/keys`, { name, usage_limit, api_id }, { headers: getAuthHeader() });
    return response.data;
  },

  deleteKey: async (id) => {
    const response = await axios.delete(`${API_BASE}/keys/${id}`, { headers: getAuthHeader() });
    return response.data;
  },

  // Billing
  getPlans: async () => {
    const response = await axios.get(`${API_BASE}/plans`, { headers: getAuthHeader() });
    return response.data;
  },

  getUsage: async () => {
    const response = await axios.get(`${API_BASE}/billing/usage`, { headers: getAuthHeader() });
    return response.data;
  },

  updatePlan: async (planId) => {
    const response = await axios.post(`${API_BASE}/billing/plan/${planId}`, {}, { headers: getAuthHeader() });
    return response.data;
  },

  // Stats & Playground
  getStats: async () => {
    const response = await axios.get(`${API_BASE}/stats`, { headers: getAuthHeader() });
    return response.data;
  },

  proxyRequest: async (endpoint, apiKey) => {
    // This is a simulation of the gateway request
    const response = await axios.get(`https://jsonplaceholder.typicode.com/${endpoint}`, {
      headers: { 'X-API-KEY': apiKey }
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};
