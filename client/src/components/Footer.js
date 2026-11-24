'use client';
import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-white text-gray-600 py-12 px-6 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-200">
          {/* Logo & About */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              HireLoop is the modern hiring platform connecting world-class talent with leading companies. Build your career with verified opportunities and direct recruiter access.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> All Systems Operational
              </span>
            </div>
          </div>

          {/* For Candidates */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">For Candidates</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/jobs" className="text-gray-600 hover:text-blue-600 transition-colors">Browse Jobs</Link>
              </li>
              <li>
                <Link href="/companies" className="text-gray-600 hover:text-blue-600 transition-colors">Top Companies</Link>
              </li>
              <li>
                <Link href="/candidate/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">Candidate Dashboard</Link>
              </li>
              <li>
                <Link href="/candidate/saved" className="text-gray-600 hover:text-blue-600 transition-colors">Saved Jobs</Link>
              </li>
              <li>
                <Link href="/candidate/profile" className="text-gray-600 hover:text-blue-600 transition-colors">Profile & Resume</Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">For Employers</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/employer/jobs/new" className="text-gray-600 hover:text-blue-600 transition-colors">Post a Job</Link>
              </li>
              <li>
                <Link href="/employer/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">Employer Dashboard</Link>
              </li>
              <li>
                <Link href="/employer/profile" className="text-gray-600 hover:text-blue-600 transition-colors">Company Profile</Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors">Admin Console</Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About HireLoop</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link href="/companies" className="text-gray-600 hover:text-blue-600 transition-colors">Featured Employers</Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">Sign In</Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-600 hover:text-blue-600 transition-colors">Create Account</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4 pl-12 sm:pl-0">
          <p>© {new Date().getFullYear()} HireLoop Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-gray-900 transition-colors cursor-pointer">About</Link>
            <Link href="/contact" className="hover:text-gray-900 transition-colors cursor-pointer">Contact</Link>
            <span className="hover:text-gray-900 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-900 transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
