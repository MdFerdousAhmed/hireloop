'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { Bookmark, MapPin, Trash2, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import CompanyLogo from '@/components/CompanyLogo';

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadSaved() {
      setLoading(true);
      try {
        const data = await api.getSavedJobs();
        if (active) setSavedJobs(data || []);
      } catch (err) {
        console.error('Failed to load saved jobs:', err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadSaved();
    return () => {
      active = false;
    };
  }, []);

  const handleRemove = async (jobId) => {
    try {
      await api.toggleSaveJob(jobId);
      setSavedJobs((prev) => prev.filter((j) => String(j.id) !== String(jobId)));
    } catch (err) {
      console.error('Failed to remove saved job:', err);
    }
  };

  return (
    <DashboardLayout role="candidate" activeTab="Saved Jobs">
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Saved Jobs
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Positions you bookmarked for later review and application.
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-400">Loading saved jobs...</div>
        ) : savedJobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 max-w-md mx-auto shadow-sm">
            <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No saved jobs yet</h3>
            <p className="text-sm text-gray-500 mt-1">Browse jobs and click the bookmark icon to save them here.</p>
            <Link
              href="/jobs"
              className="mt-4 inline-flex items-center px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <CompanyLogo company={job.company} size="md" />
                    <button
                      onClick={() => handleRemove(job.id)}
                      className="p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base leading-snug mb-1">
                    {job.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mb-3">
                    {job.company}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{job.location}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">
                    {job.jobType || 'Full-time'}
                  </span>
                  <Link
                    href={`/jobs/${job.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    <span>Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
