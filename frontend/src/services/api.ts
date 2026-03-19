import axios from 'axios';
import type { AuthResponse } from './types';

const api = axios.create({
  baseURL: '/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const uploadResume = (file: File, jobDescription?: string) => {
  const formData = new FormData();
  formData.append('resume', file);
  if (jobDescription) {
    formData.append('jobDescription', jobDescription);
  }
  return api.post<{ jobId: string }>('/resumes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const getJobStatus = (jobId: string) => {
  return api.get(`/resumes/status/${jobId}`);
};

export const login = (email: string, password: string) => {
  return api.post<AuthResponse>('/auth/login', { email, password });
};

export const register = (email: string, name: string, password: string) => {
  return api.post<AuthResponse>('/auth/register', { email, name, password });
};
