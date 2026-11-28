'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, MapPin, Briefcase, Bookmark, ChevronDown } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import CompanyLogo from '../../components/CompanyLogo';

function JobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [companyFilter, setCompanyFilter] = useState(searchParams.get('company') || '');
  const [location, setLocation] = useState(searchParams.get('location') || 'All Locations');
  const [category, setCategory] = useState(searchParams.get('category') || 'All Categories');
  const [workplaceType, setWorkplaceType] = useState('All');
  const [jobType, setJobType] = useState('All');
  const [savedJobs, setSavedJobs] = useState([]);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getJobs({
        query: query.trim() || undefined,
        company: companyFilter || undefined,
        location: location === 'All Locations' ? undefined : location,
        category: category === 'All Categories' ? undefined : category,
        workplaceType: workplaceType === 'All' ? undefined : workplaceType,
        jobType: jobType === 'All' ? undefined : jobType,
      });
      setJobs(data || []);
    } catch (err) {
      console.error('Error fetching jobs', err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [query, companyFilter, location, category, workplaceType, jobType]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  useEffect(() => {
    let active = true;
    async function loadSavedIds() {
      if (!user) {
        if (active) setSavedJobs([]);
        return;
      }
      try {
        const saved = await api.getSavedJobs();
        if (active) setSavedJobs((saved || []).map((j) => String(j.id)));
      } catch {
        // Ignore if not available
      }
    }
    loadSavedIds();
    return () => {
      active = false;
    };
  }, [user]);

  const handleToggleSave = async (e, jobId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push('/login');
      return;
    }
    const strId = String(jobId);
    try {
      const saved = await api.toggleSaveJob(strId);
      setSavedJobs((prev) =>
        saved ? [...new Set([...prev, strId])] : prev.filter((id) => id !== strId)
      );
    } catch (err) {
      console.error('Failed to toggle saved job', err);
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Competitive';
    if (min && max) return `$${Math.round(min / 1000)}k – $${Math.round(max / 1000)}k`;
    if (min) return `From $${Math.round(min / 1000)}k`;
    return `Up to $${Math.round(max / 1000)}k`;
  };

  const categories = [
    'All Categories',
    'Software Engineering',
    'UI / UX Design',
    'Product Management',
    'Data Science & AI',
    'DevOps & Cloud',
    'Cyber Security',
    'Sales & BD',
    'Growth & Marketing',
    'Customer Success',
  ];

  const locations = [
    'All Locations',
    'Remote',
    'San Francisco, CA',
    'New York, NY',
    'Austin, TX',
    'Seattle, WA',
    'Boston, MA',
    'Chicago, IL',
    'Denver, CO',
    'San Diego, CA',
    'London, UK',
    'Toronto, Canada',
    'Dhaka, Bangladesh',
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {companyFilter ? `Open Roles at ${companyFilter}` : 'Explore All Available Jobs'}
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Showing {jobs.length} live job {jobs.length === 1 ? 'opening' : 'openings'} directly from the database.
          </p>
        </div>

        <div className="max-w-4xl mx-auto w-full">
          <div className="bg-white p-2 rounded-xl shadow-md border border-gray-200 flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 flex items-center px-4 py-2 w-full min-w-0">
              <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Search by title, role or keywords..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none min-w-0"
              />
            </div>

            <div className="hidden md:block w-px h-8 bg-gray-200 shrink-0"></div>

            <div className="w-full md:w-48 flex items-center px-3 py-2 relative shrink-0">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-700 font-medium focus:outline-none cursor-pointer appearance-none pr-6"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
            </div>

            <div className="hidden md:block w-px h-8 bg-gray-200 shrink-0"></div>

            <div className="w-full md:w-48 flex items-center px-3 py-2 relative shrink-0">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-700 font-medium focus:outline-none cursor-pointer appearance-none pr-6"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
            </div>

            <button
              onClick={loadJobs}
              className="w-full md:w-auto px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm shrink-0 whitespace-nowrap"
            >
              Filter
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          {['All', 'Remote', 'Full-time', 'Contract', 'Hybrid'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                if (tag === 'All') {
                  setWorkplaceType('All');
                  setJobType('All');
                  setCompanyFilter('');
                } else if (tag === 'Remote' || tag === 'Hybrid') {
                  setWorkplaceType(tag);
                } else {
                  setJobType(tag);
                }
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                workplaceType === tag || jobType === tag || (tag === 'All' && workplaceType === 'All' && jobType === 'All' && !companyFilter)
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tag}
            </button>
          ))}
          {companyFilter && (
            <button
              onClick={() => setCompanyFilter('')}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
            >
              Company: {companyFilter} ✕
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-gray-500 font-medium">Loading opportunities...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 max-w-md mx-auto shadow-sm">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No jobs match your criteria</h3>
            <p className="text-sm text-gray-500 mt-1">Try resetting the filters or searching for different keywords.</p>
            <button
              onClick={() => {
                setQuery('');
                setCompanyFilter('');
                setLocation('All Locations');
                setCategory('All Categories');
                setWorkplaceType('All');
                setJobType('All');
              }}
              className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {jobs.map((job) => {
              const isSaved = savedJobs.includes(String(job.id));
              const salaryText = formatSalary(job.salaryMin, job.salaryMax);
              const companyName = job.company || 'Employer';
              const locationText = job.location || 'Remote';
              const typeText = job.jobType || 'Full-time';

              return (
                <div
                  key={job.id}
                  onClick={() => router.push(`/jobs/${job.id}`)}
                  className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between cursor-pointer group min-w-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <CompanyLogo company={companyName} size="md" />
                      <button
                        type="button"
                        onClick={(e) => handleToggleSave(e, job.id)}
                        className={`p-2 rounded-full hover:bg-gray-50 transition-colors shrink-0 ${
                          isSaved ? 'text-blue-600' : 'text-gray-300 hover:text-gray-500'
                        }`}
                        title={user ? (isSaved ? 'Remove bookmark' : 'Save job') : 'Sign in to save jobs'}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    <h3 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors leading-snug line-clamp-1 mb-1 truncate">
                      {job.title}
                    </h3>

                    <p className="text-xs text-gray-500 font-medium mb-3 truncate">
                      {companyName}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{locationText}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <span className="text-sm font-bold text-gray-900 truncate mr-2">
                      {salaryText}
                    </span>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full shrink-0">
                      {typeText}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading jobs...</div>}>
      <JobsContent />
    </Suspense>
  );
}
