'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, MapPin, ArrowRight, Building2, ShieldCheck } from 'lucide-react';
import CompanyLogo from '../../components/CompanyLogo';
import { api } from '../../lib/api';

export default function CompaniesPage() {
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getCompanies({
        query: search.trim() || undefined,
        industry: industry === 'All' ? undefined : industry,
      });
      setCompanies(data || []);
    } catch (err) {
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  }, [search, industry]);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Company Directory
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-3">
            Explore Leading Tech Employers
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Connect directly with verified engineering teams and growing technology organizations.
          </p>
        </div>

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
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-700 font-medium focus:outline-none cursor-pointer"
              >
                <option value="All">All Industries</option>
                <option value="Cloud">Cloud Infrastructure</option>
                <option value="AI">Artificial Intelligence</option>
                <option value="Design">Design &amp; Fintech</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="HealthTech">HealthTech</option>
                <option value="Fintech">Fintech &amp; Payments</option>
                <option value="Enterprise">Enterprise SaaS</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-gray-500 font-medium">Loading companies...</p>
          </div>
        ) : companies.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 max-w-md mx-auto shadow-sm">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No matching companies</h3>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search query or industry filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <CompanyLogo company={c.name} size="lg" />
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
                      c.verificationStatus === 'VERIFIED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {c.verificationStatus === 'VERIFIED' ? 'Verified' : 'Pending Review'}
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
                    {c.description || `${c.name} is hiring engineering, design, and product professionals on HireLoop.`}
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
        )}
      </div>
    </div>
  );
}
