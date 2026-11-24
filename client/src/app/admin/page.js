'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { 
  Users, 
  Briefcase, 
  ShieldCheck, 
  Building2, 
  Check, 
  X, 
  AlertCircle 
} from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const jobsRes = await api.getJobs();
        if (jobsRes) setJobs(jobsRes);
      } catch (err) {
        console.error('Error loading admin jobs', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const recentRegistrations = [
    {
      id: 'user-1',
      name: 'Rahim Ahmed',
      role: 'Candidate',
      time: '10m ago',
      avatar: 'RA',
      badgeColor: 'bg-blue-50 text-blue-700',
    },
    {
      id: 'user-2',
      name: 'Sara Khan',
      role: 'Employer',
      time: '1h ago',
      avatar: 'SK',
      badgeColor: 'bg-purple-50 text-purple-700',
    },
    {
      id: 'user-3',
      name: 'David Wilson',
      role: 'Candidate',
      time: '3h ago',
      avatar: 'DW',
      badgeColor: 'bg-blue-50 text-blue-700',
    },
  ];

  const moderationQueue = [
    {
      id: 'mod-1',
      title: 'Senior DevOps Architect',
      company: 'TechFlow Systems',
      status: 'Pending Review',
    },
    {
      id: 'mod-2',
      title: 'Product Designer (Design Systems)',
      company: 'Studio Pixel',
      status: 'Pending Review',
    },
  ];

  return (
    <DashboardLayout role="admin" activeTab="Dashboard">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header Greeting */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Platform Overview and system moderation.
          </p>
        </div>

        {/* 4 Stat Cards matching mockup */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Users */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-gray-950">10K</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Total Users</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Total Jobs */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-gray-950">6.2K</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Total Jobs</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Candidates */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-gray-950">3.1K</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Candidates</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Employers */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-gray-950">1.1K</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">Employers</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 2-Column Split: Recent Registrations & Job Moderation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Recent Registrations (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h2 className="font-bold text-gray-900 text-lg">Recent Registrations</h2>
              <span className="text-xs font-semibold text-blue-600 cursor-pointer hover:underline">
                View all →
              </span>
            </div>

            <div className="space-y-3">
              {recentRegistrations.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-3.5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-50"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 font-bold text-xs flex items-center justify-center shadow-xs">
                      {u.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{u.name}</h4>
                      <p className="text-xs text-gray-400">{u.time}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.badgeColor}`}>
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Job Moderation (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <h2 className="font-bold text-gray-900 text-lg">Job Moderation</h2>
              <span className="text-xs font-semibold text-blue-600 cursor-pointer hover:underline">
                View all →
              </span>
            </div>

            <div className="space-y-3">
              {moderationQueue.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3.5 rounded-xl hover:bg-gray-50 transition-colors border border-gray-50"
                >
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-500">{item.company}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors">
                      Approve
                    </button>
                    <button className="px-3 py-1 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
