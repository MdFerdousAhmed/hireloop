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
  ExternalLink,
} from 'lucide-react';
import CompanyLogo from '@/components/CompanyLogo';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApps() {
      try {
        const res = await api.getCandidateApplications();
        if (res && res.length > 0) {
          setApplications(res);
        }
      } catch (err) {
        console.error('Failed to fetch applications', err);
      } finally {
        setLoading(false);
      }
    }
    fetchApps();
  }, []);

  const defaultRecentApps = [];

  return (
    <DashboardLayout role="candidate" activeTab="Dashboard">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header Greeting */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Candidate Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back, <span className="font-semibold text-gray-800">{user?.name || 'Sarah'}</span>!
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Applications */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-gray-950">12</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Applications</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Saved Jobs */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-gray-950">8</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Saved Jobs</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Bookmark className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Shortlisted */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-gray-950">3</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Shortlisted</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Hired */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-gray-950">1</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Hired</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Recent Applications (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h2 className="font-bold text-gray-900 text-lg">Recent Applications</h2>
              <Link href="/jobs" className="text-xs font-semibold text-blue-600 hover:underline">
                View all →
              </Link>
            </div>

            <div className="space-y-3">
              {defaultRecentApps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-3.5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-50"
                >
                  <div className="flex items-center gap-3.5">
                    <CompanyLogo company={app.company} size="sm" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{app.role}</h4>
                      <p className="text-xs text-gray-500">{app.company} • {app.time}</p>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${app.badgeColor}`}>
                    {app.status}
                  </span>
                </div>
              ))}

              {/* Show loaded applications from DB if any */}
              {loading ? (
                <p className="text-center text-gray-500">Loading applications…</p>
              ) : applications.length > 0 ? (
                applications.slice(0, 3).map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between p-3.5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-50"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm flex items-center justify-center">
                        💼
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{a.job_title || 'Software Role'}</h4>
                        <p className="text-xs text-gray-500">Applicant: {a.full_name || 'You'}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {a.status || 'Applied'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No applications found.</p>
              )}
            </div>
          </div>

          {/* Profile Completion Donut Chart (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col items-center text-center">
            <h2 className="font-bold text-gray-900 text-lg mb-6 self-start">Profile Completion</h2>

            {/* SVG Donut Chart 85% */}
            <div className="relative w-36 h-36 flex items-center justify-center my-2">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="10" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#3b82f6"
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  strokeDashoffset="37.68"
                  strokeLinecap="round"
                  fill="none"
                />
                <text x="50%" y="55%" textAnchor="middle" fill="#111827" fontSize="22" fontWeight="bold">85%</text>
              </svg>
            </div>
            <p className="text-sm text-gray-600 mt-2">Complete your profile to attract more employers.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
