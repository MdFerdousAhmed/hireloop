'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap, TrendingUp, Lock, Users, Award, HeartHandshake, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-16 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Our Mission
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-950 tracking-tight mt-4 leading-tight">
            Connecting World-Class Talent With Future-Defining Companies
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mt-4 leading-relaxed">
            HireLoop was founded with a clear commitment: eliminate hiring friction, ensure salary transparency, and give professionals direct recruiter access to genuine opportunities.
          </p>
        </div>

        {/* 4 Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-2">100% Verified Listings</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every job is validated directly with verified employers. We strictly eliminate phantom jobs, expired posts, and unlicensed recruiter reposts.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-2">Speed & Direct Contact</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              No black-hole resume submissions. 84% of candidates on HireLoop receive interview requests or direct feedback within 48 to 72 hours.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-2">Equitable Compensation</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Transparent compensation data is mandatory on our platform. Candidates know the true salary ranges and equity stakes before applying.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-base mb-2">Discreet Job Search</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Browse confidential opportunities without tipping off current managers. You decide which recruiters have access to your full profile.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-3xl p-10 sm:p-12 border border-gray-200 shadow-md">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Seamless Process
            </span>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-3">
              How HireLoop Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm mx-auto md:mx-0">
                1
              </div>
              <h4 className="font-bold text-gray-900 text-lg">Build Your Profile</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Add your technical skillset, career history, and compensation goals in minutes.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center text-sm mx-auto md:mx-0">
                2
              </div>
              <h4 className="font-bold text-gray-900 text-lg">Apply with 1-Click</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Explore curated positions across top tech employers and apply directly to hiring managers.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm mx-auto md:mx-0">
                3
              </div>
              <h4 className="font-bold text-gray-900 text-lg">Interview & Get Hired</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Track status in your candidate dashboard, schedule interviews, and accept competitive offers.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-md"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
