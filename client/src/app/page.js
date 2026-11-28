'use client';

import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
} from 'lucide-react';
import CompanyLogo from '../components/CompanyLogo';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('All Locations');
  const [searchCategory, setSearchCategory] = useState('All Categories');
  const [popularJobs, setPopularJobs] = useState([]);
  const [featuredCompanies, setFeaturedCompanies] = useState([]);
  const [stats, setStats] = useState({
    active_jobs: 0,
    total_companies: 0,
    total_candidates: 0,
    total_applications: 0,
  });
  const [savedJobs, setSavedJobs] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: 'Candidate Inquiry', message: '' });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactError, setContactError] = useState('');

  useEffect(() => {
    let active = true;
    async function loadHomeData() {
      try {
        const [jobsRes, companiesRes, statsRes] = await Promise.all([
          api.getJobs({ limit: 4 }).catch(() => []),
          api.getCompanies({ limit: 6 }).catch(() => []),
          api.getPublicStats().catch(() => ({})),
        ]);
        if (!active) return;
        setPopularJobs(jobsRes || []);
        setFeaturedCompanies(companiesRes || []);
        if (statsRes) setStats(statsRes);
      } finally {
        if (active) setLoadingData(false);
      }
    }
    loadHomeData();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    async function loadSaved() {
      if (!user) {
        if (active) setSavedJobs([]);
        return;
      }
      try {
        const saved = await api.getSavedJobs();
        if (active) setSavedJobs((saved || []).map((j) => String(j.id)));
      } catch {
        // Ignore
      }
    }
    loadSaved();
    return () => {
      active = false;
    };
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('query', searchQuery.trim());
    if (searchLocation !== 'All Locations') params.set('location', searchLocation);
    if (searchCategory !== 'All Categories') params.set('category', searchCategory);
    router.push(`/jobs?${params.toString()}`);
  };

  const toggleSave = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push('/login');
      return;
    }
    const strId = String(id);
    try {
      const saved = await api.toggleSaveJob(strId);
      setSavedJobs((prev) =>
        saved ? [...new Set([...prev, strId])] : prev.filter((item) => item !== strId)
      );
    } catch (err) {
      console.error('Failed to save job:', err);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactError('');
    setContactSubmitting(true);
    try {
      await api.submitContact(contactForm);
      setContactSubmitted(true);
      setContactForm({ name: '', email: '', subject: 'Candidate Inquiry', message: '' });
    } catch (err) {
      setContactError(err?.response?.data?.message || 'Unable to send message right now.');
    } finally {
      setContactSubmitting(false);
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Competitive';
    return `$${Math.round(min / 1000)}k – $${Math.round(max / 1000)}k`;
  };

  return (
    <div className="min-h-screen bg-[#fcfdff] text-gray-900 flex flex-col">
      {/* 1. Hero Section & Search Bar */}
      <section className="relative py-16 bg-gradient-to-b from-[#f8faff] via-white to-[#f8faff] overflow-hidden">
        <div className="absolute top-0 right-0 w-[50%] h-[90%] bg-gradient-to-bl from-indigo-100/50 via-purple-100/30 to-transparent -z-10 rounded-bl-[180px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-[1.12]">
                Find Your <br />
                <span className="text-blue-600">Dream Job</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg">
                Connect with verified companies and apply directly to real open positions with HireLoop.
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
                  href={user?.role === 'EMPLOYER' ? '/employer/jobs/new' : '/register'}
                  className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-300 shadow-xs transition-colors"
                >
                  For Employers
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative flex justify-center items-center">
              <div className="relative w-full max-w-[420px] h-[400px] sm:h-[440px] flex items-center justify-center">
                <div className="absolute inset-2 bg-gradient-to-tr from-blue-200/50 via-purple-200/40 to-indigo-100/60 rounded-[44px] transform rotate-1 -z-10"></div>

                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=700&q=85"
                  alt="Career professional"
                  className="w-full h-full object-cover object-top rounded-[40px] shadow-lg"
                />

                <div className="absolute top-4 -right-2 sm:right-0 z-20 bg-white rounded-2xl p-3 shadow-lg border border-gray-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-tight">{stats.active_jobs || 0}</p>
                    <p className="text-[11px] text-gray-500 font-medium">Open Jobs</p>
                  </div>
                </div>

                <div className="absolute top-28 -right-4 sm:-right-2 z-20 bg-white rounded-2xl p-3 shadow-lg border border-gray-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-tight">{stats.total_companies || 0}</p>
                    <p className="text-[11px] text-gray-500 font-medium">Companies</p>
                  </div>
                </div>

                <div className="absolute top-52 -right-2 sm:right-1 z-20 bg-white rounded-2xl p-3 shadow-lg border border-gray-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-tight">{stats.total_candidates || 0}</p>
                    <p className="text-[11px] text-gray-500 font-medium">Candidates</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 max-w-4xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="bg-white p-2 rounded-xl shadow-md border border-gray-200 flex flex-col md:flex-row items-center gap-2"
            >
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

              <div className="hidden md:block w-px h-8 bg-gray-200 shrink-0"></div>

              <div className="w-full md:w-48 flex items-center px-3 py-2 relative shrink-0">
                <select
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-700 font-medium focus:outline-none cursor-pointer appearance-none pr-6"
                >
                  <option>All Locations</option>
                  <option>Remote</option>
                  <option>San Francisco, CA</option>
                  <option>New York, NY</option>
                  <option>Austin, TX</option>
                  <option>Seattle, WA</option>
                  <option>London, UK</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
              </div>

              <div className="hidden md:block w-px h-8 bg-gray-200 shrink-0"></div>

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
                  <option>Data Science &amp; AI</option>
                  <option>DevOps &amp; Cloud</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
              </div>

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
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Featured &amp; Latest Jobs
            </h2>
            <Link
              href="/jobs"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 group"
            >
              <span>View all jobs</span>
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>

          {loadingData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-6 border border-gray-200 h-52 animate-pulse" />
              ))}
            </div>
          ) : popularJobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 text-sm text-gray-500">
              No published jobs found yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularJobs.map((job) => {
                const isSaved = savedJobs.includes(String(job.id));
                return (
                  <div
                    key={job.id}
                    onClick={() => router.push(`/jobs/${job.id}`)}
                    className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
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

                      <h3 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors leading-snug line-clamp-1 mb-1">
                        {job.title}
                      </h3>

                      <p className="text-xs text-gray-500 font-medium mb-3">
                        {job.company}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                      <span className="text-sm font-bold text-gray-900">
                        {formatSalary(job.salaryMin, job.salaryMax)}
                      </span>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {job.jobType}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 3. Featured Companies Section */}
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
                Discover verified organizations actively hiring engineering, product, and design talent.
              </p>
            </div>
            <Link
              href="/companies"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              <span>Explore all companies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCompanies.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <CompanyLogo company={c.name} size="lg" />
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {c.verificationStatus === 'VERIFIED' ? 'Verified' : 'Active'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {c.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 mb-3">
                    <span className="font-medium text-gray-700">{c.industry || 'Technology'}</span>
                    {c.location && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400" />{c.location}</span>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed mb-6">
                    {c.description || `Open technical and leadership opportunities at ${c.name}.`}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                    {c.openJobs} Open Roles
                  </span>
                  <Link
                    href={`/jobs?company=${encodeURIComponent(c.name)}`}
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

      {/* 4. About HireLoop Section */}
      <section id="about" className="py-16 bg-gray-50/70 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              About HireLoop
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-3">
              Built for Modern Careers &amp; Fast-Paced Hiring
            </h2>
            <p className="text-sm text-gray-500 mt-3 leading-relaxed">
              HireLoop connects ambitious professionals and organizations through transparent roles, clear salary ranges, and direct hiring pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Verified Listings</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Every position is backed directly by registered employers on our database.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Fast Direct Hiring</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Real-time application tracking from submission through interview and offer.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Salary Transparency</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Compensation ranges and role requirements displayed clearly before you apply.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Secure Accounts</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                RSA-signed JWT authentication with role-based candidate, employer, and admin workspaces.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-extrabold text-blue-600">{stats.active_jobs || 0}</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Active Tech Jobs</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-gray-900">{stats.total_companies || 0}</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Companies</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-indigo-600">{stats.total_candidates || 0}</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Registered Candidates</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-emerald-600">{stats.total_applications || 0}</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Submitted Applications</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Contact Section */}
      <section id="contact" className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Get in Touch
                </span>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-3">
                  Have Questions? Let&apos;s Connect.
                </h2>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Whether you are a developer looking for your next challenge or an employer looking to scale your team, our team is here to assist.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Candidate &amp; General Support</p>
                    <p className="text-sm font-bold text-gray-900">support@hireloop.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Enterprise &amp; Employer Inquiries</p>
                    <p className="text-sm font-bold text-gray-900">partnerships@hireloop.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Global Headquarters</p>
                    <p className="text-sm font-bold text-gray-900">San Francisco, CA &amp; Remote Global</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white rounded-2xl p-8 border border-gray-200 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Send us a message</h3>
              <p className="text-xs text-gray-500 mb-6">Your inquiry is saved directly for our support team.</p>

              {contactError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {contactError}
                </div>
              )}

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
                      <option>Press &amp; Media</option>
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
                    disabled={contactSubmitting}
                    className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <span>{contactSubmitting ? 'Sending...' : 'Send Message'}</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bottom CTA Banner */}
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
              href={user ? '/jobs' : '/register'}
              className="bg-white text-blue-600 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium text-sm transition-colors shadow-sm shrink-0 whitespace-nowrap"
            >
              {user ? 'Explore Jobs' : 'Create Account'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
