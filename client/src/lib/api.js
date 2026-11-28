import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000,
});

// Attach Bearer access token from localStorage on every request
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('hireloop_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Shared refresh promise to deduplicate concurrent 401 refresh attempts
let refreshPromise = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url || '';

    const isAuthRoute =
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/refresh');

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true, timeout: 10000 })
            .finally(() => {
              refreshPromise = null;
            });
        }
        const refreshRes = await refreshPromise;
        const { token, user } = refreshRes.data?.data || {};
        if (token && typeof window !== 'undefined') {
          localStorage.setItem('hireloop_token', token);
          if (user) {
            localStorage.setItem('hireloop_user', JSON.stringify(user));
          }
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('hireloop_token');
          localStorage.removeItem('hireloop_user');
        }
      }
    }

    return Promise.reject(error);
  }
);

export const api = {
  // Auth API
  async login(email, password) {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data?.data || {};
  },
  async register(data) {
    const res = await apiClient.post('/auth/register', data);
    return res.data?.data || {};
  },
  async refresh() {
    const res = await apiClient.post('/auth/refresh');
    return res.data?.data || {};
  },
  async logout() {
    await apiClient.post('/auth/logout');
  },
  async getCurrentUser() {
    const res = await apiClient.get('/auth/me');
    return res.data?.data || null;
  },
  async updateProfile(data) {
    const res = await apiClient.put('/auth/profile', data);
    return res.data?.data || null;
  },

  // Public stats & contact
  async getPublicStats() {
    const res = await apiClient.get('/stats/public');
    return res.data?.data || {};
  },
  async submitContact(data) {
    const res = await apiClient.post('/contact', data);
    return res.data?.data || {};
  },

  // Companies API
  async getCompanies(params = {}) {
    const res = await apiClient.get('/companies', { params });
    return res.data?.data || [];
  },
  async getMyCompany() {
    const res = await apiClient.get('/companies/me');
    return res.data?.data || null;
  },
  async updateMyCompany(data) {
    const res = await apiClient.put('/companies/me', data);
    return res.data?.data || null;
  },

  // Jobs API
  async getJobs(params = {}) {
    const res = await apiClient.get('/jobs', { params });
    return res.data?.data || [];
  },
  async getJobById(id) {
    const res = await apiClient.get(`/jobs/${id}`);
    return res.data?.data || null;
  },
  async getEmployerJobs() {
    const res = await apiClient.get('/jobs/employer/mine');
    return res.data?.data || [];
  },
  async createJob(jobData) {
    const res = await apiClient.post('/jobs', jobData);
    return res.data?.data || null;
  },
  async updateJobStatus(jobId, status) {
    const res = await apiClient.patch(`/jobs/${jobId}`, { status });
    return res.data?.data || null;
  },
  async deleteJob(jobId) {
    await apiClient.delete(`/jobs/${jobId}`);
  },
  async getSavedJobs() {
    const res = await apiClient.get('/jobs/saved/list');
    return res.data?.data || [];
  },
  async toggleSaveJob(jobId) {
    const res = await apiClient.post(`/jobs/${jobId}/save`);
    return Boolean(res.data?.data?.saved);
  },

  // Applications API
  async getApplications() {
    const res = await apiClient.get('/applications');
    return res.data?.data || [];
  },
  async getCandidateApplications() {
    return this.getApplications();
  },
  async applyToJob(jobId, application) {
    const res = await apiClient.post('/applications', { jobId, ...application });
    return res.data?.data || null;
  },
  async updateApplicationStatus(applicationId, status) {
    const res = await apiClient.patch(`/applications/${applicationId}/status`, { status });
    return res.data?.data || null;
  },

  // Admin API
  async getAdminDashboard() {
    const res = await apiClient.get('/admin-dashboard');
    return res.data?.data || {};
  },
  async getAdminUsers(params = {}) {
    const res = await apiClient.get('/admin-dashboard/users', { params });
    return res.data?.data || { rows: [], pagination: {} };
  },
  async updateAdminUser(userId, updates) {
    const res = await apiClient.patch(`/admin-dashboard/users/${userId}`, updates);
    return res.data;
  },
  async getAdminCompanies(params = {}) {
    const res = await apiClient.get('/admin-dashboard/companies', { params });
    return res.data?.data || { rows: [], pagination: {} };
  },
  async verifyAdminCompany(companyId, verificationStatus) {
    const res = await apiClient.patch(`/admin-dashboard/companies/${companyId}`, { verificationStatus });
    return res.data;
  },
  async getAdminJobs(params = {}) {
    const res = await apiClient.get('/admin-dashboard/jobs', { params });
    return res.data?.data || { rows: [], pagination: {} };
  },
  async moderateAdminJob(jobId, status) {
    const res = await apiClient.patch(`/admin-dashboard/jobs/${jobId}`, { status });
    return res.data;
  },
};
