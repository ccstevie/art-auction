import axios from 'axios';

// Use relative URL for same-origin API calls to your Next.js API routes
export const api = axios.create({
  baseURL: '/api', // Points to your Next.js API routes
  withCredentials: true,
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);