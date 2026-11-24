'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Building2, Globe, MapPin, Users, Check } from 'lucide-react';

export default function EmployerProfilePage() {
  const { user } = useAuth();

  const [companyName, setCompanyName] = useState(user?.companyName || 'CloudScale Inc.');
  const [website, setWebsite] = useState('https://cloudscale.io');
  const [industry, setIndustry] = useState('Cloud Infrastructure & Observability');
  const [companySize, setCompanySize] = useState('51-200 employees');
  const [headquarters, setHeadquarters] = useState('San Francisco, CA');
  const [description, setDescription] = useState('CloudScale empowers modern engineering teams with high-throughput cloud observability, telemetry, and resilient microservices orchestration.');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout role="employer" activeTab="My Company">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Company Profile
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Customize how your organization appears to top tech candidates.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 font-black text-2xl flex items-center justify-center border border-blue-100">
                {companyName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{companyName}</h3>
                <p className="text-xs text-gray-500">{industry}</p>
              </div>
            </div>

            {saved && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                <Check className="w-4 h-4" />
                <span>Company updated!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Website URL
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Industry
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Company Size
                </label>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option>1-10 employees</option>
                  <option>11-50 employees</option>
                  <option>51-200 employees</option>
                  <option>201-500 employees</option>
                  <option>500+ employees</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Headquarters
                </label>
                <input
                  type="text"
                  value={headquarters}
                  onChange={(e) => setHeadquarters(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                About the Company
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
              />
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
