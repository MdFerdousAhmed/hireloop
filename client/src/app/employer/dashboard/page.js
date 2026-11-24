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
  TrendingUp, 
  Plus, 
  UserCheck 
} from 'lucide-react';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          api.getJobs(),
          api.getApplications()
        ]);
        if (jobsRes) setJobs(jobsRes);
        if (appsRes) setApplications(appsRes);
      } catch (err) {
        console.error('Error loading employer dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const defaultApplicants = [
    {
      id: 'app-1',
      name: 'Ahmed Ridwan',
      role: 'Frontend Developer',
      time: '1 hour ago',
      avatar: 'AR',
      avatarBg: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'app-2',
      name: 'Nusrat Jahan',
      role: 'Full Stack Developer',
      time: '3 hours ago',
      avatar: 'NJ',
      avatarBg: 'bg-purple-100 text-purple-700',
    },
    {
      id: 'app-3',
      name: 'Shakib Al Hasan',
      role: 'Backend Developer',
      time: '1 day ago',
      avatar: 'SH',
      avatarBg: 'bg-emerald-100 text-emerald-700',
    },
  ];

  return (
    <DashboardLayout role="employer" activeTab="Dashboard">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Employer Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Here&apos;s what&apos;s happening with your jobs.
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

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Jobs */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-gray-950">{jobs.length > 0 ? jobs.length : '5'}</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Total Jobs</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Active Jobs */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-gray-950">3</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Active Jobs</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Total Applicants */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-gray-950">24</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Total Applicants</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Shortlisted */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-gray-950">12</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Shortlisted</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 2-Column Split: Applications Overview & Recent Applicants */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Applications Overview (Donut Chart) */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Applications Overview</h2>

            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
              {/* Donut graphic */}
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Segment 1: Shortlisted 12 (46%) */}
                  <circle
                    cx="50" cy="50" r="38"
                    stroke="#10b981" strokeWidth="12"
                    strokeDasharray="110 238" strokeDashoffset="0"
                    fill="transparent"
                  />
                  {/* Segment 2: Interview 8 (31%) */}
                  <circle
                    cx="50" cy="50" r="38"
                    stroke="#3b82f6" strokeWidth="12"
                    strokeDasharray="74 238" strokeDashoffset="-110"
                    fill="transparent"
                  />
                  {/* Segment 3: Rejected 4 (15%) */}
                  <circle
                    cx="50" cy="50" r="38"
                    stroke="#f97316" strokeWidth="12"
                    strokeDasharray="36 238" strokeDashoffset="-184"
                    fill="transparent"
                  />
                  {/* Segment 4: Others 2 (8%) */}
                  <circle
                    cx="50" cy="50" r="38"
                    stroke="#8b5cf6" strokeWidth="12"
                    strokeDasharray="18 238" strokeDashoffset="-220"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-gray-900">26</span>
                  <span className="text-[11px] text-gray-400 font-semibold uppercase">Total</span>
                </div>
              </div>

              {/* Legend matching mockup */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-xs text-gray-600 font-medium">Shortlisted</span>
                  <span className="text-xs font-bold text-gray-900 ml-auto pl-4">12</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="text-xs text-gray-600 font-medium">Interview</span>
                  <span className="text-xs font-bold text-gray-900 ml-auto pl-4">8</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                  <span className="text-xs text-gray-600 font-medium">Rejected</span>
                  <span className="text-xs font-bold text-gray-900 ml-auto pl-4">4</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                  <span className="text-xs text-gray-600 font-medium">Others</span>
                  <span className="text-xs font-bold text-gray-900 ml-auto pl-4">2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Applicants */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h2 className="font-bold text-gray-900 text-lg">Recent Applicants</h2>
              <Link href="/employer/dashboard#applicants" className="text-xs font-semibold text-blue-600 hover:underline">
                View all →
              </Link>
            </div>

            <div className="space-y-3">
              {defaultApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="flex items-center justify-between p-3.5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-50"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-full ${applicant.avatarBg} font-bold text-xs flex items-center justify-center shadow-xs`}>
                      {applicant.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{applicant.name}</h4>
                      <p className="text-xs text-gray-500">{applicant.role} • {applicant.time}</p>
                    </div>
                  </div>

                  <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
                    Review
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
