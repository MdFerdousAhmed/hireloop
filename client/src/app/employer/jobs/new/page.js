'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Briefcase, Send, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function PostJobPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Software Engineering');
  const [jobType, setJobType] = useState('Full-time');
  const [workplaceType, setWorkplaceType] = useState('Remote');
  const [location, setLocation] = useState('San Francisco, CA');
  const [salaryMin, setSalaryMin] = useState(130000);
  const [salaryMax, setSalaryMax] = useState(170000);
  const [experienceLevel, setExperienceLevel] = useState('Senior');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [benefits, setBenefits] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const reqArray = requirements
      .split('\n')
      .map(r => r.trim())
      .filter(Boolean);

    const benArray = benefits
      .split('\n')
      .map(b => b.trim())
      .filter(Boolean);

    try {
      await api.createJob({
        title,
        company: user?.companyName || 'CloudScale Inc.',
        location,
        workplaceType,
        jobType,
        salaryMin: Number(salaryMin),
        salaryMax: Number(salaryMax),
        category,
        experienceLevel,
        description,
        requirements: reqArray.length > 0 ? reqArray : ['Proven track record in software engineering', 'Strong communication skills'],
        benefits: benArray.length > 0 ? benArray : ['Health, dental, vision', 'Flexible PTO', 'Remote stipend'],
      });

      router.push('/employer/dashboard');
    } catch (err) {
      console.error('Error creating job', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="employer" activeTab="Post a Job">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Post a New Job
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Reach thousands of vetted candidates worldwide with your opportunity.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Job Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Frontend Engineer (React/Next.js)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option>Software Engineering</option>
                  <option>UI / UX Design</option>
                  <option>Product Management</option>
                  <option>Data Science & AI</option>
                  <option>DevOps & Cloud</option>
                  <option>Growth & Marketing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Job Type
                </label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Workplace
                </label>
                <select
                  value={workplaceType}
                  onChange={(e) => setWorkplaceType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option>Remote</option>
                  <option>Hybrid</option>
                  <option>On-site</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Salary Min ($/yr)
                </label>
                <input
                  type="number"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Salary Max ($/yr)
                </label>
                <input
                  type="number"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Job Description *
              </label>
              <textarea
                required
                rows={5}
                placeholder="Describe the role, responsibilities, and team..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Requirements (one per line)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. 5+ years of experience with React&#10;Deep understanding of PostgreSQL"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-7 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Publishing...' : 'Publish Job'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
