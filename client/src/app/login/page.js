'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  UserCheck, 
  Building2 
} from 'lucide-react';
import Logo from '../../components/Logo';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password, role);
      if (loggedUser.role === 'employer') {
        router.push('/employer/dashboard');
      } else if (loggedUser.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/candidate/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Logo size="lg" />
        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Welcome back
        </h2>
        <p className="mt-1.5 text-xs text-gray-500">
          Sign in to manage your applications, postings, and recruiting workflow.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-200">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="pl-9 w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Password
                </label>
                <a href="#" className="text-[11px] font-semibold text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center text-xs text-gray-600">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 mr-2" />
                <span>Keep me signed in</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-blue-600/30 transition flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Don't have an account?{' '}
              <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
