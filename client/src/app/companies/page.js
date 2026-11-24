'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, ArrowRight, Building2, Star, Users } from 'lucide-react';
import CompanyLogo from '../../components/CompanyLogo';

export default function CompaniesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const companies = [
    {
      name: 'Google',
      industry: 'Technology & AI',
      location: 'Mountain View, CA',
      size: '10,000+ employees',
      openJobs: 14,
      rating: 4.8,
      description: 'Building world-changing tools from Search to Android, Cloud, and cutting-edge Gemini AI models.',
      badge: 'google'
    },
    {
      name: 'Microsoft',
      industry: 'Cloud & Enterprise',
      location: 'Redmond, WA',
      size: '10,000+ employees',
      openJobs: 9,
      rating: 4.7,
      description: 'Empowering every person and organization on the planet to achieve more through Azure and Copilot.',
      badge: 'microsoft'
    },
    {
      name: 'Meta',
      industry: 'Social Technologies',
      location: 'Menlo Park, CA',
      size: '10,000+ employees',
      openJobs: 8,
      rating: 4.6,
      description: 'Connecting billions of users worldwide and pioneering the future of immersive social connection.',
      badge: 'meta'
    },
    {
      name: 'Amazon',
      industry: 'E-commerce & AWS',
      location: 'Seattle, USA',
      size: '10,000+ employees',
      openJobs: 12,
      rating: 4.5,
      description: 'Pioneering global e-commerce logistics, cloud compute with AWS, and AI consumer devices.',
      badge: 'amazon'
    },
    {
      name: 'Apple',
      industry: 'Consumer Hardware & OS',
      location: 'Cupertino, CA',
      size: '10,000+ employees',
      openJobs: 7,
      rating: 4.9,
      description: 'Designing intuitive hardware and privacy-centric software ecosystem used by billions.',
      badge: 'apple'
    },
    {
      name: 'Uber',
      industry: 'Mobility & Delivery',
      location: 'San Francisco, CA',
      size: '5,000+ employees',
      openJobs: 5,
      rating: 4.4,
      description: 'Igniting opportunity by setting the world in motion across on-demand transport and freight.',
      badge: 'uber'
    },
    {
      name: 'CloudScale Inc',
      industry: 'Cloud Infrastructure',
      location: 'San Francisco, CA',
      size: '500-1,000 employees',
      openJobs: 6,
      rating: 4.7,
      description: 'Next-generation distributed cloud database infrastructure for mission-critical modern SaaS workloads.',
      badge: 'cloudscale'
    },
    {
      name: 'Apex Security',
      industry: 'Cybersecurity',
      location: 'Seattle, WA',
      size: '200-500 employees',
      openJobs: 4,
      rating: 4.6,
      description: 'Enterprise zero-trust architecture, automated threat detection, and advanced penetration testing.',
      badge: 'apex'
    },
    {
      name: 'OmniStream Health',
      industry: 'HealthTech & AI',
      location: 'San Diego, CA',
      size: '200-500 employees',
      openJobs: 4,
      rating: 4.8,
      description: 'AI-driven clinical diagnostics, telemedicine orchestration, and HIPAA-compliant data pipelines.',
      badge: 'omnistream'
    }
  ];

  const filteredCompanies = companies.filter((c) => {
    const matchQuery = c.name.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || c.industry.includes(category);
    return matchQuery && matchCat;
  });

  const renderBadge = (b, name) => {
    if (b === 'google') {
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
      );
    }
    if (b === 'microsoft') {
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24">
          <rect x="1" y="1" width="10" height="10" fill="#F25022"/>
          <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/>
          <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/>
          <rect x="13" y="13" width="10" height="10" fill="#FFB900"/>
        </svg>
      );
    }
    if (b === 'meta') {
      return (
        <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.92 5C14.88 5 13.06 6.09 12 7.74 10.94 6.09 9.12 5 7.08 5 3.72 5 1 7.77 1 11.18c0 4.19 3.52 7.9 7.82 9.77.72.31 1.54.46 2.37.46.83 0 1.65-.15 2.37-.46C17.86 19.08 21.38 15.37 21.38 11.18 21.38 7.77 18.66 5 15.3 5h1.62zM7.08 17.52c-2.48 0-4.5-2.02-4.5-4.5 0-2.48 2.02-4.5 4.5-4.5 1.54 0 2.92.78 3.75 1.97-.93 1.95-2.22 4.41-3.75 7.03zm9.84 0c-1.53-2.62-2.82-5.08-3.75-7.03.83-1.19 2.21-1.97 3.75-1.97 2.48 0 4.5 2.02 4.5 4.5 0 2.48-2.02 4.5-4.5 4.5z"/>
        </svg>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
        {name.charAt(0)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Company Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-3">
            Explore Leading Tech Employers
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Connect directly with verified engineering teams, hyper-growth startups, and Fortune 500 enterprises.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-2 rounded-xl shadow-md border border-gray-200 flex flex-col sm:flex-row items-center gap-2">
            <div className="flex-1 flex items-center px-4 py-2 w-full">
              <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Search companies by name, industry, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
              />
            </div>
            <div className="hidden sm:block w-px h-8 bg-gray-200"></div>
            <div className="w-full sm:w-48 px-3 py-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-700 font-medium focus:outline-none cursor-pointer"
              >
                <option value="All">All Industries</option>
                <option value="Technology">Technology & AI</option>
                <option value="Cloud">Cloud & Infra</option>
                <option value="Social">Social</option>
                <option value="Security">Cybersecurity</option>
                <option value="HealthTech">HealthTech</option>
              </select>
            </div>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((c) => (
            <div
              key={c.name}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <CompanyLogo company={c.name} size="lg" />
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    ★ {c.rating}
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
    </div>
  );
}
