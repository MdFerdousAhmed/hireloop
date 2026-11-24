import axios from 'axios';
import { INITIAL_JOBS, INITIAL_APPLICATIONS, INITIAL_SAVED_JOBS, INITIAL_STATS } from '../data/mockData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 6000,
});

// Helper for local storage persistence
const getStorage = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const val = localStorage.getItem(`hireloop_${key}`);
    return val ? JSON.parse(val) : fallback;
  } catch (err) {
    return fallback;
  }
};

const setStorage = (key, value) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`hireloop_${key}`, JSON.stringify(value));
  } catch (err) {
    console.error(err);
  }
};

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
  async getCurrentUser() {
    try {
      const res = await apiClient.get('/auth/me');
      return res.data?.data || null;
    } catch (e) {
      return null;
    }
  },
  // Jobs API
  async getJobs(params = {}) {
    try {
      const res = await apiClient.get('/jobs', { params });
      if (res.data?.success && Array.isArray(res.data?.data) && res.data.data.length > 0) {
        return res.data.data;
      }
    } catch (e) {
      console.warn('Backend API unavailable, using local data:', e.message);
    }
    const localJobs = getStorage('jobs', INITIAL_JOBS);
    let filtered = [...localJobs];
    if (params.query) {
      const q = params.query.toLowerCase();
      filtered = filtered.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q)
      );
    }
    if (params.location) {
      const loc = params.location.toLowerCase();
      filtered = filtered.filter(j => j.location.toLowerCase().includes(loc));
    }
    if (params.category && params.category !== 'All') {
      filtered = filtered.filter(j => j.category === params.category);
    }
    if (params.workplaceType && params.workplaceType !== 'All') {
      filtered = filtered.filter(j => j.workplaceType === params.workplaceType);
    }
    if (params.jobType && params.jobType !== 'All') {
      filtered = filtered.filter(j => j.jobType === params.jobType);
    }
    return filtered;
  },
  async getJobById(id) {
    try {
      const res = await apiClient.get(`/jobs/${id}`);
      if (res.data?.success && res.data?.data) {
        return res.data.data;
      }
    } catch (e) {}
    const localJobs = getStorage('jobs', INITIAL_JOBS);
    return localJobs.find(j => String(j.id) === String(id)) || null;
  },
  async createJob(jobData) {
    try {
      const res = await apiClient.post('/jobs', jobData);
      if (res.data?.success && res.data?.data) {
        return res.data.data;
      }
    } catch (e) {
      console.warn('Backend API unavailable for createJob, persisting locally:', e.message);
    }
    const newJob = {
      id: `job-${Date.now()}`,
      postedAt: 'Just now',
      applicantsCount: 0,
      status: 'active',
      featured: false,
      companyLogo: '💼',
      currency: 'USD',
      ...jobData,
    };
    const currentJobs = getStorage('jobs', INITIAL_JOBS);
    const updated = [newJob, ...currentJobs];
    setStorage('jobs', updated);
    return newJob;
  },
  // Applications API
  async getCandidateApplications() {
    try {
      const res = await apiClient.get('/applications');
      if (res.data?.success && Array.isArray(res.data?.data) && res.data.data.length > 0) {
        return res.data.data;
      }
    } catch (e) {}
    return getStorage('applications', INITIAL_APPLICATIONS);
  },
  async applyToJob(jobId, application) {
    try {
      const res = await apiClient.post('/applications', { jobId, ...application });
      if (res.data?.success && res.data?.data) {
        return res.data.data;
      }
    } catch (e) {
      console.warn('Backend API unavailable for applyToJob, persisting locally:', e.message);
    }
    const currentApps = getStorage('applications', INITIAL_APPLICATIONS);
    const localJobs = getStorage('jobs', INITIAL_JOBS);
    const job = localJobs.find(j => String(j.id) === String(jobId));
    const newApp = {
      id: `app-${Date.now()}`,
      jobId,
      jobTitle: job ? job.title : 'Software Role',
      company: job ? job.company : 'Tech Company',
      companyLogo: job ? job.companyLogo : '💼',
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending Review',
      statusColor: 'bg-amber-100 text-amber-800',
      location: job ? job.location : 'Remote',
      salary: job ? `$${(job.salaryMin/1000).toFixed(0)}k - $${(job.salaryMax/1000).toFixed(0)}k` : 'Competitive',
      ...application,
    };
    const updated = [newApp, ...currentApps];
    setStorage('applications', updated);
    const updatedJobs = localJobs.map(j => {
      if (String(j.id) === String(jobId)) {
        return { ...j, applicantsCount: (j.applicantsCount || 0) + 1 };
      }
      return j;
    });
    setStorage('jobs', updatedJobs);
    return newApp;
  },
  async getSavedJobs() {
    const savedIds = getStorage('saved_jobs', INITIAL_SAVED_JOBS);
    const allJobs = await this.getJobs();
    return allJobs.filter(j => savedIds.includes(String(j.id)) || savedIds.includes(Number(j.id)));
  },
  async toggleSaveJob(jobId) {
    const savedIds = getStorage('saved_jobs', INITIAL_SAVED_JOBS);
    const strId = String(jobId);
    let updated;
    if (savedIds.includes(strId)) {
      updated = savedIds.filter(id => id !== strId);
    } else {
      updated = [...savedIds, strId];
    }
    setStorage('saved_jobs', updated);
    return updated.includes(strId);
  },
  async getAdminStats() {
    try {
      const res = await apiClient.get('/admin-dashboard/overview');
      if (res.data?.success && res.data?.data) {
        return res.data.data;
      }
    } catch (e) {}
    return INITIAL_STATS.admin;
  },
  async getAdminAuditLogs() {
    try {
      const res = await apiClient.get('/admin-dashboard/audit-logs');
      if (res.data?.success && res.data?.data) {
        return res.data.data;
      }
    } catch (e) {}
    return [
      { id: 'log-1', admin: 'system@hireloop.com', action: 'JOB_APPROVED', target: 'job-1', timestamp: '10 mins ago', ip: '127.0.0.1' },
      { id: 'log-2', admin: 'admin@hireloop.com', action: 'USER_ROLE_UPDATED', target: 'user-48', timestamp: '1 hour ago', ip: '192.168.1.1' },
      { id: 'log-3', admin: 'admin@hireloop.com', action: 'SECURITY_SCAN', target: 'AUTH_SERVICE', timestamp: '3 hours ago', ip: '10.0.0.4' },
      { id: 'log-4', admin: 'system@hireloop.com', action: 'BACKUP_COMPLETED', target: 'NEON_DB', timestamp: '1 day ago', ip: '127.0.0.1' },
    ];
  },
};