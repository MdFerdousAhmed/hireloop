'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Plus,
  UserCheck,
  Trash2,
} from 'lucide-react';

const STATUS_OPTIONS = [
  'Pending Review',
  'Under Review',
  'Shortlisted',
  'Interview',
  'Offer',
  'Hired',
  'Rejected',
];

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          api.getEmployerJobs().catch(() => []),
          api.getApplications().catch(() => []),
        ]);
        if (!active) return;
        setJobs(jobsRes || []);
        setApplications(appsRes || []);
      } catch (err) {
        console.error('Error loading employer dashboard data:', err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, []);

  const handleApplicationStatusChange = async (appId, newStatus) => {
    setUpdatingStatus(true);
    try {
      await api.updateApplicationStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((a) => (String(a.id) === String(appId) ? { ...a, status: newStatus } : a))
      );
      if (selectedApp && String(selectedApp.id) === String(appId)) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } catch (err) {
      console.error('Failed to update application status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleToggleJobStatus = async (job) => {
    const nextStatus = job.status === 'PUBLISHED' ? 'CLOSED' : 'PUBLISHED';
    try {
      const updated = await api.updateJobStatus(job.id, nextStatus);
      if (updated) {
        setJobs((prev) => prev.map((j) => (String(j.id) === String(job.id) ? updated : j)));
      }
    } catch (err) {
      console.error('Failed to update job status:', err);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await api.deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => String(j.id) !== String(jobId)));
      setApplications((prev) => prev.filter((a) => String(a.jobId) !== String(jobId)));
    } catch (err) {
      console.error('Failed to delete job:', err);
    }
  };

  const activeJobsCount = jobs.filter((j) => j.status === 'PUBLISHED').length;
  const totalApps = applications.length;
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
  const interviewCount = applications.filter((a) => a.status === 'Interview').length;
  const rejectedCount = applications.filter((a) => a.status === 'Rejected').length;
  const otherCount = Math.max(0, totalApps - shortlistedCount - interviewCount - rejectedCount);

  const circumference = 238.76;
  const seg1 = totalApps ? (shortlistedCount / totalApps) * circumference : 0;
  const seg2 = totalApps ? (interviewCount / totalApps) * circumference : 0;
  const seg3 = totalApps ? (rejectedCount / totalApps) * circumference : 0;
  const seg4 = totalApps ? (otherCount / totalApps) * circumference : 0;

  return (
    <DashboardLayout role="employer" activeTab="Dashboard">
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Employer Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {user?.companyName
                ? `Managing hiring pipeline for ${user.companyName}.`
                : "Here's what's happening with your open positions."}
            </p>
          </div>
          <Link
            href="/employer/jobs/new"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#4338ca] hover:bg-[#3730a3] text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Post a New Job</span>
          </Link>
        </div>

        {/* 4 Real Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-gray-950">{jobs.length}</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Total Posted Jobs</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-gray-950">{activeJobsCount}</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Active Jobs</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-gray-950">{totalApps}</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Total Applicants</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-gray-950">{shortlistedCount + interviewCount}</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Shortlisted &amp; Interview</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Applications Overview + Recent Applicants */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Applications Overview</h2>

            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                  {totalApps > 0 && (
                    <>
                      <circle
                        cx="50" cy="50" r="38"
                        stroke="#10b981" strokeWidth="12"
                        strokeDasharray={`${seg1} ${circumference}`} strokeDashoffset="0"
                        fill="transparent"
                      />
                      <circle
                        cx="50" cy="50" r="38"
                        stroke="#3b82f6" strokeWidth="12"
                        strokeDasharray={`${seg2} ${circumference}`} strokeDashoffset={`-${seg1}`}
                        fill="transparent"
                      />
                      <circle
                        cx="50" cy="50" r="38"
                        stroke="#f97316" strokeWidth="12"
                        strokeDasharray={`${seg3} ${circumference}`} strokeDashoffset={`-${seg1 + seg2}`}
                        fill="transparent"
                      />
                      <circle
                        cx="50" cy="50" r="38"
                        stroke="#8b5cf6" strokeWidth="12"
                        strokeDasharray={`${seg4} ${circumference}`} strokeDashoffset={`-${seg1 + seg2 + seg3}`}
                        fill="transparent"
                      />
                    </>
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-gray-900">{totalApps}</span>
                  <span className="text-[11px] text-gray-400 font-semibold uppercase">Total</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-xs text-gray-600 font-medium">Shortlisted</span>
                  <span className="text-xs font-bold text-gray-900 ml-auto pl-4">{shortlistedCount}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="text-xs text-gray-600 font-medium">Interview</span>
                  <span className="text-xs font-bold text-gray-900 ml-auto pl-4">{interviewCount}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                  <span className="text-xs text-gray-600 font-medium">Rejected</span>
                  <span className="text-xs font-bold text-gray-900 ml-auto pl-4">{rejectedCount}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                  <span className="text-xs text-gray-600 font-medium">Other / Pending</span>
                  <span className="text-xs font-bold text-gray-900 ml-auto pl-4">{otherCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real Applicants List */}
          <div id="applicants" className="lg:col-span-7 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h2 className="font-bold text-gray-900 text-lg">Recent Applicants</h2>
              <span className="text-xs text-gray-400 font-medium">{applications.length} total</span>
            </div>

            {loading ? (
              <p className="text-center text-sm text-gray-500 py-8">Loading applicants...</p>
            ) : applications.length === 0 ? (
              <div className="text-center py-10 text-sm text-gray-500">
                No candidates have applied to your posted jobs yet.
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((applicant) => {
                  const initials = (applicant.fullName || 'A')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();
                  return (
                    <div
                      key={applicant.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {initials}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{applicant.fullName}</h4>
                          <p className="text-xs text-gray-500">
                            {applicant.jobTitle} • {applicant.appliedDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
                          {applicant.status}
                        </span>
                        <button
                          onClick={() => setSelectedApp(applicant)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Manage Posted Jobs */}
        <div id="jobs" className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <h2 className="font-bold text-gray-900 text-lg">Your Posted Jobs</h2>
            <Link href="/employer/jobs/new" className="text-xs font-semibold text-blue-600 hover:underline">
              + Post Job
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <p className="text-sm text-gray-500">You haven&apos;t posted any jobs yet.</p>
              <Link
                href="/employer/jobs/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
              >
                <Plus className="w-4 h-4" />
                Create Your First Job Posting
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <Link href={`/jobs/${job.id}`} className="font-bold text-gray-900 text-sm hover:text-blue-600">
                      {job.title}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {job.location} • {job.jobType} • {job.applicantsCount} applicants
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        job.status === 'PUBLISHED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {job.status}
                    </span>
                    <button
                      onClick={() => handleToggleJobStatus(job)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100"
                    >
                      {job.status === 'PUBLISHED' ? 'Close' : 'Reopen'}
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                      title="Delete job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Applicant Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedApp.fullName}</h3>
                <p className="text-xs text-gray-500">Applied for {selectedApp.jobTitle}</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-gray-400 hover:text-gray-600 font-semibold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-gray-700">
              <p><strong>Email:</strong> {selectedApp.email}</p>
              {selectedApp.phone && <p><strong>Phone:</strong> {selectedApp.phone}</p>}
              {selectedApp.portfolio && (
                <p>
                  <strong>Portfolio:</strong>{' '}
                  <a href={selectedApp.portfolio} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                    {selectedApp.portfolio}
                  </a>
                </p>
              )}
              {selectedApp.cvUrl && <p><strong>Resume:</strong> {selectedApp.cvUrl}</p>}
              {selectedApp.coverLetter && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 mt-2">
                  <p className="font-semibold text-gray-900 mb-1">Cover Letter</p>
                  <p className="text-gray-600 whitespace-pre-line">{selectedApp.coverLetter}</p>
                </div>
              )}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Update Application Status
              </label>
              <select
                value={selectedApp.status}
                disabled={updatingStatus}
                onChange={(e) => handleApplicationStatusChange(selectedApp.id, e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
