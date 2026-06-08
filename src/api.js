import axios from 'axios';

const API = axios.create({
  baseURL: 'https://job-portal-backend-production-b9a4.up.railway.app',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getAllJobs = () => API.get('/jobs');
export const getJobById = (id) => API.get(`/jobs/${id}`);
export const searchJobs = (title) => API.get(`/jobs/search?title=${title}`);
export const createJob = (data) => API.post('/jobs', data);
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);
export const applyForJob = (jobId, data) => API.post(`/applications/apply/${jobId}`, data);
export const getMyApplications = () => API.get('/applications/my');
export const getApplicationsForJob = (jobId) => API.get(`/applications/job/${jobId}`);
export const updateApplicationStatus = (appId, status) => API.put(`/applications/${appId}/status?status=${status}`);
export const getProfile = () => API.get('/user/profile');
export const updateProfile = (data) => API.put('/user/profile', data);