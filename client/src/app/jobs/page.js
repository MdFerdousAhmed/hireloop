'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Bookmark, 
  ChevronDown
} from 'lucide-react';
import { api } from '../../lib/api';
import CompanyLogo from '../../components/CompanyLogo';

function JobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [location, setLocation] = useState(searchParams.get('location') || 'All Locations');
  const [category, setCategory] = useState(searchParams.get('category') || 'All Categories');
  const [workplaceType, setWorkplaceType] = useState('All');
  const [jobType, setJobType] = useState('All');
  const [savedJobs, setSavedJobs] = useState(['1', '3']);

  useEffect(() => {
    loadJobs();
  }, [query, location, category, workplaceType, jobType]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await api.getJobs({
        query: query.trim(),
        location: location === 'All Locations' ? '' : location,
        category: category === 'All Categories' ? '' : category,
        workplaceType: workplaceType === 'All' ? '' : workplaceType,
        jobType: jobType === 'All' ? '' : jobType,
      });
      setJobs(data || []);
    } catch (err) {
      console.error('Error fetching jobs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async (e, jobId) => {
    e.preventDefault();
    e.stopPropagation();
    const strId = String(jobId);
    setSavedJobs(prev => 
      prev.includes(strId) ? prev.filter(id => id !== strId) : [...prev, strId]
    );
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
    'Sales & BD',
    'Growth & Marketing'
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Explore All Available Jobs
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Discover {jobs.length > 0 ? jobs.length : 50}+ verified tech opportunities across global employers.
          </p>
        </div>

        {/* Clean Padded White Search Card */}
        <div className="max-w-4xl mx-auto w-full">
          <div className="bg-white p-2 rounded-xl shadow-md border border-gray-200 flex flex-col md:flex-row items-center gap-2">
            {/* Title search */}
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

            {/* Location */}
            <div className="w-full md:w-48 flex items-center px-3 py-2 relative shrink-0">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-700 font-medium focus:outline-none cursor-pointer appearance-none pr-6"
              >
                <option>All Locations</option>
                <option>Remote</option>
                <option>Dhaka, Bangladesh</option>
                <option>Seattle, USA</option>
                <option>San Francisco, CA</option>
                <option>New York, NY</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
            </div>

            <div className="hidden md:block w-px h-8 bg-gray-200 shrink-0"></div>

            {/* Category */}
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
              onClick={() => loadJobs()}
              className="w-full md:w-auto px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm shrink-0 whitespace-nowrap"
            >
              Filter
            </button>
          </div>
        </div>

        {/* Quick Filter Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          {['All', 'Remote', 'Full-time', 'Contract', 'Hybrid'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                if (tag === 'All') {
                  setWorkplaceType('All');
                  setJobType('All');
                } else if (tag === 'Remote' || tag === 'Hybrid') {
                  setWorkplaceType(tag);
                } else {
                  setJobType(tag);
                }
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                workplaceType === tag || jobType === tag || (tag === 'All' && workplaceType === 'All' && jobType === 'All')
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Jobs Grid: 3 columns on standard screens, 4 on xl, gap-6 and p-6 padding */}
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
              const salaryText = formatSalary(job.salary_min || job.salaryMin, job.salary_max || job.salaryMax);
              const companyName = job.company_name || job.company || 'TechCorp';
              const locationText = job.location || 'Remote';
              const typeText = job.job_type || job.jobType || 'Full Time';

              return (
                <div
                  key={job.id}
                  onClick={() => router.push(`/jobs/${job.id}`)}
                  className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between cursor-pointer group min-w-0"
                >
                  <div className="min-w-0 flex-1">
                    {/* Top Row: Logo & Bookmark */}
                    <div className="flex items-center justify-between mb-4">
                      <CompanyLogo company={companyName} size="md" />
                      <button
                        type="button"
                        onClick={(e) => handleToggleSave(e, job.id)}
                        className={`p-2 rounded-full hover:bg-gray-50 transition-colors shrink-0 ${
                          isSaved ? 'text-blue-600' : 'text-gray-300 hover:text-gray-500'
                        }`}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    {/* Job Title */}
                    <h3 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors leading-snug line-clamp-1 mb-1 truncate">
                      {job.title}
                    </h3>

                    {/* Company Name */}
                    <p className="text-xs text-gray-500 font-medium mb-3 truncate">
                      {companyName}
                    </p>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-6 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{locationText}</span>
                    </div>
                  </div>

                  {/* Bottom: Salary & Badge */}
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
