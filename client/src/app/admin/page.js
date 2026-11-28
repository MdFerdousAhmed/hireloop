'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { api } from '@/lib/api';
import { Users, Briefcase, Building2, ShieldCheck } from 'lucide-react';

export default function AdminPage() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAllAdminData = useCallback(async () => {
    try {
      const [overviewRes, usersRes, jobsRes, companiesRes] = await Promise.all([
        api.getAdminDashboard().catch(() => ({})),
        api.getAdminUsers({ limit: 20 }).catch(() => ({ rows: [] })),
        api.getAdminJobs({ limit: 20 }).catch(() => ({ rows: [] })),
        api.getAdminCompanies({ limit: 20 }).catch(() => ({ rows: [] })),
      ]);
      setStats(overviewRes?.stats || {});
      setAuditLogs(overviewRes?.recentAuditLogs || []);
      setUsers(usersRes?.rows || []);
      setJobs(jobsRes?.rows || []);
      setCompanies(companiesRes?.rows || []);
    } catch (err) {
      console.error('Error loading admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllAdminData();
  }, [loadAllAdminData]);

  const handleToggleUserActive = async (targetUser) => {
    try {
      await api.updateAdminUser(targetUser.id, { isActive: !targetUser.isActive });
      await loadAllAdminData();
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const handleModerateJob = async (jobId, status) => {
    try {
      await api.moderateAdminJob(jobId, status);
      await loadAllAdminData();
    } catch (err) {
      console.error('Failed to moderate job:', err);
    }
  };

  const handleVerifyCompany = async (companyId, verificationStatus) => {
    try {
      await api.verifyAdminCompany(companyId, verificationStatus);
      await loadAllAdminData();
    } catch (err) {
      console.error('Failed to verify company:', err);
    }
  };

  return (
    <DashboardLayout role="admin" activeTab="Dashboard">
      <div className="space-y-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Live platform metrics, user management, company verification, and job moderation.
          </p>
        </div>

        {/* 4 Real Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-gray-950">{stats.totalUsers ?? 0}</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Total Users</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-gray-950">{stats.totalJobs ?? 0}</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Total Jobs</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-gray-950">{stats.totalCandidates ?? 0}</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Candidates</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-gray-950">{stats.totalEmployers ?? 0}</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Employers</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Users & Job Moderation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Users Management */}
          <div id="users" className="lg:col-span-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h2 className="font-bold text-gray-900 text-lg">Registered Users</h2>
              <span className="text-xs text-gray-400">{users.length} loaded</span>
            </div>

            {loading ? (
              <p className="text-sm text-gray-500 py-6 text-center">Loading users...</p>
            ) : users.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">No users found.</p>
            ) : (
              <div className="space-y-3">
                {users.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-3.5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center">
                        {(u.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{u.name}</h4>
                        <p className="text-xs text-gray-500">{u.email} • {u.role}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleUserActive(u)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        u.isActive
                          ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                          : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Suspended'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Job Moderation */}
          <div id="jobs" className="lg:col-span-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h2 className="font-bold text-gray-900 text-lg">Job Moderation</h2>
              <span className="text-xs text-gray-400">{jobs.length} latest</span>
            </div>

            <div className="space-y-3">
              {jobs.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="min-w-0 pr-3">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{item.title}</h4>
                    <p className="text-xs text-gray-500 truncate">
                      {item.company} • <span className="font-semibold">{item.status}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.status !== 'PUBLISHED' && (
                      <button
                        onClick={() => handleModerateJob(item.id, 'PUBLISHED')}
                        className="px-3 py-1 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                      >
                        Publish
                      </button>
                    )}
                    {item.status === 'PUBLISHED' && (
                      <button
                        onClick={() => handleModerateJob(item.id, 'CLOSED')}
                        className="px-3 py-1 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Company Verification & Audit Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div id="companies" className="lg:col-span-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-900 text-lg pb-4 border-b border-gray-100 mb-4">
              Company Verification
            </h2>
            <div className="space-y-3">
              {companies.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100"
                >
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{c.name}</h4>
                    <p className="text-xs text-gray-500">{c.industry || 'Technology'} • {c.verificationStatus}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {c.verificationStatus !== 'VERIFIED' && (
                      <button
                        onClick={() => handleVerifyCompany(c.id, 'VERIFIED')}
                        className="px-3 py-1 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                      >
                        Verify
                      </button>
                    )}
                    {c.verificationStatus !== 'REJECTED' && (
                      <button
                        onClick={() => handleVerifyCompany(c.id, 'REJECTED')}
                        className="px-3 py-1 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="audit" className="lg:col-span-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-900 text-lg pb-4 border-b border-gray-100 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              Recent Admin Audit Logs
            </h2>
            {auditLogs.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">No admin actions recorded yet.</p>
            ) : (
              <div className="space-y-2.5">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                    <div className="flex justify-between font-semibold text-gray-900">
                      <span>{log.action} ({log.resource})</span>
                      <span className="text-gray-400">
                        {log.performedAt ? new Date(log.performedAt).toLocaleString() : ''}
                      </span>
                    </div>
                    <p className="text-gray-500 mt-0.5">Target ID: {log.resourceId || '—'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
