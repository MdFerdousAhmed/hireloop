'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  Briefcase,
  Bookmark,
  CheckCircle2,
  Award,
  ArrowUpRight,
} from 'lucide-react';
import CompanyLogo from '@/components/CompanyLogo';

const STATUS_BADGES = {
  'Pending Review': 'bg-amber-50 text-amber-700 border-amber-200',
  'Under Review': 'bg-blue-50 text-blue-700 border-blue-200',
  Shortlisted: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Interview: 'bg-purple-50 text-purple-700 border-purple-200',
  Offer: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Hired: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function fetchDashboardData() {
      try {
        const [appsRes, savedRes] = await Promise.all([
          api.getCandidateApplications().catch(() => []),
          api.getSavedJobs().catch(() => []),
        ]);
        if (!active) return;
        setApplications(appsRes || []);
        setSavedJobsCount((savedRes || []).length);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchDashboardData();
    return () => {
      active = false;
    };
  }, []);

  const shortlistedCount = applications.filter((a) =>
    ['Shortlisted', 'Interview', 'Offer', 'Hired'].includes(a.status)
  ).length;
  const hiredCount = applications.filter((a) => ['Hired', 'Offer'].includes(a.status)).length;

  // Dynamic real profile completion percentage
  const profileChecks = [
    Boolean(user?.name),
    Boolean(user?.headline),
    Boolean(user?.location),
    Boolean(user?.bio),
    Array.isArray(user?.skills) && user.skills.length > 0,
    Boolean(user?.portfolio || user?.resumeName),
  ];
  const completionPct = Math.round(
    (profileChecks.filter(Boolean).length / profileChecks.length) * 100
  );
  const circumference = 251.2;
  const dashOffset = circumference - (circumference * completionPct) / 100;

  return (
    <DashboardLayout role="candidate" activeTab="Dashboard">
      <div className="space-y-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Candidate Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, <span className="font-semibold text-gray-800">{user?.name || 'Candidate'}</span>!
          </p>
        </div>

        {/* 4 Real Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-gray-950">{applications.length}</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Applications</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-gray-950">{savedJobsCount}</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Saved Jobs</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Bookmark className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-gray-950">{shortlistedCount}</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Shortlisted / Active</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-gray-950">{hiredCount}</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Offers / Hired</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Recent Applications */}
          <div id="applications" className="lg:col-span-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h2 className="font-bold text-gray-900 text-lg">Your Applications</h2>
              <Link href="/jobs" className="text-xs font-semibold text-blue-600 hover:underline">
                Browse more jobs →
              </Link>
            </div>

            <div className="space-y-3">
              {loading ? (
                <p className="text-center text-sm text-gray-500 py-8">Loading applications...</p>
              ) : applications.length > 0 ? (
                applications.map((a) => (
                  <div
                    key={a.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    <div className="flex items-center gap-3.5">
                      <CompanyLogo company={a.company} size="sm" />
                      <div>
                        <Link
                          href={`/jobs/${a.jobId}`}
                          className="font-bold text-gray-900 text-sm hover:text-blue-600 inline-flex items-center gap-1"
                        >
                          <span>{a.jobTitle}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                        <p className="text-xs text-gray-500">
                          {a.company} • {a.location} • Applied {a.appliedDate}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-center ${
                        STATUS_BADGES[a.status] || 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 space-y-3">
                  <p className="text-sm text-gray-500">You haven&apos;t applied to any jobs yet.</p>
                  <Link
                    href="/jobs"
                    className="inline-flex items-center px-5 py-2 rounded-full text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Find Your First Opportunity
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Real Profile Completion Donut Chart */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <h2 className="font-bold text-gray-900 text-lg mb-6 self-start">Profile Completion</h2>

            <div className="relative w-36 h-36 flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="10" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#3b82f6"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="absolute text-2xl font-bold text-gray-900">{completionPct}%</span>
            </div>

            <p className="text-sm text-gray-600 mt-2 mb-4">
              {completionPct === 100
                ? 'Your candidate profile is complete!'
                : 'Add your headline, location, skills, and portfolio to stand out.'}
            </p>
            <Link
              href="/candidate/profile"
              className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors"
            >
              Update My Profile
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
