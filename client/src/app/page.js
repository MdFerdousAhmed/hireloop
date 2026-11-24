'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  ArrowRight, 
  Bookmark, 
  Building2, 
  Users, 
  ChevronDown,
  ShieldCheck,
  Zap,
  TrendingUp,
  Lock,
  Mail,
  Send,
  CheckCircle2
} from 'lucide-react';
import CompanyLogo from '../components/CompanyLogo';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('All Locations');
  const [searchCategory, setSearchCategory] = useState('All Categories');
  const [savedJobs, setSavedJobs] = useState(['popular-1', 'popular-3']);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: 'Candidate Inquiry', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('query', searchQuery.trim());
    if (searchLocation !== 'All Locations') params.set('location', searchLocation);
    if (searchCategory !== 'All Categories') params.set('category', searchCategory);
    router.push(`/jobs?${params.toString()}`);
  };

  const toggleSave = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    const strId = String(id);
    setSavedJobs(prev => 
      prev.includes(strId) ? prev.filter(item => item !== strId) : [...prev, strId]
    );
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactForm({ name: '', email: '', subject: 'Candidate Inquiry', message: '' });
    }, 3000);
  };

  // Popular Jobs exactly matching the mockup design
  const defaultPopularJobs = [
    {
      id: 'popular-1',
      title: 'Senior Software Engineer',
      company: 'Google',
      location: 'Remote',
      salary: '$120k – $180k',
      type: 'Full Time',
      brand: 'google',
    },
    {
      id: 'popular-2',
      title: 'Frontend Developer',
      company: 'Microsoft',
      location: 'Dhaka, Bangladesh',
      salary: '$60k – $90k',
      type: 'Full Time',
      brand: 'microsoft',
    },
    {
      id: 'popular-3',
      title: 'Full Stack Developer',
      company: 'Meta',
      location: 'Remote',
      salary: '$100k – $150k',
      type: 'Full Time',
      brand: 'meta',
    },
    {
      id: 'popular-4',
      title: 'Backend Developer',
      company: 'Amazon',
      location: 'Seattle, USA',
      salary: '$90k – $130k',
      type: 'Full Time',
      brand: 'amazon',
    },
  ];

  // Featured Companies
  const featuredCompanies = [
    {
      name: 'Google',
      brand: 'google',
      industry: 'Technology & AI',
      location: 'Mountain View, CA',
      openJobs: 14,
      rating: 4.8,
      description: 'Building world-changing tools from Search to Android and cutting-edge Gemini AI models.',
    },
    {
      name: 'Microsoft',
      brand: 'microsoft',
      industry: 'Cloud & Enterprise',
      location: 'Redmond, WA',
      openJobs: 9,
      rating: 4.7,
      description: 'Empowering every person and organization on the planet to achieve more through Azure and Copilot.',
    },
    {
      name: 'Meta',
      brand: 'meta',
      industry: 'Social Technologies',
      location: 'Menlo Park, CA',
      openJobs: 8,
      rating: 4.6,
      description: 'Connecting billions of users and pioneering the future of social connection and open-source AI.',
    },
    {
      name: 'Amazon',
      brand: 'amazon',
      industry: 'E-commerce & AWS',
      location: 'Seattle, USA',
      openJobs: 12,
      rating: 4.5,
      description: 'Pioneering global e-commerce logistics, cloud compute with AWS, and AI customer experiences.',
    },
    {
      name: 'Apple',
      brand: 'apple',
      industry: 'Consumer Tech',
      location: 'Cupertino, CA',
      openJobs: 7,
      rating: 4.9,
      description: 'Designing intuitive hardware and software that inspire creativity and enrich everyday life.',
    },
    {
      name: 'Uber',
      brand: 'uber',
      industry: 'Mobility & Delivery',
      location: 'San Francisco, CA',
      openJobs: 5,
      rating: 4.4,
      description: 'Igniting opportunity by setting the world in motion across on-demand transport and freight.',
    },
  ];

  // Helper for brand SVG logos in cards
  const renderCompanyLogo = (brand) => {
    const b = (brand || '').toLowerCase();
    if (b.includes('google')) {
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
      );
    }
    if (b.includes('microsoft')) {
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
          <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
          <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
          <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
        </svg>
      );
    }
    if (b.includes('meta')) {
      return (
        <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.92 5C14.88 5 13.06 6.09 12 7.74 10.94 6.09 9.12 5 7.08 5 3.72 5 1 7.77 1 11.18c0 4.19 3.52 7.9 7.82 9.77.72.31 1.54.46 2.37.46.83 0 1.65-.15 2.37-.46C17.86 19.08 21.38 15.37 21.38 11.18 21.38 7.77 18.66 5 15.3 5h1.62zM7.08 17.52c-2.48 0-4.5-2.02-4.5-4.5 0-2.48 2.02-4.5 4.5-4.5 1.54 0 2.92.78 3.75 1.97-.93 1.95-2.22 4.41-3.75 7.03zm9.84 0c-1.53-2.62-2.82-5.08-3.75-7.03.83-1.19 2.21-1.97 3.75-1.97 2.48 0 4.5 2.02 4.5 4.5 0 2.48-2.02 4.5-4.5 4.5z"/>
        </svg>
      );
    }
    if (b.includes('amazon')) {
      return (
        <svg className="w-6 h-6 text-amber-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.9 12.3c-.1-.7-.6-1.1-1.3-1.1-.9 0-1.4.6-1.4 1.7 0 1.1.5 1.7 1.4 1.7.7 0 1.2-.4 1.3-1.1v-1.2zm1.8 3.8h-1.6v-.8c-.4.6-1.1.9-2 .9-1.6 0-2.6-1.1-2.6-2.7 0-1.7 1.1-2.8 2.6-2.8.9 0 1.5.4 1.9.9v-.8h1.7v4.5zm4.8 3.2c-5.2 2.7-11.5 1.4-16.2-1.3-.3-.2-.1-.6.2-.4 4.5 2.5 10.6 3.6 15.6 1.1.5-.3.8.3.4.6zm1.3-.9c-.2-.3-.8-.3-1.3-.2-.5.1-1.2.5-1.1.8.1.3.9.2 1.4.1.5-.1.9-.4 1-.7z"/>
        </svg>
      );
    }
    if (b.includes('apple')) {
      return (
        <svg className="w-6 h-6 text-gray-900 fill-current" viewBox="0 0 170 170">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.77-11.64-14.19-5.78-9.13-10.3-19.46-13.56-30.98-3.26-11.53-4.89-22.6-4.89-33.22 0-14.78 3.81-27.14 11.43-37.07 7.62-9.93 17.3-14.99 29.04-15.19 4.35 0 9.29 1.14 14.82 3.42 5.53 2.28 9.28 3.48 11.25 3.6 1.74 0 5.69-1.28 11.85-3.83 6.16-2.56 11.45-3.74 15.86-3.54 12.94.76 23.38 5.76 31.33 15-11.3 6.85-16.85 16.29-16.63 28.32.22 9.57 3.86 17.65 10.92 24.23 7.07 6.58 15.44 10.27 25.13 11.08-2.61 7.83-5.98 16.09-10.12 24.78zM119.22 33.15c0-7.39 2.66-14.41 7.99-21.05 5.33-6.63 11.96-10.97 19.89-13.01.22 1.09.33 2.07.33 2.93 0 7.39-2.77 14.4-8.32 21.03-5.55 6.63-12.23 10.76-20.04 12.39.11-.76.15-1.52.15-2.29z"/>
        </svg>
      );
    }
    if (b.includes('uber')) {
      return (
        <span className="font-extrabold text-sm text-black tracking-tight">Uber</span>
      );
    }
    return (
      <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
        {(brand || 'C').charAt(0)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fcfdff] text-gray-900 flex flex-col">
      {/* 1. Hero Section & Search Bar */}
      <section className="relative py-16 bg-gradient-to-b from-[#f8faff] via-white to-[#f8faff] overflow-hidden">
        {/* Soft pastel curved decorative background */}
        <div className="absolute top-0 right-0 w-[50%] h-[90%] bg-gradient-to-bl from-indigo-100/50 via-purple-100/30 to-transparent -z-10 rounded-bl-[180px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-[1.12]">
                Find Your <br />
                <span className="text-blue-600">Dream Job</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg">
                Connect with top companies and build your career with HireLoop.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all hover:gap-2.5"
                >
                  <span>Browse Jobs</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/employer/jobs/new"
                  className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-300 shadow-xs transition-colors"
                >
                  For Employers
                </Link>
              </div>
            </div>

            {/* Right Graphic with Hero Image & 3 Floating Badges */}
            <div className="lg:col-span-6 relative flex justify-center items-center">
              <div className="relative w-full max-w-[420px] h-[400px] sm:h-[440px] flex items-center justify-center">
                {/* Backdrop blob */}
                <div className="absolute inset-2 bg-gradient-to-tr from-blue-200/50 via-purple-200/40 to-indigo-100/60 rounded-[44px] transform rotate-1 -z-10"></div>

                {/* Professional businesswoman portrait */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=700&q=85"
                  alt="Career professional"
                  className="w-full h-full object-cover object-top rounded-[40px] shadow-lg"
                />

                {/* Floating Stat Card 1: 10K+ Jobs (Top Right) */}
                <div className="absolute top-4 -right-2 sm:right-0 z-20 bg-white rounded-2xl p-3 shadow-lg border border-gray-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-tight">10K+</p>
                    <p className="text-[11px] text-gray-500 font-medium">Jobs</p>
                  </div>
                </div>

                {/* Floating Stat Card 2: 2K+ Companies (Middle Right) */}
                <div className="absolute top-28 -right-4 sm:-right-2 z-20 bg-white rounded-2xl p-3 shadow-lg border border-gray-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-tight">2K+</p>
                    <p className="text-[11px] text-gray-500 font-medium">Companies</p>
                  </div>
                </div>

                {/* Floating Stat Card 3: 1M+ Candidates (Lower Right) */}
                <div className="absolute top-52 -right-2 sm:right-1 z-20 bg-white rounded-2xl p-3 shadow-lg border border-gray-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-tight">1M+</p>
                    <p className="text-[11px] text-gray-500 font-medium">Candidates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Clean Padded White Search Card */}
          <div className="mt-12 max-w-4xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="bg-white p-2 rounded-xl shadow-md border border-gray-200 flex flex-col md:flex-row items-center gap-2"
            >
              {/* Job title input */}
              <div className="flex-1 flex items-center px-4 py-2 w-full min-w-0">
                <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search jobs by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none min-w-0"
                />
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-8 bg-gray-200 shrink-0"></div>

              {/* Locations dropdown */}
              <div className="w-full md:w-48 flex items-center px-3 py-2 relative shrink-0">
                <select
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
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

              {/* Divider */}
              <div className="hidden md:block w-px h-8 bg-gray-200 shrink-0"></div>

              {/* Categories dropdown */}
              <div className="w-full md:w-48 flex items-center px-3 py-2 relative shrink-0">
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-700 font-medium focus:outline-none cursor-pointer appearance-none pr-6"
                >
                  <option>All Categories</option>
                  <option>Software Engineering</option>
                  <option>UI / UX Design</option>
                  <option>Product Management</option>
                  <option>Data Science & AI</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
              </div>

              {/* Search button with proper padding */}
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm shrink-0 whitespace-nowrap"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. Popular Jobs Section */}
      <section className="py-12 bg-gray-50/70 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Popular Jobs
            </h2>
            <Link
              href="/jobs"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group"
            >
              <span>View all jobs</span>
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>

          {/* Popular Jobs Grid with gap-6 and internal p-6 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {defaultPopularJobs.map((job) => {
              const isSaved = savedJobs.includes(String(job.id));
              return (
                <div
                  key={job.id}
                  onClick={() => router.push('/jobs')}
                  className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Company Logo & Bookmark */}
                    <div className="flex items-center justify-between mb-4">
                      <CompanyLogo company={job.company} size="md" />
                      <button
                        type="button"
                        onClick={(e) => toggleSave(e, job.id)}
                        className={`p-2 rounded-full hover:bg-gray-50 transition-colors ${
                          isSaved ? 'text-blue-600' : 'text-gray-300 hover:text-gray-500'
                        }`}
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    {/* Job Title */}
                    <h3 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors leading-snug line-clamp-1 mb-1">
                      {job.title}
                    </h3>

                    {/* Company Name */}
                    <p className="text-xs text-gray-500 font-medium mb-3">
                      {job.company}
                    </p>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                  </div>

                  {/* Divider line before salary & badge */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <span className="text-sm font-bold text-gray-900">
                      {job.salary}
                    </span>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {job.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Featured Companies Section (#companies) */}
      <section id="companies" className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                Top Employers
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-3">
                Featured Companies
              </h2>
              <p className="text-sm text-gray-500 mt-1 max-w-xl">
                Discover innovative tech companies actively hiring verified engineering, product, and leadership talent.
              </p>
            </div>
            <Link
              href="/companies"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              <span>Explore all 2,000+ companies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCompanies.map((c) => (
              <div
                key={c.name}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <CompanyLogo company={c.name} size="lg" />
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      ★ {c.rating} Rating
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {c.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 mb-3">
                    <span className="font-medium text-gray-700">{c.industry}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400" />{c.location}</span>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed mb-6">
                    {c.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                    {c.openJobs} Open Roles
                  </span>
                  <Link
                    href={`/jobs?query=${encodeURIComponent(c.name)}`}
                    className="text-xs font-semibold text-gray-700 hover:text-blue-600 inline-flex items-center gap-1"
                  >
                    <span>View Jobs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. About HireLoop Section (#about) */}
      <section id="about" className="py-16 bg-gray-50/70 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              About HireLoop
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-3">
              Built for Modern Careers & Fast-Paced Hiring
            </h2>
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">
              HireLoop bridges the gap between ambitious professionals and world-class organizations through transparent opportunities, verified salaries, and direct recruiter pipelines.
            </p>
          </div>

          {/* 4 Value Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">100% Verified Jobs</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Every listing is verified directly with registered employers. No ghost listings, third-party scrapers, or expired roles.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Fast Direct Hiring</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Connect directly with engineering leads and talent acquisition managers. 78% of applicants receive feedback within 48 hours.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Salary Transparency</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Every role displays verified compensation bands, equity options, and benefits upfront to ensure equitable compensation.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Privacy & Control</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Explore open opportunities privately without alerting current employers. Choose who can see your resume and portfolio.
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-extrabold text-blue-600">10,000+</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Active Tech Jobs</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-900">2,500+</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Verified Companies</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-indigo-600">1,000,000+</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Skilled Candidates</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-emerald-600">95%</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Placement Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Contact Section (#contact) */}
      <section id="contact" className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Get in Touch
                </span>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-3">
                  Have Questions? Let&apos;s Connect.
                </h2>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Whether you are a developer looking for your next challenge or an employer looking to scale your engineering team, our team is here to assist.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Candidate & General Support</p>
                    <p className="text-sm font-bold text-gray-900">support@hireloop.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Enterprise & Employer Inquiries</p>
                    <p className="text-sm font-bold text-gray-900">partnerships@hireloop.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Global Headquarters</p>
                    <p className="text-sm font-bold text-gray-900">San Francisco, CA & Remote Global</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-8 border border-gray-200 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Send us a message</h3>
              <p className="text-xs text-gray-500 mb-6">We typically respond to inquiries within 2 hours during business hours.</p>

              {contactSubmitted ? (
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-900">Thank you for reaching out!</h4>
                  <p className="text-xs text-emerald-700">Your message has been sent successfully. A member of our team will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Inquiry Type</label>
                    <select
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors bg-white"
                    >
                      <option>Candidate Inquiry</option>
                      <option>Employer Partnerships</option>
                      <option>Product Feedback</option>
                      <option>Press & Media</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="How can we help you today?"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bottom CTA Banner wrapped in centered container with margin */}
      <section id="cta-banner" className="py-6">
        <div className="max-w-7xl my-12 mx-auto px-6">
          <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600 rounded-2xl p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Ready to take the next step?
              </h3>
              <p className="text-blue-100 text-base">
                Join HireLoop today and get hired faster.
              </p>
            </div>
            <Link
              href="/register"
              className="bg-white text-blue-600 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium text-sm transition-colors shadow-sm shrink-0 whitespace-nowrap"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
