'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Clock, 
  Building, 
  ArrowLeft, 
  Bookmark, 
  CheckCircle2, 
  Upload, 
  Send, 
  Share2, 
  Sparkles,
  ShieldCheck,
  Check,
  Users
} from 'lucide-react';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import CompanyLogo from '../../../components/CompanyLogo';

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  // Application form state
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [coverLetter, setCoverLetter] = useState('');
  const [portfolio, setPortfolio] = useState('https://github.com/developer');
  const [fileName, setFileName] = useState('Alex_Morgan_Resume_2026.pdf');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (id) {
      loadJob(id);
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const loadJob = async (jobId) => {
    setLoading(true);
    const data = await api.getJobById(jobId);
    setJob(data);
    const saved = await api.getSavedJobs();
    setIsSaved(saved.some(j => j.id === jobId));
    setLoading(false);
  };

  const handleToggleSave = async () => {
    if (!job) return;
    const nextSaved = await api.toggleSaveJob(job.id);
    setIsSaved(nextSaved);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await api.applyToJob(job.id, {
      fullName,
      email,
      phone,
      coverLetter,
      portfolio,
      cvUrl: fileName,
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm text-gray-500 mt-4">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Job Not Found</h2>
        <p className="text-sm text-gray-500 mt-2">The position you are looking for may have expired or been removed.</p>
        <Link 
          href="/jobs"
          className="mt-6 inline-flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/jobs"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to all open positions</span>
        </Link>

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start space-x-5">
              <CompanyLogo company={job.company} size="xl" />
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    {job.title}
                  </h1>
                  {job.featured && (
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center">
                      <Sparkles className="w-3.5 h-3.5 mr-1" /> Featured
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-5 text-sm text-gray-500">
                  <span className="font-semibold text-gray-800 flex items-center">
                    <Building className="w-4 h-4 mr-1 text-gray-400" />
                    {job.company}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                    {job.location} ({job.workplaceType})
                  </span>
                  <span className="flex items-center text-emerald-600 font-semibold">
                    <DollarSign className="w-4 h-4 mr-0.5" />
                    ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k / year
                  </span>
                  <span className="flex items-center text-gray-400">
                    <Clock className="w-4 h-4 mr-1" />
                    Posted {job.postedAt}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">
                    {job.category}
                  </span>
                  <span className="text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-lg">
                    {job.jobType}
                  </span>
                  <span className="text-xs font-medium bg-purple-50 text-purple-700 px-3 py-1 rounded-lg">
                    {job.experienceLevel} Level
                  </span>
                  <span className="text-xs font-medium bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {job.applicantsCount || 0} applicants
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
              <button
                onClick={handleToggleSave}
                className={`p-3 rounded-2xl border transition flex items-center justify-center ${
                  isSaved 
                    ? 'bg-blue-50 border-blue-200 text-blue-600' 
                    : 'border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                }`}
                title={isSaved ? "Saved" : "Save this job"}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-blue-600' : ''}`} />
              </button>

              <button
                onClick={() => setApplyModalOpen(true)}
                className="flex-1 md:flex-initial bg-[#4338ca] hover:bg-[#3730a3] text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-lg shadow-indigo-600/25 transition flex items-center justify-center space-x-2"
              >
                <span>Apply for this Position</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Description Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-gray-900">About the Role</h2>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Requirements & Qualifications</h2>
              <ul className="space-y-3">
                {job.requirements?.map((req, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits & Perks */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Benefits & Perks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {job.benefits?.map((benefit, index) => (
                  <div key={index} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center space-x-3 text-sm text-gray-800">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Job Overview */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900 text-base">Job Summary</h3>
              <div className="divide-y divide-gray-100 text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-gray-500">Employment Type</span>
                  <span className="font-semibold text-gray-800">{job.jobType}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-gray-500">Location</span>
                  <span className="font-semibold text-gray-800">{job.location}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-gray-500">Workplace</span>
                  <span className="font-semibold text-gray-800">{job.workplaceType}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-gray-500">Experience</span>
                  <span className="font-semibold text-gray-800">{job.experienceLevel}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-gray-500">Annual Salary</span>
                  <span className="font-semibold text-emerald-600">
                    ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                  </span>
                </div>
              </div>

              <button
                onClick={() => setApplyModalOpen(true)}
                className="w-full bg-[#4338ca] hover:bg-[#3730a3] text-white font-semibold text-xs py-3 rounded-full transition shadow-sm"
              >
                Apply Now
              </button>
            </div>

            {/* Company Info Card */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl">
                  {job.companyLogo}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{job.company}</h4>
                  <p className="text-xs text-gray-500">Verified Employer</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {job.company} is an industry pioneer dedicated to engineering resilient, scalable solutions with an inclusive, high-performance culture.
              </p>
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 mr-1" /> Verified by HireLoop
                </span>
                <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                  View Company
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-gray-100 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95">
            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Application Submitted!</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been received. You can track its progress in your Candidate Dashboard.
                </p>
                <div className="pt-4 flex space-x-3 justify-center">
                  <button
                    onClick={() => {
                      setApplyModalOpen(false);
                      setSubmitted(false);
                    }}
                    className="px-4 py-2 text-xs font-semibold border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => router.push('/candidate/dashboard')}
                    className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Apply to {job.company}</h3>
                    <p className="text-xs text-gray-500">{job.title}</p>
                  </div>
                  <button
                    onClick={() => setApplyModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 text-sm font-semibold p-1"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleApplySubmit} className="space-y-4 mt-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Portfolio / LinkedIn URL</label>
                    <input
                      type="url"
                      value={portfolio}
                      onChange={(e) => setPortfolio(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* CV Upload */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Resume / CV (PDF or DOCX)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-4 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                      <Upload className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs font-semibold text-gray-700">{fileName}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Click or drag & drop to replace (Max 10MB)</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Cover Letter / Note to Hiring Manager (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Highlight why you are an ideal fit for this role..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:outline-none"
                    ></textarea>
                  </div>

                  <div className="pt-2 flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setApplyModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-md transition flex items-center space-x-1.5"
                    >
                      {submitting ? (
                        <span>Submitting...</span>
                      ) : (
                        <>
                          <span>Submit Application</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
