'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, 
  Mail, 
  Lock, 
  User, 
  Building, 
  Globe, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';
import Logo from '../../components/Logo';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [role, setRole] = useState('candidate');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register({
        name,
        email,
        password,
        role,
        companyName: role === 'employer' ? companyName : undefined,
      });

      if (role === 'employer') {
        router.push('/employer/dashboard');
      } else {
        router.push('/candidate/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo size="lg" />
        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Create your account
        </h2>
        <p className="mt-1.5 text-xs text-gray-500">
          Join thousands of developers and tech companies on HireLoop.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-200">
          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setRole('candidate')}
              className={`py-2 text-xs font-bold rounded-xl transition ${
                role === 'candidate' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Job Seeker (Candidate)
            </button>
            <button
              type="button"
              onClick={() => setRole('employer')}
              className={`py-2 text-xs font-bold rounded-xl transition ${
                role === 'employer' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Hiring Team (Employer)
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9 w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder={role === 'employer' ? "work@company.com" : "you@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {role === 'employer' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Corporation"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="pl-9 w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Company Website (Optional)
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="url"
                      placeholder="https://acme.com"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      className="pl-9 w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="flex items-start pt-1">
              <input type="checkbox" required className="rounded border-gray-300 text-blue-600 mt-0.5 mr-2" />
              <span className="text-[11px] text-gray-500 leading-tight">
                I agree to the <a href="#" className="text-blue-600 underline">Terms of Service</a> and <a href="#" className="text-blue-600 underline">Privacy Policy</a>.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-blue-600/30 transition flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Creating account...</span>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
